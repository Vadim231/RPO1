from typing import List, Optional, Set
from datetime import datetime, timezone
from sqlalchemy import func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.models.chat import Chat, ChatUser
from app.models.user import User
from app.schemas.chat import ChatCreate, ChatType
from .exceptions import (
    NotFoundException,
    ForbiddenException,
    UserAlreadyExistsException
)


class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_private_chat(
        self, 
        user1_id: int, 
        user2_id: int
    ) -> Chat:
        stmt = select(User).where(User.id.in_([user1_id, user2_id]))
        result = await self.db.execute(stmt)
        users = result.scalars().all()
        
        found_ids = {user.id for user in users}
        if user1_id not in found_ids or user2_id not in found_ids:
            raise NotFoundException("Один из пользователей не найден")
        
        existing_chat = await self._find_existing_private_chat(user1_id, user2_id)
        if existing_chat:
            return existing_chat
        
        chat = Chat(
            is_group=False,
            created_at=datetime.now(timezone.utc)
        )
        self.db.add(chat)
        await self.db.flush()
        
        chat_users = [
            ChatUser(chat_id=chat.id, user_id=user1_id),
            ChatUser(chat_id=chat.id, user_id=user2_id)
        ]
        self.db.add_all(chat_users)
        
        await self.db.commit()
        await self.db.refresh(chat)
        
        return chat

    async def create_group_chat(
        self, 
        creator_id: int, 
        title: str,
        user_ids: List[int]
    ) -> Chat:
        all_user_ids = set(user_ids) | {creator_id}
        
        stmt = select(User).where(User.id.in_(all_user_ids))
        result = await self.db.execute(stmt)
        users = result.scalars().all()
        
        found_ids = {user.id for user in users}
        missing_ids = all_user_ids - found_ids
        if missing_ids:
            raise NotFoundException(f"Пользователи не найдены: {missing_ids}")
        
        chat = Chat(
            is_group=True,
            title=title,
            created_at=datetime.now(timezone.utc)
        )
        self.db.add(chat)
        await self.db.flush()
        
        chat_users = [
            ChatUser(
                chat_id=chat.id,
                user_id=user_id,
                role="admin" if user_id == creator_id else "member"
            )
            for user_id in all_user_ids
        ]
        
        self.db.add_all(chat_users)
        await self.db.commit()
        await self.db.refresh(chat)
        
        return chat

    async def get_user_chats(
        self, 
        user_id: int,
        skip: int = 0,
        limit: int = 50
    ) -> List[Chat]:
        stmt = (
            select(Chat)
            .join(ChatUser)
            .where(ChatUser.user_id == user_id)
            .options(
                selectinload(Chat.chat_users).selectinload(ChatUser.user)
            )
            .order_by(Chat.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_chat_with_participants(
        self, 
        chat_id: int,
        user_id: int
    ) -> Chat:
        stmt = (
            select(Chat)
            .join(ChatUser)
            .where(
                Chat.id == chat_id,
                ChatUser.user_id == user_id
            )
            .options(
                selectinload(Chat.chat_users).selectinload(ChatUser.user)
            )
        )
        
        result = await self.db.execute(stmt)
        chat = result.scalar_one_or_none()
        
        if not chat:
            raise NotFoundException("Чат не найден или доступ запрещен")
            
        return chat

    async def add_user_to_chat(
        self, 
        chat_id: int, 
        user_id: int,
        current_user_id: int
    ) -> None:
        chat = await self.get_chat_with_participants(chat_id, current_user_id)
        
        if not chat.is_group:
            raise ForbiddenException("Нельзя добавлять пользователей в личный чат")
        
        current_chat_user = next(
            (cu for cu in chat.chat_users if cu.user_id == current_user_id), 
            None
        )
        if not current_chat_user or current_chat_user.role != "admin":
            raise ForbiddenException("Только администратор может добавлять участников")
        
        if any(cu.user_id == user_id for cu in chat.chat_users):
            raise UserAlreadyExistsException("Пользователь уже в чате")
        
        user_stmt = select(User).where(User.id == user_id)
        user_result = await self.db.execute(user_stmt)
        user = user_result.scalar_one_or_none()
        
        if not user:
            raise NotFoundException("Пользователь не найден")
        
        new_chat_user = ChatUser(
            chat_id=chat_id,
            user_id=user_id,
            role="member"
        )
        self.db.add(new_chat_user)
        await self.db.commit()

    async def _find_existing_private_chat(
        self, 
        user1_id: int, 
        user2_id: int
    ) -> Optional[Chat]:
        stmt = (
            select(Chat)
            .join(ChatUser)
            .where(
                and_(
                    Chat.is_group == False,
                    ChatUser.user_id.in_([user1_id, user2_id])
                )
            )
            .group_by(Chat.id)
            .having(func.count(ChatUser.user_id) == 2)
        )
        
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
