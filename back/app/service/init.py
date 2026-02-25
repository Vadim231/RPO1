from .auth_service import AuthService
from .user_service import UserService
from .chat_service import ChatService
from .message_service import MessageService
from .websocket_service import WebSocketService, ConnectionManager, connection_manager
from .notification_service import NotificationService, get_notification_service
from .exceptions import (
    # Базовые исключения
    BaseServiceException,
    ServiceHTTPException,
    handle_service_exception,
    error_response,
    
    # Аутентификация и авторизация
    AuthenticationException,
    InvalidCredentialsException,
    InvalidTokenException,
    TokenExpiredException,
    InsufficientPermissionsException,
    RegistrationException,
    UserAlreadyExistsException,
    PasswordValidationException,
    
    # Пользователи
    UserException,
    UserNotFoundException,
    UserProfileUpdateException,
    UserStatusException,
    
    # Чаты
    ChatException,
    ChatNotFoundException,
    ChatCreationException,
    NotChatMemberException,
    ChatAlreadyExistsException,
    ChatPermissionsException,
    UserAlreadyInChatException,
    ChatFullException,
    
    # Сообщения
    MessageException,
    MessageNotFoundException,
    MessageSendingException,
    MessageEditTimeoutException,
    MessageDeleteForbiddenException,
    MessageTooLongException,
    
    # Файлы
    FileException,
    FileTooLargeException,
    InvalidFileTypeException,
    FileUploadException,
    
    # WebSocket
    WebSocketException,
    WebSocketConnectionException,
    WebSocketAuthenticationException,
    
    # База данных
    DatabaseException,
    DatabaseConnectionException,
    DatabaseIntegrityException,
    
    # Валидация
    ValidationException,
    
    # Системные
    BusinessRuleException,
    RateLimitException,
    ServiceUnavailableException,
    NotImplementedException,
)


# Все экспортируемые классы и функции
__all__ = [
    # Сервисы
    "AuthService",
    "UserService", 
    "ChatService",
    "MessageService",
    "WebSocketService",
    "ConnectionManager",
    "connection_manager",
    "NotificationService",
    "get_notification_service",
    
    # Исключения
    "BaseServiceException",
    "ServiceHTTPException",
    "AuthenticationException",
    "InvalidCredentialsException", 
    "InvalidTokenException",
    "TokenExpiredException",
    "InsufficientPermissionsException",
    "RegistrationException",
    "UserAlreadyExistsException",
    "PasswordValidationException",
    "UserException",
    "UserNotFoundException",
    "UserProfileUpdateException", 
    "UserStatusException",
    "ChatException",
    "ChatNotFoundException",
    "ChatCreationException",
    "NotChatMemberException",
    "ChatAlreadyExistsException",
    "ChatPermissionsException",
    "UserAlreadyInChatException",
    "ChatFullException",
    "MessageException",
    "MessageNotFoundException",
    "MessageSendingException",
    "MessageEditTimeoutException",
    "MessageDeleteForbiddenException",
    "MessageTooLongException",
    "FileException",
    "FileTooLargeException",
    "InvalidFileTypeException",
    "FileUploadException",
    "WebSocketException",
    "WebSocketConnectionException",
    "WebSocketAuthenticationException",
    "DatabaseException",
    "DatabaseConnectionException",
    "DatabaseIntegrityException",
    "ValidationException",
    "BusinessRuleException",
    "RateLimitException", 
    "ServiceUnavailableException",
    "NotImplementedException",
    
    # Утилиты
    "handle_service_exception",
    "error_response",
]
