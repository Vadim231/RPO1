from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from SessionLocal.schemas.user import UserOut
from app.database.model.user import User
from app.app import get_db

router = APIRouter()

@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

@router.get("/search", response_model=List[UserOut])
async def search_users(q: str, db: Session = Depends(get_db)):
    users = db.query(User).filter(
        (User.username.ilike(f"%{q}%")) |
        (User.first_name.ilike(f"%{q}%")) |
        (User.last_name.ilike(f"%{q}%"))
    ).all()
    return users

@router.put("/{user_id}", response_model=UserOut)
async def update_user(user_id: int, user_data: dict, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Обновить поля, которые есть в модели
    for field in ["first_name", "last_name", "bio", "is_premium"]:
        if field in user_data:
            setattr(db_user, field, user_data[field])
    
    db.commit()
    db.refresh(db_user)
    return db_user

