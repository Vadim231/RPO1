from typing import Dict, Set, List, Optional, Any
import json
import asyncio
from datetime import datetime
import logging
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
import socketio

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
    def __init__(self, sid: str, user_id: int):
        self.sid = sid
        self.user_id = user_id
        self.connected_at = datetime.utcnow()
        self.last_activity = datetime.utcnow()
        self.subscribed_chats: Set[int] = set()


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, Set[str]] = {}  # user_id -> set of sids
        self.sid_to_user: Dict[str, int] = {}  # sid -> user_id
        self.chat_subscriptions: Dict[int, Set[int]] = {}  # chat_id -> set of user_ids
        # Статистика
        self.stats = {
            "total_connections": 0,
            "active_users": 0,
            "messages_sent": 0,
            "started_at": datetime.utcnow()
        }

    def connect(self, sid: str, user_id: int) -> Connection:
        logger.info(f"Пользователь {user_id} подключается через Socket.IO (sid: {sid})")

        connection = Connection(sid, user_id)

        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
            self.stats["active_users"] += 1

        self.active_connections[user_id].add(sid)
        self.sid_to_user[sid] = user_id
        self.stats["total_connections"] += 1

        logger.info(f"Пользователь {user_id} успешно подключен. "
                   f"Активных соединений у пользователя: {len(self.active_connections[user_id])}")

        return connection

    def disconnect(self, sid: str):
        if sid not in self.sid_to_user:
            return

        user_id = self.sid_to_user[sid]

        if user_id in self.active_connections:
            if sid in self.active_connections[user_id]:
                self.active_connections[user_id].discard(sid)

            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
                self.stats["active_users"] -= 1

        del self.sid_to_user[sid]

        # Отписка от чатов
        for chat_id in list(self.chat_subscriptions.keys()):
            self.chat_subscriptions[chat_id].discard(user_id)
            if not self.chat_subscriptions[chat_id]:
                del self.chat_subscriptions[chat_id]

        logger.info(f"Пользователь {user_id} отключен (sid: {sid}). "
                   f"Осталось активных пользователей: {self.stats['active_users']}")

    async def subscribe_to_chat(self, user_id: int, chat_id: int):
        if chat_id not in self.chat_subscriptions:
            self.chat_subscriptions[chat_id] = set()

        self.chat_subscriptions[chat_id].add(user_id)

        if user_id in self.active_connections:
            for sid in self.active_connections[user_id]:
                # Можно сохранить подписку в connection, если нужно
                pass

        logger.debug(f"Пользователь {user_id} подписался на чат {chat_id}")

    async def unsubscribe_from_chat(self, user_id: int, chat_id: int):
        if chat_id in self.chat_subscriptions:
            self.chat_subscriptions[chat_id].discard(user_id)
            if not self.chat_subscriptions[chat_id]:
                del self.chat_subscriptions[chat_id]

        logger.debug(f"Пользователь {user_id} отписался от чата {chat_id}")

    def get_user_sids(self, user_id: int) -> Set[str]:
        return self.active_connections.get(user_id, set())

    def is_user_online(self, user_id: int) -> bool:
        return user_id in self.active_connections and len(self.active_connections[user_id]) > 0

    def get_online_users(self) -> List[int]:
        return list(self.active_connections.keys())

    def get_chat_subscribers(self, chat_id: int) -> List[int]:
        return list(self.chat_subscriptions.get(chat_id, set()))

    def get_stats(self) -> Dict[str, Any]:
        stats = self.stats.copy()
        stats.update({
            "current_time": datetime.utcnow().isoformat(),
            "uptime": (datetime.utcnow() - stats["started_at"]).total_seconds(),
            "chat_subscriptions": len(self.chat_subscriptions),
            "total_subscriptions": sum(len(users) for users in self.chat_subscriptions.values())
        })
        return stats


class SocketIOService:
    def __init__(self, sio: socketio.AsyncServer, connection_manager: ConnectionManager, db: Session):
        self.sio = sio
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

    async def authenticate_connection(self, token: str) -> Any:
        try:
            payload = self.auth_service.verify_access_token(token)
            user_id = int(payload.get("sub"))

            if not user_id:
                raise WebSocketAuthenticationException("Невалидный токен")

            # Импортируем модель локально, чтобы избежать проблем с циклическими импортами
            from app.database.model.user import User

            stmt = select(User).where(User.id == user_id)
            result = await asyncio.get_event_loop().run_in_executor(
                None, lambda: self.db.execute(stmt)
            )
            user = result.scalar_one_or_none()

            if not user:
                raise UserNotFoundException(user_id=user_id)

            return user

        except (InvalidTokenException, UserNotFoundException) as e:
            raise WebSocketAuthenticationException(str(e))
        except Exception as e:
            logger.error(f"Ошибка аутентификации Socket.IO: {str(e)}")
            raise WebSocketAuthenticationException("Ошибка аутентификации")

    async def on_connect(self, sid: str, auth: dict):
        """Обработчик подключения клиента"""
        token = auth.get("token")
        if not token:
            logger.warning("Попытка подключения без токена")
            return False

        try:
            user = await self.authenticate_connection(token)
            self.manager.connect(sid, user.id)

            logger.info(f"Пользователь {user.username} (ID: {user.id}) подключен к Socket.IO")

            # Отправляем приветственное сообщение
            await self._send_welcome_message(sid, user)

            # Автоматическая подписка на чаты пользователя
            await self._subscribe_to_user_chats(user.id)

            return True

        except WebSocketAuthenticationException as e:
            logger.warning(f"Ошибка аутентификации: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Ошибка при подключении: {str(e)}")
            return False

    async def on_disconnect(self, sid: str):
        """Обработчик отключения клиента"""
        user_id = self.manager.sid_to_user.get(sid)
        if user_id:
            logger.info(f"Пользователь {user_id} отключился")
            self.manager.disconnect(sid)

    async def on_message(self, sid: str, data: dict):
        """Обработчик входящих сообщений"""
        user_id = self.manager.sid_to_user.get(sid)
        if not user_id:
            await self.sio.emit("error", {"error": "Не аутентифицирован"}, room=sid)
            return

        message_type = data.get("type")
        if not message_type:
            await self.sio.emit("error", {"error": "Не указан тип сообщения"}, room=sid)
            return

        handler = self.message_handlers.get(message_type)
        if handler:
            await handler(data, sid, user_id)
        else:
            await self.sio.emit("error", {"error": f"Неизвестный тип сообщения: {message_type}"}, room=sid)

    async def _handle_subscribe(self, data: dict, sid: str, user_id: int):
        """Обработка подписки на чат"""
        chat_id = data.get("chat_id")
        if not chat_id:
            await self.sio.emit("error", {"error": "Не указан chat_id для подписки"}, room=sid)
            return

        from app.database.model.user_channel import User_Channel

        stmt = select(User_Channel).where(
            User_Channel.channel_id == chat_id,
            User_Channel.user_id == user_id
        )
        result = await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.db.execute(stmt)
        )

        if not result.scalar_one_or_none():
            await self.sio.emit("error", {"error": "Вы не участник этого чата"}, room=sid)
            return

        await self.manager.subscribe_to_chat(user_id, chat_id)

        await self.sio.emit("subscribed", {
            "chat_id": chat_id,
            "timestamp": datetime.utcnow().isoformat()
        }, room=sid)

        logger.info(f"Пользователь {user_id} подписался на чат {chat_id}")

    async def _handle_unsubscribe(self, data: dict, sid: str, user_id: int):
        """Обработка отписки от чата"""
        chat_id = data.get("chat_id")
        if not chat_id:
            await self.sio.emit("error", {"error": "Не указан chat_id для отписки"}, room=sid)
            return

        await self.manager.unsubscribe_from_chat(user_id, chat_id)

        await self.sio.emit("unsubscribed", {
            "chat_id": chat_id,
            "timestamp": datetime.utcnow().isoformat()
        }, room=sid)

        logger.info(f"Пользователь {user_id} отписался от чат {chat_id}")

    async def _handle_typing(self, data: dict, sid: str, user_id: int):
        """Обработка индикации набора текста"""
        chat_id = data.get("chat_id")
        is_typing = data.get("is_typing", True)

        if not chat_id:
            await self.sio.emit("error", {"error": "Не указан chat_id"}, room=sid)
            return

        from app.database.model.user import User

        # Получаем имя пользователя
        stmt = select(User.username).where(User.id == user_id)
        result = await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.db.execute(stmt)
        )
        username = result.scalar_one_or_none()

        typing_message = {
            "type": "user_typing",
            "chat_id": chat_id,
            "user_id": user_id,
            "username": username or "Unknown",
            "is_typing": is_typing,
            "timestamp": datetime.utcnow().isoformat()
        }

        # Отправляем всем подписчикам чата, кроме отправителя
        await self._broadcast_to_chat("typing_status", typing_message, chat_id, exclude_user_id=user_id)

    async def _handle_read_receipt(self, data: dict, sid: str, user_id: int):
        """Обработка прочтения сообщения"""
        message_id = data.get("message_id")
        chat_id = data.get("chat_id")

        if not message_id or not chat_id:
            await self.sio.emit("error", {"error": "Не указаны message_id или chat_id"}, room=sid)
            return

        from app.database.model.user import User

        # Получаем имя пользователя
        stmt = select(User.username).where(User.id == user_id)
        result = await asyncio.get_event_loop().run_in_executor(
            None, lambda: self.db.execute(stmt)
        )
        username = result.scalar_one_or_none()

        read_receipt = {
            "type": "message_read",
            "message_id": message_id,
            "chat_id": chat_id,
            "read_by_user_id": user_id,
            "read_by_username": username or "Unknown",
            "timestamp": datetime.utcnow().isoformat()
        }

        await self._broadcast_to_chat("read_receipt", read_receipt, chat_id, exclude_user_id=user_id)

    async def _handle_ping(self, data: dict, sid: str, user_id: int):
        """Обработка ping"""
        await self.sio.emit("pong", {
            "timestamp": datetime.utcnow().isoformat(),
            "server_time": datetime.utcnow().isoformat()
        }, room=sid)

    async def _handle_get_online_users(self, data: dict, sid: str, user_id: int):
        """Получение списка онлайн пользователей"""
        chat_id = data.get("chat_id")

        if chat_id:
            subscribers = self.manager.get_chat_subscribers(chat_id)
            online_in_chat = [uid for uid in subscribers if self.manager.is_user_online(uid)]

            await self.sio.emit("online_users", {
                "chat_id": chat_id,
                "online_users": online_in_chat,
                "count": len(online_in_chat)
            }, room=sid)
        else:
            online_users = self.manager.get_online_users()

            await self.sio.emit("online_users", {
                "online_users": online_users,
                "count": len(online_users)
            }, room=sid)

    async def _send_welcome_message(self, sid: str, user: Any):
        """Отправка приветственного сообщения"""
        welcome_message = {
            "type": "welcome",
            "message": f"Добро пожаловать, {user.username}!",
            "user_id": user.id,
            "username": user.username,
            "server_time": datetime.utcnow().isoformat(),
            "online": True
        }

        await self.sio.emit("server_message", welcome_message, room=sid)

    async def _subscribe_to_user_chats(self, user_id: int):
        """Автоматическая подписка на чаты пользователя"""
        try:
            from app.database.model.user_channel import User_Channel

            stmt = select(User_Channel.channel_id).where(User_Channel.user_id == user_id)
            result = await asyncio.get_event_loop().run_in_executor(
                None, lambda: self.db.execute(stmt)
            )
            chat_ids = result.scalars().all()

            for chat_id in chat_ids:
                await self.manager.subscribe_to_chat(user_id, chat_id)

            logger.info(f"Пользователь {user_id} автоматически подписан на {len(chat_ids)} чатов")

        except Exception as e:
            logger.error(f"Ошибка автоматической подписки пользователя {user_id}: {str(e)}")

    async def _broadcast_to_chat(self, event: str, data: dict, chat_id: int, exclude_user_id: Optional[int] = None):
        """Отправка сообщения всем подписчикам чата"""
        if chat_id not in self.manager.chat_subscriptions:
            return

        for user_id in self.manager.chat_subscriptions[chat_id]:
            if user_id == exclude_user_id:
                continue

            if user_id in self.manager.active_connections:
                for sid in self.manager.active_connections[user_id]:
                    await self.sio.emit(event, data, room=sid)
                    self.manager.stats["messages_sent"] += 1

    # === Публичные методы для отправки сообщений извне ===

    async def send_new_message(self, message_data: dict, chat_id: int, sender_id: int):
        """Отправка уведомления о новом сообщении"""
        ws_message = {
            "type": "new_message",
            "data": message_data,
            "timestamp": datetime.utcnow().isoformat()
        }

        await self._broadcast_to_chat("new_message", ws_message, chat_id, exclude_user_id=sender_id)

    async def send_message_update(self, message_data: dict, chat_id: int):
        """Отправка уведомления об обновлении сообщения"""
        ws_message = {
            "type": "message_update",
            "data": message_data,
            "timestamp": datetime.utcnow().isoformat()
        }

        await self._broadcast_to_chat("message_update", ws_message, chat_id)

    async def send_message_delete(self, message_id: int, chat_id: int):
        """Отправка уведомления об удалении сообщения"""
        ws_message = {
            "type": "message_delete",
            "data": {"message_id": message_id},
            "timestamp": datetime.utcnow().isoformat()
        }

        await self._broadcast_to_chat("message_delete", ws_message, chat_id)

    async def notify_user_status(self, user_id: int, is_online: bool, last_seen: datetime = None):
        """Уведомление о статусе пользователя"""
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
                await self._broadcast_to_chat(
                    "user_status",
                    status_message,
                    chat_id,
                    exclude_user_id=user_id
                )

    def get_stats(self) -> dict:
        """Получение статистики"""
        return self.manager.get_stats()


# Глобальные экземпляры
sio = socketio.AsyncServer(
    cors_allowed_origins="*",
    async_mode="asgi",
    transports=["websocket", "polling"],
    ping_timeout=60,
    ping_interval=25
)

connection_manager = ConnectionManager()
socketio_service: Optional[SocketIOService] = None


async def get_socketio_service(db: Session) -> SocketIOService:
    """Зависимость для получения Socket.IO сервиса"""
    global socketio_service
    if socketio_service is None:
        socketio_service = SocketIOService(sio, connection_manager, db)
    else:
        # Обновляем db сессию
        socketio_service.db = db
    return socketio_service


# Регистрация обработчиков событий
@sio.event
async def connect(sid: str, environ, auth):
    """Обработчик подключения"""
    logger.info(f"Новое подключение: sid={sid}, auth={auth}")
    # Получаем БД из app состояния
    from app.database import SessionLocal
    db = None
    try:
        db = SessionLocal()
        service = await get_socketio_service(db)
        result = await service.on_connect(sid, auth)
        if not result:
            logger.warning(f"Отказ в подключении для sid={sid}")
            return False
        logger.info(f"Подключение успешно: sid={sid}")
        return True
    except Exception as e:
        logger.error(f"Ошибка при подключении: {str(e)}")
        return False
    finally:
        if db:
            db.close()


@sio.event
async def disconnect(sid):
    """Обработчик отключения"""
    logger.info(f"Отключение: sid={sid}")
    global socketio_service
    if socketio_service:
        await socketio_service.on_disconnect(sid)


@sio.event
async def message(sid, data):
    """Обработчик сообщений"""
    logger.debug(f"Сообщение от sid={sid}: {data}")
    global socketio_service
    if socketio_service:
        await socketio_service.on_message(sid, data)
