from typing import Dict, List, Optional, Set, Any, Union
from datetime import datetime
from enum import Enum
import json
import asyncio

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

 
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
    def notify_new_message():
        ... 



    def notify_message_read():
        ...



    def notify_user_typing():
        ...



    def notify_user_status():
        ...



    def notify_chat_created():
        ...



    def notify_user_added_to_chat():
        ...
        