from typing import Dict, Set, List, Optional, Any
import json
import asyncio
from datetime import datetime
import logging
from fastapi import WebSocket, WebSocketDisconnect, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.models.chat import Chat, ChatUser
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
    
    async def connect(self, websocket: WebSocket, user_id: int) -> Connection:

        try:
            await websocket.accept()
            logger.info(f"Пользователь {user_id} подключается через WebSocket")
            
            connection = Connection(websocket, user_id)
            if user_id not in self.active_connections:
                self.active_connections[user_id] = []
            
            self.active_connections[user_id].append(connection)
            
            self.stats["total_connections"] += 1
            if len(self.active_connections[user_id]) == 1:
                self.stats["active_users"] += 1
            
            logger.info(f"Пользователь {user_id} успешно подключен. "
                       f"Активных соединений у пользователя: {len(self.active_connections[user_id])}")
            connection.ping_task = asyncio.create_task(
                self._ping_connection(connection)
            )
            
            return connection
            
        except Exception as e:
            logger.error(f"Ошибка подключения пользователя {user_id}: {str(e)}")
            raise WebSocketConnectionException(
                f"Не удалось подключиться: {str(e)}"
            )
    
    def disconnect(self, connection: Connection):
        user_id = connection.user_id
        
        if user_id in self.active_connections:
            if connection in self.active_connections[user_id]:
                self.active_connections[user_id].remove(connection)
            
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
                self.stats["active_users"] -= 1
            
            for chat_id in list(self.chat_subscriptions.keys()):
                self.chat_subscriptions[chat_id].discard(user_id)
                if not self.chat_subscriptions[chat_id]:
                    del self.chat_subscriptions[chat_id]
        
        if connection.ping_task and not connection.ping_task.done():
            connection.ping_task.cancel()
        
        logger.info(f"Пользователь {user_id} отключен. "
                   f"Осталось активных пользователей: {self.stats['active_users']}")
    
    async def subscribe_to_chat(self, user_id: int, chat_id: int):
       
        if chat_id not in self.chat_subscriptions:
            self.chat_subscriptions[chat_id] = set()
        
        self.chat_subscriptions[chat_id].add(user_id)
        
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                connection.subscribed_chats.add(chat_id)
        
        logger.debug(f"Пользователь {user_id} подписался на чат {chat_id}")
    
    async def unsubscribe_from_chat(self, user_id: int, chat_id: int):
     
        if chat_id in self.chat_subscriptions:
            self.chat_subscriptions[chat_id].discard(user_id)
            if not self.chat_subscriptions[chat_id]:
                del self.chat_subscriptions[chat_id]
        
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                connection.subscribed_chats.discard(chat_id)
        
        logger.debug(f"Пользователь {user_id} отписался от чата {chat_id}")
    
    async def send_personal_message(self, message: Dict[str, Any], user_id: int):
     
        if user_id not in self.active_connections:
            logger.debug(f"Пользователь {user_id} не в сети, сообщение не отправлено")
            return False
        
        message_json = json.dumps(message, ensure_ascii=False)
        sent_to_any = False
        
        for connection in self.active_connections[user_id]:
            try:
                await connection.websocket.send_text(message_json)
                connection.last_activity = datetime.utcnow()
                sent_to_any = True
                self.stats["messages_sent"] += 1
            except Exception as e:
                logger.error(f"Ошибка отправки сообщения пользователю {user_id}: {str(e)}")
                self.disconnect(connection)
        
        return sent_to_any
    
    async def broadcast_to_chat(
        self, 
        message: Dict[str, Any], 
        chat_id: int, 
        exclude_user_id: Optional[int] = None
    ):

        if chat_id not in self.chat_subscriptions:
            return
        
        message_json = json.dumps(message, ensure_ascii=False)
        
        for user_id in self.chat_subscriptions[chat_id]:
            if user_id == exclude_user_id:
                continue
            
            if user_id in self.active_connections:
                for connection in self.active_connections[user_id]:
                    try:
                        await connection.websocket.send_text(message_json)
                        connection.last_activity = datetime.utcnow()
                        self.stats["messages_sent"] += 1
                    except Exception as e:
                        logger.error(f"Ошибка отправки сообщения в чат {chat_id} пользователю {user_id}: {str(e)}")
                        self.disconnect(connection)
    
    async def broadcast_to_all(self, message: Dict[str, Any]):

        message_json = json.dumps(message, ensure_ascii=False)
        
        for user_id, connections in self.active_connections.items():
            for connection in connections:
                try:
                    await connection.websocket.send_text(message_json)
                    connection.last_activity = datetime.utcnow()
                    self.stats["messages_sent"] += 1
                except Exception as e:
                    logger.error(f"Ошибка широковещательной отправки пользователю {user_id}: {str(e)}")
                    self.disconnect(connection)
    
    def get_user_connections(self, user_id: int) -> List[Connection]:

        return self.active_connections.get(user_id, [])
    
    def is_user_online(self, user_id: int) -> bool:

        return user_id in self.active_connections and len(self.active_connections[user_id]) > 0
    
    def get_online_users(self) -> List[int]:

        return list(self.active_connections.keys())
    
    def get_chat_subscribers(self, chat_id: int) -> List[int]:

        return list(self.chat_subscriptions.get(chat_id, set()))
    
    async def _ping_connection(self, connection: Connection, interval: int = 30):

        try:
            while True:
                await asyncio.sleep(interval)
                
                time_since_last_activity = (datetime.utcnow() - connection.last_activity).total_seconds()
                
                if time_since_last_activity > interval * 2:
                    try:
                        await connection.websocket.send_json({
                            "type": "ping",
                            "timestamp": datetime.utcnow().isoformat()
                        })
                    except:
                        logger.warning(f"Соединение пользователя {connection.user_id} неактивно, отключаем")
                        self.disconnect(connection)
                        break
                        
        except asyncio.CancelledError:
            logger.debug(f"Ping задача для пользователя {connection.user_id} отменена")
        except Exception as e:
            logger.error(f"Ошибка в ping задаче для пользователя {connection.user_id}: {str(e)}")
            self.disconnect(connection)
    
    def get_stats(self) -> Dict[str, Any]:

        stats = self.stats.copy()
        stats.update({
            "current_time": datetime.utcnow().isoformat(),
            "uptime": (datetime.utcnow() - stats["started_at"]).total_seconds(),
            "chat_subscriptions": len(self.chat_subscriptions),
            "total_subscriptions": sum(len(users) for users in self.chat_subscriptions.values())
        })
        return stats


class WebSocketService:

    
    def __init__(self, connection_manager: ConnectionManager, db: AsyncSession):
        self.manager = connection_manager
        self.db = db
        self.auth_service = AuthService(db)
        
        self.message_handlers = {
            "subscribe": self._handle_subscribe,
            "unsubscribe": self._handle_unsubscribe,
            "typing": self._handle_typing,
            "read_receipt": self._handle_read_receipt,
            "ping": self._handle_ping,
            "get_online_users": self._handle_get_online_users,
        }
    
    async def authenticate_connection(self, token: str) -> User:
     
        try:
            payload = self.auth_service.verify_access_token(token)
            user_id = int(payload.get("sub"))
            
            if not user_id:
                raise WebSocketAuthenticationException("Невалидный токен")
            
            stmt = select(User).where(User.id == user_id)
            result = await self.db.execute(stmt)
            user = result.scalar_one_or_none()
            
            if not user:
                raise UserNotFoundException(user_id=user_id)
            
            return user
            
        except (InvalidTokenException, UserNotFoundException) as e:
            raise WebSocketAuthenticationException(str(e))
        except Exception as e:
            logger.error(f"Ошибка аутентификации WebSocket: {str(e)}")
            raise WebSocketAuthenticationException("Ошибка аутентификации")
    
    async def handle_connection(self, websocket: WebSocket, token: str):
      
        user = await self.authenticate_connection(token)
        connection = None
        
        try:
            connection = await self.manager.connect(websocket, user.id)
            
            logger.info(f"Пользователь {user.username} (ID: {user.id}) подключен к WebSocket")
            
            await self._send_welcome_message(connection, user)
            
            await self._subscribe_to_user_chats(user.id)
            
            await self._message_loop(connection, user)
            
        except WebSocketAuthenticationException as e:
            logger.warning(f"Ошибка аутентификации: {str(e)}")
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            
        except WebSocketDisconnect:
            logger.info(f"Пользователь {user.username} отключился")
            
        except Exception as e:
            logger.error(f"Неожиданная ошибка в соединении пользователя {user.id}: {str(e)}")
            
        finally:
            if connection:
                self.manager.disconnect(connection)
    
    async def _message_loop(self, connection: Connection, user: User):

        while True:
            try:
                data = await connection.websocket.receive_json()
                connection.last_activity = datetime.utcnow()
                
                await self._handle_message(data, connection, user)
                
            except WebSocketDisconnect:
                logger.info(f"Пользователь {user.username} отключился")
                break
                
            except json.JSONDecodeError:
                logger.warning(f"Невалидный JSON от пользователя {user.username}")
                await connection.websocket.send_json({
                    "type": "error",
                    "error": "Невалидный формат сообщения"
                })
                
            except Exception as e:
                logger.error(f"Ошибка обработки сообщения от {user.username}: {str(e)}")
                await connection.websocket.send_json({
                    "type": "error",
                    "error": "Внутренняя ошибка сервера"
                })
    
    async def _handle_message(self, data: Dict[str, Any], connection: Connection, user: User):

        message_type = data.get("type")
        
        if not message_type:
            await connection.websocket.send_json({
                "type": "error",
                "error": "Не указан тип сообщения"
            })
            return
        
        handler = self.message_handlers.get(message_type)
        if handler:
            await handler(data, connection, user)
        else:
            await connection.websocket.send_json({
                "type": "error",
                "error": f"Неизвестный тип сообщения: {message_type}"
            })
    
    async def _handle_subscribe(self, data: Dict[str, Any], connection: Connection, user: User):

        chat_id = data.get("chat_id")
        if not chat_id:
            await connection.websocket.send_json({
                "type": "error",
                "error": "Не указан chat_id для подписки"
            })
            return
        
        stmt = select(ChatUser).where(
            ChatUser.chat_id == chat_id,
            ChatUser.user_id == user.id
        )
        result = await self.db.execute(stmt)
        
        if not result.scalar_one_or_none():
            await connection.websocket.send_json({
                "type": "error",
                "error": "Вы не участник этого чата"
            })
            return

        await self.manager.subscribe_to_chat(user.id, chat_id)
        
        await connection.websocket.send_json({
            "type": "subscribed",
            "chat_id": chat_id,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        logger.info(f"Пользователь {user.username} подписался на чат {chat_id}")
    
    async def _handle_unsubscribe(self, data: Dict[str, Any], connection: Connection, user: User):
        """
        Обработка отписки от чата
        """
        chat_id = data.get("chat_id")
        if not chat_id:
            await connection.websocket.send_json({
                "type": "error",
                "error": "Не указан chat_id для отписки"
            })
            return

        await self.manager.unsubscribe_from_chat(user.id, chat_id)
        
        await connection.websocket.send_json({
            "type": "unsubscribed",
            "chat_id": chat_id,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        logger.info(f"Пользователь {user.username} отписался от чат {chat_id}")
    
    async def _handle_typing(self, data: Dict[str, Any], connection: Connection, user: User):

        chat_id = data.get("chat_id")
        is_typing = data.get("is_typing", True)
        
        if not chat_id:
            await connection.websocket.send_json({
                "type": "error",
                "error": "Не указан chat_id"
            })
            return

        typing_message = {
            "type": "user_typing",
            "chat_id": chat_id,
            "user_id": user.id,
            "username": user.username,
            "is_typing": is_typing,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self.manager.broadcast_to_chat(
            typing_message,
            chat_id,
            exclude_user_id=user.id
        )
    
    async def _handle_read_receipt(self, data: Dict[str, Any], connection: Connection, user: User):

        message_id = data.get("message_id")
        chat_id = data.get("chat_id")
        
        if not message_id or not chat_id:
            await connection.websocket.send_json({
                "type": "error",
                "error": "Не указаны message_id или chat_id"
            })
            return
        
        read_receipt = {
            "type": "message_read",
            "message_id": message_id,
            "chat_id": chat_id,
            "read_by_user_id": user.id,
            "read_by_username": user.username,
            "timestamp": datetime.utcnow().isoformat()
        }
            
    async def _handle_ping(self, data: Dict[str, Any], connection: Connection, user: User):

        await connection.websocket.send_json({
            "type": "pong",
            "timestamp": datetime.utcnow().isoformat(),
            "server_time": datetime.utcnow().isoformat()
        })
    
    async def _handle_get_online_users(self, data: Dict[str, Any], connection: Connection, user: User):

        chat_id = data.get("chat_id")
        
        if chat_id:
            subscribers = self.manager.get_chat_subscribers(chat_id)
            online_in_chat = [uid for uid in subscribers if self.manager.is_user_online(uid)]
            
            await connection.websocket.send_json({
                "type": "online_users",
                "chat_id": chat_id,
                "online_users": online_in_chat,
                "count": len(online_in_chat)
            })
        else:
            online_users = self.manager.get_online_users()
            
            await connection.websocket.send_json({
                "type": "online_users",
                "online_users": online_users,
                "count": len(online_users)
            })
    
    async def _send_welcome_message(self, connection: Connection, user: User):

        welcome_message = {
            "type": "welcome",
            "message": f"Добро пожаловать, {user.username}!",
            "user_id": user.id,
            "username": user.username,
            "server_time": datetime.utcnow().isoformat(),
            "online": True
        }
        
        await connection.websocket.send_json(welcome_message)
    
    async def _subscribe_to_user_chats(self, user_id: int):

        try:
            stmt = (
                select(ChatUser.chat_id)
                .where(ChatUser.user_id == user_id)
            )
            result = await self.db.execute(stmt)
            chat_ids = result.scalars().all()
            
            for chat_id in chat_ids:
                await self.manager.subscribe_to_chat(user_id, chat_id)
            
            logger.info(f"Пользователь {user_id} автоматически подписан на {len(chat_ids)} чатов")
            
        except Exception as e:
            logger.error(f"Ошибка автоматической подписки пользователя {user_id}: {str(e)}")
    
    async def send_new_message(self, message_data: Dict[str, Any], chat_id: int, sender_id: int):

        ws_message = {
            "type": "new_message",
            "data": message_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self.manager.broadcast_to_chat(
            ws_message,
            chat_id,
            exclude_user_id=sender_id
        )
    
    async def send_message_update(self, message_data: Dict[str, Any], chat_id: int):

        ws_message = {
            "type": "message_update",
            "data": message_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self.manager.broadcast_to_chat(ws_message, chat_id)
    
    async def send_message_delete(self, message_id: int, chat_id: int):

        ws_message = {
            "type": "message_delete",
            "data": {"message_id": message_id},
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self.manager.broadcast_to_chat(ws_message, chat_id)
    
    async def notify_user_status(self, user_id: int, is_online: bool, last_seen: datetime = None):

        status_message = {
            "type": "user_status",
            "data": {
                "user_id": user_id,
                "is_online": is_online,
                "last_seen": last_seen.isoformat() if last_seen else None,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        for chat_id in self.manager.chat_subscriptions:
            if user_id in self.manager.chat_subscriptions[chat_id]:
                await self.manager.broadcast_to_chat(
                    status_message,
                    chat_id,
                    exclude_user_id=user_id
                )


connection_manager = ConnectionManager()


async def get_websocket_service(db: AsyncSession) -> WebSocketService:

    return WebSocketService(connection_manager, db)
