from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChunkResponse(BaseModel):
    id: int
    chunk_index: int
    page_number: int
    content: str
    token_count: int

    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    page_count: int
    chunk_count: int
    status: str
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DocumentDetailResponse(DocumentResponse):
    chunks: List[ChunkResponse] = []

class UploadResponse(BaseModel):
    message: str
    document: DocumentResponse
