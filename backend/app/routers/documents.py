import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.document import Document
from app.models.chunk import DocumentChunk
from app.schemas.document import DocumentResponse, DocumentDetailResponse, UploadResponse
from app.auth.dependencies import get_current_user
from app.config import settings
from app.services.doc_parser import DocumentParser
from app.services.chunker import DocumentChunker
from app.services.vector_store import vector_store

router = APIRouter(prefix="/documents", tags=["Documents"])

SUPPORTED_EXTENSIONS = {"pdf", "docx", "doc", "pptx", "ppt", "txt", "md", "csv", "rtf", "json", "log"}

@router.post("/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    original_filename = file.filename or "uploaded_document.txt"
    ext = original_filename.split(".")[-1].lower() if "." in original_filename else "txt"
    
    if ext not in SUPPORTED_EXTENSIONS:
        # Fallback accept if text-based
        ext = "txt"

    # Generate unique filename on disk
    unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    # Read and save file
    content = await file.read()
    file_size = len(content)
    with open(file_path, "wb") as f:
        f.write(content)

    # Initialize document record
    doc = Document(
        user_id=current_user.id,
        filename=unique_filename,
        original_filename=original_filename,
        file_path=file_path,
        file_type=ext,
        file_size=file_size,
        status="extracting"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    try:
        # Step 1: Parse pages
        pages = DocumentParser.parse_file(file_path, ext)
        doc.page_count = max(1, len(pages))
        doc.status = "chunking"
        db.commit()

        # Step 2: Semantic Chunking
        chunks_data = DocumentChunker.chunk_document(pages)
        if not chunks_data:
            # If empty text extracted, create at least 1 fallback chunk
            chunks_data = [{
                "chunk_index": 0,
                "page_number": 1,
                "content": f"Document {original_filename} uploaded successfully.",
                "clean_content": f"Document {original_filename} uploaded successfully.",
                "token_count": 5
            }]

        doc.chunk_count = len(chunks_data)
        doc.status = "embedding"
        db.commit()

        # Step 3: Save chunks in relational database
        chunk_models = []
        for c in chunks_data:
            chunk_models.append(DocumentChunk(
                document_id=doc.id,
                chunk_index=c["chunk_index"],
                page_number=c["page_number"],
                content=c["content"],
                clean_content=c["clean_content"],
                token_count=c["token_count"]
            ))
        db.bulk_save_objects(chunk_models)
        db.commit()

        # Step 4: Generate Embeddings & Index in ChromaDB
        doc.status = "indexing"
        db.commit()

        vector_store.add_document_chunks(
            user_id=current_user.id,
            document_id=doc.id,
            document_name=original_filename,
            chunks=chunks_data
        )

        doc.status = "ready"
        db.commit()
        db.refresh(doc)

        return {
            "message": "Document successfully processed and indexed with Explainable AI vectors.",
            "document": doc
        }

    except Exception as e:
        doc.status = "error"
        doc.error_message = str(e)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process document: {str(e)}"
        )

@router.get("", response_model=List[DocumentResponse])
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).all()
    return docs

@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return doc

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    
    # Remove from ChromaDB
    vector_store.delete_document(user_id=current_user.id, document_id=document_id)

    # Remove physical file if exists
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully."}
