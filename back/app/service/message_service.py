from typing import List, Optional, Tuple, Dict
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, and_, func, desc
from sqlalchemy.orm import selectinload
from back.app.database.model.message import Message
from back.app.database.model.user_channel import User_Channel
from back.app.database.model.chat import Chat
from app.schemas.message import MessageCreate, MessageUpdate
from .exceptions import NotFoundException, ForbiddenException


class MessageService:
    EDIT_TIME_LIMIT_SECONDS = 15 * 60
    DEFAULT_LIMIT = 50
    MAX_LIMIT = 100
    
    def __init__(self, db: AsyncSession):
        self.db = db

    async def send_message(
        self, 
        chat_id: int,
        sender_id: int,
        content: str,
        attachment_url: Optional[str] = None
    ) -> Message:
        stmt = select(User_Channel).where(
            and_(
                User_Channel.chat_id == chat_id,
                User_Channel.user_id == sender_id
            )
        )
        result = await self.db.execute(stmt)
        if not result.scalar_one_or_none():
            raise ForbiddenException(detail="Вы не участник этого чата")
        
        message = Message(
            chat_id=chat_id,
            sender_id=sender_id,
            content=content,
            attachment_url=attachment_url,
            is_read=False,
            is_deleted=False,
            created_at=datetime.utcnow()
        )
        
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message, ['sender', 'chat'])
        
        return message

    async def get_chat_messages(
        self, 
        chat_id: int,
        user_id: int,
        limit: int = DEFAULT_LIMIT,
        offset: int = 0,
        before: Optional[datetime] = None,
        include_deleted: bool = False
    ) -> Tuple[List[Message], int]:
        stmt = select(User_Channel).where(
            and_(
                User_Channel.chat_id == chat_id,
                User_Channel.user_id == user_id
            )
        )
        result = await self.db.execute(stmt)
        if not result.scalar_one_or_none():
            raise ForbiddenException(detail="Доступ к чату запрещен")
        
        limit = min(limit, self.MAX_LIMIT)
        
        conditions = [Message.chat_id == chat_id]
        
        if not include_deleted:
            conditions.append(Message.is_deleted == False)
        
        if before:
            conditions.append(Message.created_at < before)
        
        count_stmt = select(func.count(Message.id)).where(and_(*conditions))
        total = (await self.db.execute(count_stmt)).scalar_one()
        
        query = (
            select(Message)
            .where(and_(*conditions))
            .options(selectinload(Message.sender))
            .order_by(desc(Message.created_at))
            .limit(limit)
            .offset(offset)
        )
        
        result = await self.db.execute(query)
        messages = result.scalars().all()
        messages.reverse()
        
        return messages, total

    async def get_message(
        self,
        message_id: int,
        user_id: int,
        include_deleted: bool = False
    ) -> Message:
        message = await self._get_message_by_id(message_id, include_deleted)
        
        stmt = select(User_Channel).where(
            and_(
                User_Channel.chat_id == message.chat_id,
                User_Channel.user_id == user_id
            )
        )
        result = await self.db.execute(stmt)
        if not result.scalar_one_or_none():
            raise ForbiddenException(detail="Доступ к чату запрещен")
        
        return message

    async def mark_as_read(
        self, 
        message_id: int,
        user_id: int
    ) -> Message:
        message = await self._get_message_by_id(message_id)
        
        stmt = select(User_Channel).where(
            and_(
                User_Channel.chat_id == message.chat_id,
                User_Channel.user_id == user_id
            )
        )
        result = await self.db.execute(stmt)
        if not result.scalar_one_or_none():
            raise ForbiddenException(detail="Вы не участник этого чата")
        
        if message.sender_id != user_id and not message.is_read:
            message.is_read = True
            await self.db.commit()
            await self.db.refresh(message)
        
        return message

    async def mark_all_as_read(
        self,
        chat_id: int,
        user_id: int
    ) -> int:
        stmt = select(User_Channel).where(
            and_(
                User_Channel.chat_id == chat_id,
                User_Channel.user_id == user_id
            )
        )
        result = await self.db.execute(stmt)
        if not result.scalar_one_or_none():
            raise ForbiddenException(detail="Доступ к чату запрещен")
        
        stmt = (
            update(Message)
            .where(
                and_(
                    Message.chat_id == chat_id,
                    Message.sender_id != user_id,
                    Message.is_read == False,
                    Message.is_deleted == False
                )
            )
            .values(is_read=True)
            .returning(Message.id)
        )
        
        result = await self.db.execute(stmt)
        updated_count = len(result.all())
        await self.db.commit()
        
        return updated_count

    async def get_unread_count(
        self,
        chat_id: int,
        user_id: int
    ) -> int:
        stmt = select(User_Channel).where(
            and_(
                User_Channel.chat_id == chat_id,
                User_Channel.user_id == user_id
            )
        )
        result = await self.db.execute(stmt)
        if not result.scalar_one_or_none():
            raise ForbiddenException(detail="Доступ к чату запрещен")
        
        stmt = select(func.count(Message.id)).where(
            and_(
                Message.chat_id == chat_id,
                Message.sender_id != user_id,
                Message.is_read == False,
                Message.is_deleted == False
            )
        )
        
        result = await self.db.execute(stmt)
        return result.scalar_one()

    async def get_unread_counts_by_chats(
        self,
        user_id: int,
        chat_ids: List[int]
    ) -> Dict[int, int]:
        if not chat_ids:
            return {}
        
        for chat_id in chat_ids:
            stmt = select(User_Channel).where(
                and_(
                    User_Channel.chat_id == chat_id,
                    User_Channel.user_id == user_id
                )
            )
            result = await self.db.execute(stmt)
            if not result.scalar_one_or_none():
                raise ForbiddenException(detail=f"Доступ к чату {chat_id} запрещен")
        
        stmt = (
            select(
                Message.chat_id,
                func.count(Message.id).label('unread_count')
            )
            .where(
                and_(
                    Message.chat_id.in_(chat_ids),
                    Message.sender_id != user_id,
                    Message.is_read == False,
                    Message.is_deleted == False
                )
            )
            .group_by(Message.chat_id)
        )
        
        result = await self.db.execute(stmt)
        return dict(result.all())

    async def update_message(
        self, 
        message_id: int,
        user_id: int,
        update_data: MessageUpdate
    ) -> Message:
        message = await self._get_message_by_id(message_id)
        
        if message.sender_id != user_id:
            raise ForbiddenException(detail="Вы не можете редактировать это сообщение")
        
        time_diff = (datetime.utcnow() - message.created_at).total_seconds()
        if time_diff > self.EDIT_TIME_LIMIT_SECONDS:
            raise ForbiddenException(detail="Время редактирования истекло")
        
        update_dict = update_data.dict(exclude_unset=True)
        
        for field, value in update_dict.items():
            if hasattr(message, field):
                setattr(message, field, value)
        
        message.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(message)
        
        return message

    async def delete_message(
        self, 
        message_id: int,
        user_id: int,
        hard_delete: bool = False
    ) -> None:
        message = await self._get_message_by_id(message_id)
        
        can_delete = message.sender_id == user_id
        
        if not can_delete:
            is_admin = await self._is_chat_admin(message.chat_id, user_id)
            if not is_admin:
                raise ForbiddenException(detail="Вы не можете удалить это сообщение")
        
        if hard_delete:
            if not await self._is_chat_admin(message.chat_id, user_id):
                raise ForbiddenException(detail="Только администраторы могут полностью удалять сообщения")
            
            await self.db.delete(message)
        else:
            message.is_deleted = True
            message.deleted_at = datetime.utcnow()
            message.deleted_by = user_id
        
        await self.db.commit()

    async def restore_message(
        self,
        message_id: int,
        user_id: int
    ) -> Message:
        message = await self._get_message_by_id(message_id, include_deleted=True)
        
        if not await self._is_chat_admin(message.chat_id, user_id):
            raise ForbiddenException(detail="Только администраторы могут восстанавливать сообщения")
        
        if message.is_deleted:
            message.is_deleted = False
            message.deleted_at = None
            message.deleted_by = None
            await self.db.commit()
            await self.db.refresh(message)
        
        return message

    async def search_messages(
        self,
        chat_id: int,
        user_id: int,
        query: str,
        limit: int = DEFAULT_LIMIT,
        offset: int = 0
    ) -> Tuple[List[Message], int]:
        stmt = select(User_Channel).where(
            and_(
                User_Channel.chat_id == chat_id,
                User_Channel.user_id == user_id
            )
        )
        result = await self.db.execute(stmt)
        if not result.scalar_one_or_none():
            raise ForbiddenException(detail="Доступ к чату запрещен")
        
        limit = min(limit, self.MAX_LIMIT)
        search_pattern = f"%{query}%"
        
        conditions = [
            Message.chat_id == chat_id,
            Message.is_deleted == False,
            Message.content.ilike(search_pattern)
        ]
        
        count_stmt = select(func.count(Message.id)).where(and_(*conditions))
        total = (await self.db.execute(count_stmt)).scalar_one()
        
        stmt = (
            select(Message)
            .where(and_(*conditions))
            .options(selectinload(Message.sender))
            .order_by(desc(Message.created_at))
            .limit(limit)
            .offset(offset)
        )
        
        result = await self.db.execute(stmt)
        messages = result.scalars().all()
        
        return messages, total

    async def _get_message_by_id(
        self, 
        message_id: int,
        include_deleted: bool = False
    ) -> Message:
        stmt = select(Message).where(Message.id == message_id)
        
        if not include_deleted:
            stmt = stmt.where(Message.is_deleted == False)
        
        stmt = stmt.options(selectinload(Message.sender))
        
        result = await self.db.execute(stmt)
        message = result.scalar_one_or_none()
        
        if not message:
            raise NotFoundException(detail="Сообщение не найдено")
        
        return message

    async def _is_chat_member(self, chat_id: int, user_id: int) -> bool:
        stmt = select(User_Channel).where(
            and_(
                User_Channel.chat_id == chat_id,
                User_Channel.user_id == user_id
            )
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none() is not None

    async def _is_chat_admin(self, chat_id: int, user_id: int) -> bool:
        stmt = select(User_Channel).where(
            and_(
                User_Channel.chat_id == chat_id,
                User_Channel.user_id == user_id,
                User_Channel.role == "admin"
            )
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none() is not None
