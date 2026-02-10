from fastapi import APIRouter
from SessionLocal.schemas.user import UserCreate, UserOut, Token

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    return {
        "id": 1,
        "phone_number": user.phone_number,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "created_at": "2024-01-01T10:00:00"
    }

@router.post("/login", response_model=Token)
async def login():
    return {
        "access_token": "mock_token_123",
        "token_type": "bearer"
    }
