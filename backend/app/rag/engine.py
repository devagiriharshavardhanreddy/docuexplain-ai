from typing import List, Dict, Any, Optional, Tuple
from app.rag.retriever import retriever
from app.services.llm_service import llm_service
from app.xai.explainer import xai_engine
from app.config import settings
from app.schemas.chat import SourceCitation, XAIMetadata

class RAGEngine:
    @staticmethod
    def answer_query(
        user_id: int,
        query: str,
        document_ids: Optional[List[int]] = None,
        include_xai: bool = True
    ) -> Tuple[str, float, List[SourceCitation], Optional[XAIMetadata]]:
        # Step 1: Vector similarity retrieval
        retrieved_chunks = retriever.retrieve(
            user_id=user_id,
            query=query,
            top_k=settings.TOP_K_RETRIEVAL,
            document_ids=document_ids
        )

        # Check retrieval confidence
        max_similarity = max([c.get("similarity", 0.0) for c in retrieved_chunks]) if retrieved_chunks else 0.0
        
        # If no chunks or similarity is too low, trigger non-hallucination fallback
        if not retrieved_chunks or max_similarity < settings.MIN_CONFIDENCE_THRESHOLD:
            fallback_answer = "I couldn't find sufficient evidence in the uploaded documents to answer this question."
            sources, xai = xai_engine.build_citations_and_xai(
                query=query,
                retrieved_chunks=retrieved_chunks,
                answer=fallback_answer,
                is_fallback=True
            )
            return fallback_answer, xai.confidence_score, sources, xai

        # Step 2: Context-grounded LLM generation
        answer = llm_service.generate_answer(query=query, retrieved_chunks=retrieved_chunks)

        # Step 3: Explainable AI attribution & confidence scoring
        sources, xai = xai_engine.build_citations_and_xai(
            query=query,
            retrieved_chunks=retrieved_chunks,
            answer=answer,
            is_fallback=False
        )

        return answer, xai.confidence_score, sources, xai

rag_engine = RAGEngine()
