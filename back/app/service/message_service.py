from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc, func

from back.app.database.model.message import Message

from back.app.database.model.user_channel import User_Channel


from .exceptions import NotFoundException, ForbiddenException
class MessageService:
    def __init__(self, db: AsyncSession):
        self.db = db

 
    def send_message(
        self, 
        chat_id: int,
        sender_id: int,
        content: str,
        attachment_url: Optional[str] = None
    ) -> Message:
        stmt = select(User_Channel).where(
            User_Channel.chat_id == chat_id,
            User_Channel.user_id == sender_id
        )
        result = self.db.execute(stmt)
        if not result.scalar_one_or_none():
            raise ForbiddenException(detail="Вы не участник этого чата")
        message = Message(
            chat_id=chat_id,
            sender_id=sender_id,
            content=content,
            attachment_url=attachment_url,
            is_read=False,
            created_at=datetime.utcnow()
        )
        
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)
    
        self.db.refresh(message, ['sender', 'chat'])
        
        return message


    def get_chat_messages():
        ... 


    def mark_as_read():
        ... 


    def update_message():
        ... 
