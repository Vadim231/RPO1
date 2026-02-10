from fastapi import APIRouter
from typing import List
from SessionLocal.schemas.chat import ChatOut, ChatCreate
from SessionLocal.schemas.message import MessageOut

router = APIRouter()

@router.get("/", response_model=List[ChatOut])
async def get_my_chats():
    return [
        {"id": 1, "type": "group", "title": "Рабочий чат", "created_at": "2024-01-01T10:00:00"},
        {"id": 2, "type": "private", "title": "Алексей", "created_at": "2024-01-01T11:00:00"}
    ]

@router.post("/", response_model=ChatOut)
async def create_chat(chat: ChatCreate):
    return {
        "id": 99,
        "type": chat.type,
        "title": chat.title or "Новый чат",
        "created_at": "2024-01-01T12:00:00"
    }

@router.get("/{chat_id}/messages", response_model=List[MessageOut])
async def get_messages(chat_id: int):
    return [
        {
            "id": 10, 
            "sender_id": 1, 
            "chat_id": chat_id, 
            "content": "Привет! Это тестовое сообщение.", 
            "created_at": "2024-01-01T12:05:00"
        }
    ]
