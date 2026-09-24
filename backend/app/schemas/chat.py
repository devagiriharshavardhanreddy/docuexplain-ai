from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class SourceCitation(BaseModel):
    document_id: int
    document_name: str
    page_number: int
    chunk_index: int
    relevance_score: float = Field(..., description="Cosine similarity relevance (0.0 to 1.0)")
    evidence_text: str = Field(..., description="Exact textual excerpt supporting the claim")
    highlight_terms: List[str] = []

class XAIMetadata(BaseModel):
    confidence_score: float = Field(..., description="Calibrated confidence (0.0 to 1.0)")
    confidence_level: str = Field(..., description="High, Moderate, Low")
    evidence_coverage: str = Field(..., description="High, Moderate, Low")
    chunks_analyzed: int
    average_relevance: float
    max_relevance: float
    evidence_consistency: float = Field(..., description="Agreement ratio among top chunks (0.0 to 1.0)")
    hallucination_risk: str = Field(..., description="Very Low, Low, Medium, High")
    why_this_answer: str = Field(..., description="Structured explanation of how evidence supported this answer")
    key_facts_found: List[str] = []

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    conversation_id: Optional[int] = None
    document_ids: Optional[List[int]] = None # None means all documents for user
    include_xai: bool = True

class ChatResponse(BaseModel):
    conversation_id: int
    message_id: int
    answer: str
    confidence: float
    sources: List[SourceCitation]
    xai: Optional[XAIMetadata] = None
    created_at: datetime

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    confidence: Optional[float] = None
    sources_json: Optional[List[Dict[str, Any]]] = None
    explainability_json: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True
