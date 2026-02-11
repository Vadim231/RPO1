from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from SessionLocal.schemas.user import UserCreate, UserOut, Token
from app.database.model.user import User
from app.app import get_db
from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=UserOut)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Проверка, существует ли пользователь
    db_user = db.query(User).filter(User.phone_number == user.phone_number).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone number already registered")
    
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    
    # Создание нового пользователя
    new_user = User(
        phone_number=user.phone_number,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        is_premium=False,
        last_online_timestamp=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(phone_number: str, db: Session = Depends(get_db)):
    # Проверка пользователя по номеру телефона
    db_user = db.query(User).filter(User.phone_number == phone_number).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Обновление времени последнего онлайна
    db_user.last_online_timestamp = datetime.utcnow()
    db.commit()
    
    return {
        "access_token": f"token_{db_user.id}",
        "token_type": "bearer"
    }

