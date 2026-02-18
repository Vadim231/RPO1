from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_

from back.SessionLocal.routes.users import User
from exceptions import NotFoundException, ForbiddenException


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    def get_user_by_id(self, user_id: int) -> User:
        stmt = select(User).where(User.id == user_id)
        result = self.db.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
            raise NotFoundException(detail="Такого пользователя нету")
        
        return user
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        stmt = select(User).where(User.username == username)
        result = self.db.execute(stmt)
        
        return result.scalar_one_or_none()
    
    def update_user(
        self, 
        user_id: int, 
        update_data: int,
        current_user_id: int
    ) -> User:
        user =  self.get_user_by_id(user_id)
        
        if user_id != current_user_id:
            raise ForbiddenException(detail="Это чужой профиль его нельзя редачить")
        
        update_dict = update_data.dict(exclude_unset=True)
        for field, value in update_dict.items():
            if field == 'password' and value:
                from .auth_service import pwd_context
                user.password_hash = pwd_context.hash(value)
            elif hasattr(user, field):
                setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        return user
        
    def update_user_status(
        self, 
        user_id: int, 
        is_online: bool,
        last_seen: Optional[datetime] = None
    ) -> None:
        user = self.get_user_by_id(user_id)
        self.db.commit()
