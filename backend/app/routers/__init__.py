from app.routers.auth import router as auth_router
from app.routers.documents import router as documents_router
from app.routers.chat import router as chat_router
from app.routers.search import router as search_router
from app.routers.summary import router as summary_router
from app.routers.analytics import router as analytics_router

__all__ = ["auth_router", "documents_router", "chat_router", "search_router", "summary_router", "analytics_router"]
