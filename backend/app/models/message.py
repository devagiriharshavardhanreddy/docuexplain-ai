from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    role = Column(String, nullable=False) # user or assistant
    content = Column(Text, nullable=False)
    
    # XAI metadata for assistant messages
    confidence = Column(Float, nullable=True) # 0.0 to 1.0
    sources_json = Column(JSON, nullable=True) # List of source citations
    explainability_json = Column(JSON, nullable=True) # Detailed XAI metrics & reasoning
    
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")
