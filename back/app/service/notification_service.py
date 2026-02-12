from typing import Dict, List, Optional, Set, Any, Union
from datetime import datetime
from enum import Enum
import json
import asyncio

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from back.app.database.model.user import User
from back.app.database.model.message import Message as Jena_pituh

import logging

logger = logging.getLogger(__name__)



class NotificationType(str, Enum):

    """Типы уведомлений"""
    NEW_MESSAGE = "new_message"
    MESSAGE_READ = "message_read"
    MESSAGE_DELIVERED = "message_delivered"
    USER_TYPING = "user_typing"
    USER_ONLINE = "user_online"
    USER_OFFLINE = "user_offline"
    USER_UPDATED = "user_updated"
    CHAT_CREATED = "chat_created"
    USER_ADDED_TO_CHAT = "user_added_to_chat"
    USER_REMOVED_FROM_CHAT = "user_removed_from_chat"
    CHAT_TITLE_UPDATED = "chat_title_updated"
    MESSAGE_EDITED = "message_edited"
    MESSAGE_DELETED = "message_deleted"
    CALL_INCOMING = "call_incoming"  
    CALL_ENDED = "call_ended"


class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.typing_timers: Dict[str, asyncio.Task] = {}

    
    def notify_new_message(self, message, exclude_user_id: Optional[int] = None) -> None:
        ... 



    def notify_message_read( self,message_id: int,chat_id: int,user_id: int ) -> None:
        ...


    def notify_message_delivered(self,message_id: int,chat_id: int,user_id: int) -> None:
        ...

    def notify_user_typing(self,chat_id: int,user_id: int,is_typing: bool) -> None:
        ...


    def notify_user_status(self,user_id: int,is_online: bool,last_seen: Optional[datetime] = None) -> None:
        ...



    def notify_chat_created(self,chat: Jena_pituh ,created_by_user_id: int) -> None:
        ...



    def notify_user_added_to_chat(self,chat_id: int, added_user_id: int,added_by_user_id: int) -> None:
        ...
        

    def notify_message_edited(
        self,
        message: Jena_pituh,
        edited_by_user_id: int
    ) -> None:
        ...

    def notify_message_deleted(
        self,
        message_id: int,
        chat_id: int,
        deleted_by_user_id: int
    ) -> None:
        ...

    def get_notification_service(
    db: AsyncSession
) -> NotificationService:
    ...
