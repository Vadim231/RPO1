from typing import Dict, Set, List, Optional, Any
import json
import asyncio
from datetime import datetime
import logging
from fastapi import WebSocket, WebSocketDisconnect, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload


from back.app.database.model.user import User
from .exceptions import (
    WebSocketException,
    WebSocketConnectionException,
    WebSocketAuthenticationException,
    InvalidTokenException,
    UserNotFoundException
)
from .auth_service import AuthService

logger = logging.getLogger(__name__)


class Connection:
     def __init__(self, websocket: WebSocket, user_id: int):
        self.websocket = websocket
        self.user_id = user_id
        self.connected_at = datetime.utcnow()
        self.last_activity = datetime.utcnow()
        self.subscribed_chats: Set[int] = set()
        self.ping_task: Optional[asyncio.Task] = None
    
    
    
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[Connection]] = {}
        self.chat_subscriptions: Dict[int, Set[int]] = {}
        self.ping_tasks: Dict[str, asyncio.Task] = {}
        
        # Статистика
        self.stats = {
            "total_connections": 0,
            "active_users": 0,
            "messages_sent": 0,
            "started_at": datetime.utcnow()
        }
    
    
    
