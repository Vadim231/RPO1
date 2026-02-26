from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import JWTError, jwt
from passlib.context import CryptContext



from back.app.database.model.user import User
from back.SessionLocal.schemas.user import UserCreate
from back.SessionLocal.schemas.user import UserOut


from .exceptions import UserAlreadyExistsException,InvalidCredentialsException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
#тест говно тест говно
ACCESS_TOKEN_EXPIRE_MINUTES = 10
JWT_SECRET_KEY = 31434432
JWT_ALGORITHM = 5438534

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def register_user(self, user_data: UserCreate) -> User:
        existing_user = self.db.execute(
            select(User).where(
                (User.username == user_data.username) |
                (User.email == user_data.email)
            )
        )
        if existing_user.scalar_one_or_none():
            raise UserAlreadyExistsException()
        
    def create_access_token(self, user: User) -> str:
        to_encode = {
            "sub": str(user.id),
            "username": user.username,
            "exp": datetime.utcnow() + timedelta(
                minutes=ACCESS_TOKEN_EXPIRE_MINUTES
            )
        }
        encoded_jwt = jwt.encode(
            to_encode, 
            JWT_SECRET_KEY, 
            algorithm=JWT_ALGORITHM
        )
        return encoded_jwt
    def authenticate_user(self, login_data: UserOut) -> User:
        stmt = select(User).where(
            (User.username == login_data.username_or_email) |
            (User.email == login_data.username_or_email)
        )
        result = self.db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user or not self._verify_password(
            login_data.password, 
            user.password_hash
        ):
            raise InvalidCredentialsException()

        return user

    def _hash_password(self, password: str) -> str:
        return pwd_context.hash(password)
