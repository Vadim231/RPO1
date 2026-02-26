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
            raise NotFoundException(detail="Пользователь не найден")
            
        return user

    def get_user_by_username(self, username: str) -> Optional[User]:
        stmt = select(User).where(User.username == username)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def search_users(
        self, 
        current_user_id: int, 
        query: str,
        limit: int = 20,
        offset: int = 0
    ) -> List[User]:
        stmt = select(User).where(
            User.id != current_user_id,
            or_(
                User.username.ilike(f"%{query}%"),
                User.display_name.ilike(f"%{query}%"),
                User.email.ilike(f"%{query}%")
            )
        ).limit(limit).offset(offset)
        
        result = self.db.execute(stmt)
        return result.scalars().all()

    def update_user(
        self, 
        user_id: int, 
        update_data: User,
        current_user_id: int
    ) -> User:
        if user_id != current_user_id:
            raise ForbiddenException(detail="Нельзя редактировать чужой профиль")
        
        user = self.get_user_by_id(user_id)
        
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
