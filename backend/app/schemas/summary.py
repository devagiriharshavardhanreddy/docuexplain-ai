from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class SummaryRequest(BaseModel):
    document_id: int
    summary_type: str = Field("detailed", description="short, detailed, executive, key_points, terms, action_items")

class SummaryResponse(BaseModel):
    document_id: int
    document_name: str
    summary_type: str
    content: str
    key_points: List[str] = []
    action_items: List[str] = []
    important_terms: List[Dict[str, str]] = []
    created_at: datetime
