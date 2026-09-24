from typing import List, Dict, Any, Optional
from app.services.vector_store import vector_store
from app.config import settings

class RAGRetriever:
    @staticmethod
    def retrieve(
        user_id: int,
        query: str,
        top_k: int = settings.TOP_K_RETRIEVAL,
        document_ids: Optional[List[int]] = None
    ) -> List[Dict[str, Any]]:
        # Vector similarity search in ChromaDB
        results = vector_store.search_similar(
            user_id=user_id,
            query=query,
            top_k=top_k,
            document_ids=document_ids
        )
        return results

retriever = RAGRetriever()
