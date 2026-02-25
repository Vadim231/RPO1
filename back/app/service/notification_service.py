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

class NotificationPriority(str, Enum):
    LOW = "low"       
    NORMAL = "normal"  
    HIGH = "high"      
    URGENT = "urgent" 

class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.typing_timers: Dict[str, asyncio.Task] = {}

    
    def notify_new_message(
        self,
        message: Message,
        exclude_user_id: Optional[int] = None
    ) -> None:
        notification = {
            "type": NotificationType.NEW_MESSAGE,
            "priority": NotificationPriority.NORMAL,
            "timestamp": datetime.utcnow().isoformat(),
            "data": {
                "message_id": message.id,
                "chat_id": message.chat_id,
                "sender_id": message.sender_id,
                "sender_name": message.sender.display_name or message.sender.username,
                "content": message.content,
                "is_read": message.is_read,
                "created_at": message.created_at.isoformat(),
                "attachment_url": message.attachment_url
            }
        }
        
        mentions = self._extract_mentions(message.content)
        if mentions:
            notification["priority"] = NotificationPriority.HIGH
            notification["data"]["mentions"] = mentions
        
        self.manager.broadcast_to_chat(
            notification,
            message.chat_id,
            exclude_user_id=exclude_user_id or message.sender_id
        )
        
        logger.info(f"Уведомление о новом сообщении {message.id} отправлено")

    def notify_message_read(
        self,
        message_id: int,
        chat_id: int,
        user_id: int
    ) -> None:
        """Уведомление о прочтении сообщения"""
        notification = {
            "type": NotificationType.MESSAGE_READ,
            "priority": NotificationPriority.LOW,
            "timestamp": datetime.utcnow().isoformat(),
            "data": {
                "message_id": message_id,
                "chat_id": chat_id,
                "read_by_user_id": user_id
            }
        }
        
   
        stmt = select(Message).where(Message.id == message_id)
        result = self.db.execute(stmt)
        message = result.scalar_one_or_none()
        
        if message and message.sender_id != user_id:
            self.manager.send_personal_message(
                notification,
                message.sender_id
            )
            logger.info(f"Уведомление о прочтении сообщения {message_id} отправлено пользователю {message.sender_id}")


    def notify_message_delivered(
        self,
        message_id: int,
        chat_id: int,
        user_id: int
    ) -> None:
        notification = {
            "type": NotificationType.MESSAGE_DELIVERED,
            "priority": NotificationPriority.LOW,
            "timestamp": datetime.utcnow().isoformat(),
            "data": {
                "message_id": message_id,
                "chat_id": chat_id,
                "delivered_to_user_id": user_id
            }
        }
        
        stmt = select(Message).where(Message.id == message_id)
        result = self.db.execute(stmt)
        message = result.scalar_one_or_none()
        
        if message and message.sender_id != user_id:
            self.manager.send_personal_message(
                notification,
                message.sender_id
            )

    def notify_user_typing(
        self,
        chat_id: int,
        user_id: int,
        is_typing: bool
    ) -> None:
       
        timer_key = f"typing_{chat_id}_{user_id}"
        
        if is_typing:
            notification = {
                "type": NotificationType.USER_TYPING,
                "priority": NotificationPriority.LOW,
                "timestamp": datetime.utcnow().isoformat(),
                "data": {
                    "chat_id": chat_id,
                    "user_id": user_id,
                    "is_typing": True
                }
            }
            
            self.manager.broadcast_to_chat(
                notification,
                chat_id,
                exclude_user_id=user_id
            )
            
            if timer_key in self.typing_timers:
                self.typing_timers[timer_key].cancel()
            
            self.typing_timers[timer_key] = asyncio.create_task(
                self._stop_typing_after_delay(chat_id, user_id, timer_key)
            )
        else:
            notification = {
                "type": NotificationType.USER_TYPING,
                "priority": NotificationPriority.LOW,
                "timestamp": datetime.utcnow().isoformat(),
                "data": {
                    "chat_id": chat_id,
                    "user_id": user_id,
                    "is_typing": False
                }
            }
            
            self.manager.broadcast_to_chat(
                notification,
                chat_id,
                exclude_user_id=user_id
            )
            
            if timer_key in self.typing_timers:
                self.typing_timers[timer_key].cancel()
                del self.typing_timers[timer_key]


    def notify_user_status(
        self,
        user_id: int,
        is_online: bool,
        last_seen: Optional[datetime] = None
    ) -> None:
        notification_type = (
            NotificationType.USER_ONLINE 
            if is_online 
            else NotificationType.USER_OFFLINE
        )
        
        notification = {
            "type": notification_type,
            "priority": NotificationPriority.LOW,
            "timestamp": datetime.utcnow().isoformat(),
            "data": {
                "user_id": user_id,
                "is_online": is_online,
                "last_seen": last_seen.isoformat() if last_seen else None
            }
        }
        
        #Хватит короче



    def notify_chat_created(
        self,
        chat: Message,
        created_by_user_id: int
    ) -> None:
        notification = {
            "type": NotificationType.CHAT_CREATED,
            "priority": NotificationPriority.NORMAL,
            "timestamp": datetime.utcnow().isoformat(),
            "data": {
                "chat_id": chat.id,
                "is_group": chat.is_group,
                "title": chat.title,
                "created_by_user_id": created_by_user_id,
                "created_at": chat.created_at.isoformat(),
                "participants": [
                    {
                        "user_id": cu.user_id,
                        "username": cu.user.username,
                        "display_name": cu.user.display_name
                    }
                    for cu in chat.chat_users
                ]
            }
        }
        
        for chat_user in chat.chat_users:
            if chat_user.user_id != created_by_user_id:
                self.manager.send_personal_message(
                    notification,
                    chat_user.user_id
                )
        
        logger.info(f"Уведомление о создании чата {chat.id} отправлено")



    def notify_user_added_to_chat(self,chat_id: int, added_user_id: int,added_by_user_id: int) -> None:
        ...
        

    def notify_message_edited(
        self,
        message: Message,
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

