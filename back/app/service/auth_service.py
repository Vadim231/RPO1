from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import JWTError, jwt
from passlib.context import CryptContext



from back.app.database.model.user import User
from back.SessionLocal.schemas.user import UserCreate
from back.SessionLocal.schemas.user import UserOut

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def register_user(self, user_data: UserCreate) -> User:
        ...

    def authenticate_user(self, login_data: UserOut) -> User:
        ...

    def _hash_password(self, password: str) -> str:
        return pwd_context.hash(password)
