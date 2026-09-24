from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.document import Document
from app.models.chunk import DocumentChunk
from app.models.summary import DocumentSummary
from app.schemas.summary import SummaryRequest, SummaryResponse
from app.auth.dependencies import get_current_user
from app.services.summarizer_service import summarizer_service

router = APIRouter(prefix="/summarize", tags=["Summarization"])

@router.post("", response_model=SummaryResponse)
def summarize_doc(
    req: SummaryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(
        Document.id == req.document_id,
        Document.user_id == current_user.id
    ).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    chunks = db.query(DocumentChunk).filter(DocumentChunk.document_id == doc.id).order_by(DocumentChunk.chunk_index.asc()).all()
    chunk_dicts = [{"clean_content": c.clean_content, "content": c.content, "page_number": c.page_number} for c in chunks]

    summary_result = summarizer_service.summarize_document(
        document_name=doc.original_filename,
        chunks=chunk_dicts,
        summary_type=req.summary_type
    )

    # Save to history
    saved = DocumentSummary(
        document_id=doc.id,
        user_id=current_user.id,
        summary_type=req.summary_type,
        content=summary_result["content"],
        metadata_json={
            "key_points": summary_result["key_points"],
            "action_items": summary_result["action_items"],
            "important_terms": summary_result["important_terms"]
        }
    )
    db.add(saved)
    db.commit()

    return {
        "document_id": doc.id,
        "document_name": doc.original_filename,
        "summary_type": req.summary_type,
        "content": summary_result["content"],
        "key_points": summary_result["key_points"],
        "action_items": summary_result["action_items"],
        "important_terms": summary_result["important_terms"],
        "created_at": saved.created_at
    }
