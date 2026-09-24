from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.chat import ChatRequest, ChatResponse, ConversationResponse
from app.auth.dependencies import get_current_user
from app.rag.engine import rag_engine

router = APIRouter(prefix="/chat", tags=["Chat & XAI"])

@router.post("", response_model=ChatResponse)
def chat_with_documents(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Retrieve or create conversation
    if req.conversation_id:
        conversation = db.query(Conversation).filter(
            Conversation.id == req.conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found.")
    else:
        # Truncate question for title
        title = (req.message[:35] + "...") if len(req.message) > 35 else req.message
        conversation = Conversation(user_id=current_user.id, title=title)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    # Save User message
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=req.message
    )
    db.add(user_msg)
    db.commit()

    # Query RAG + XAI Engine
    answer, confidence, sources, xai = rag_engine.answer_query(
        user_id=current_user.id,
        query=req.message,
        document_ids=req.document_ids,
        include_xai=req.include_xai
    )

    # Save Assistant message with structured XAI metadata
    sources_dict_list = [s.model_dump() for s in sources]
    xai_dict = xai.model_dump() if xai else None

    assistant_msg = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=answer,
        confidence=confidence,
        sources_json=sources_dict_list,
        explainability_json=xai_dict
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    # Touch conversation updated_at
    conversation.updated_at = datetime.utcnow()
    db.commit()

    return {
        "conversation_id": conversation.id,
        "message_id": assistant_msg.id,
        "answer": answer,
        "confidence": confidence,
        "sources": sources,
        "xai": xai,
        "created_at": assistant_msg.created_at
    }

@router.get("/conversations", response_model=List[ConversationResponse])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    convs = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(Conversation.updated_at.desc()).all()
    return convs

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation_history(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return conv

@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    db.delete(conv)
    db.commit()
    return {"message": "Conversation deleted successfully."}
