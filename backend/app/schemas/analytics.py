from pydantic import BaseModel
from typing import List, Dict, Any

class AnalyticsOverview(BaseModel):
    total_documents: int
    total_pages: int
    total_questions: int
    total_answers: int
    average_confidence: float # percentage e.g. 91.4%
    average_relevance: float
    high_confidence_ratio: float
    
    confidence_distribution: List[Dict[str, Any]] # e.g. [{ range: "90-100%", count: 15 }, ...]
    activity_trends: List[Dict[str, Any]] # e.g. [{ date: "Aug 24", questions: 5, uploads: 2 }]
    top_documents: List[Dict[str, Any]]
    document_types: List[Dict[str, Any]]
