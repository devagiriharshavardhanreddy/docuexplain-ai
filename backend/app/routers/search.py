from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.search import SearchRequest, SearchResponse, SearchResultItem
from app.auth.dependencies import get_current_user
from app.services.vector_store import vector_store
from app.xai.explainer import ExplainableAIEngine

router = APIRouter(prefix="/search", tags=["Semantic Search"])

@router.post("", response_model=SearchResponse)
def semantic_search(
    req: SearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = vector_store.search_similar(
        user_id=current_user.id,
        query=req.query,
        top_k=req.top_k,
        document_ids=req.document_ids
    )

    items = []
    for r in results:
        if r.get("similarity", 0.0) >= req.min_score:
            matched = ExplainableAIEngine.find_highlight_terms(req.query, r.get("content", ""))
            items.append(SearchResultItem(
                document_id=r["document_id"],
                document_name=r["document_name"],
                page_number=r.get("page_number", 1),
                chunk_index=r.get("chunk_index", 0),
                content=r.get("content", ""),
                relevance_score=round(r.get("similarity", 0.0), 4),
                matched_terms=matched
            ))

    return {
        "query": req.query,
        "total_results": len(items),
        "results": items
    }
