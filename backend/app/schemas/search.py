from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    document_ids: Optional[List[int]] = None
    top_k: int = 10
    min_score: float = 0.2

class SearchResultItem(BaseModel):
    document_id: int
    document_name: str
    page_number: int
    chunk_index: int
    content: str
    relevance_score: float # 0.0 to 1.0
    matched_terms: List[str] = []

class SearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[SearchResultItem]
