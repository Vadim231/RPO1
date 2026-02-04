from fastapi import APIRouter
from .users import router as user_router
from .auth import router as auth_router
from .chats import router as chat_router

api_router = APIRouter()

api_router.include_router(user_router)
api_router.include_router(auth_router)
api_router.include_router(chat_router)
