from fastapi import APIRouter
from typing import List
from SessionLocal.schemas.user import UserOut

router = APIRouter()

@router.get("/search", response_model=List[UserOut])
async def search_users(q: str): 
    return [
        {
            "id": 1, 
            "phone_number": "+70000000000", 
            "username": q, 
            "first_name": "Test", 
            "last_name": "User", 
            "created_at": "2024-01-01T12:00:00" 
        }
    ]
