from fastapi import HTTPException, status
from typing import Any, Dict, Optional, List


class BaseServiceException(Exception):
    def __init__(self, message: str = "Внутренняя ошибка сервиса", **kwargs):
        self.message = message
        self.details = kwargs
        super().__init__(self.message)


class ServiceHTTPException(HTTPException):
    def __init__(
        self,
        status_code: int,
        detail: Any = None,
        headers: Optional[Dict[str, Any]] = None,
        error_code: Optional[str] = None,
        additional_data: Optional[Dict[str, Any]] = None
    ):
        self.error_code = error_code
        self.additional_data = additional_data or {}
        
        response_detail = {
            "error": detail if detail else "Произошла ошибка",
            "error_code": error_code,
            **additional_data
        } if error_code or additional_data else detail
        
        super().__init__(
            status_code=status_code,
            detail=response_detail,
            headers=headers
        )

class AuthenticationException(ServiceHTTPException):
    def __init__(
        self,
        detail: str = "Ошибка аутентификации",
        error_code: str = "AUTH_ERROR"
    ):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code=error_code
        )


class InvalidCredentialsException(AuthenticationException):
    def __init__(self, detail: str = "Неверный логин или пароль"):
        super().__init__(
            detail=detail,
            error_code="INVALID_CREDENTIALS"
        )


class InvalidTokenException(AuthenticationException):
    def __init__(self, detail: str = "Невалидный или просроченный токен"):
        super().__init__(
            detail=detail,
            error_code="INVALID_TOKEN"
        )


class TokenExpiredException(AuthenticationException):
    """Токен истек"""
    def __init__(self, detail: str = "Токен истек"):
        super().__init__(
            detail=detail,
            error_code="TOKEN_EXPIRED"
        )


class InsufficientPermissionsException(ServiceHTTPException):
    def __init__(
        self,
        detail: str = "Недостаточно прав для выполнения операции",
        required_permissions: Optional[List[str]] = None
    ):
        additional_data = {}
        if required_permissions:
            additional_data["required_permissions"] = required_permissions
        
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="INSUFFICIENT_PERMISSIONS",
            additional_data=additional_data
        )


class RegistrationException(ServiceHTTPException):
    def __init__(self, detail: str = "Ошибка при регистрации"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code="REGISTRATION_ERROR"
        )


class UserAlreadyExistsException(RegistrationException):
    def __init__(
        self,
        detail: str = "Пользователь с такими данными уже существует",
        field: Optional[str] = None,
        value: Optional[str] = None
    ):
        additional_data = {}
        if field:
            additional_data["conflicting_field"] = field
        if value:
            additional_data["conflicting_value"] = value
        
        super().__init__(
            detail=detail,
            error_code="USER_ALREADY_EXISTS",
            additional_data=additional_data
        )


class PasswordValidationException(RegistrationException):
    def __init__(
        self,
        detail: str = "Пароль не соответствует требованиям безопасности",
        requirements: Optional[List[str]] = None
    ):
        additional_data = {}
        if requirements:
            additional_data["requirements"] = requirements
        
        super().__init__(
            detail=detail,
            error_code="PASSWORD_VALIDATION_FAILED",
            additional_data=additional_data
        )

class UserException(ServiceHTTPException):
    def __init__(
        self,
        detail: str = "Ошибка работы с пользователем",
        error_code: str = "USER_ERROR"
    ):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code=error_code
        )


class UserNotFoundException(UserException):
    def __init__(self, user_id: Optional[int] = None, username: Optional[str] = None):
        detail = "Пользователь не найден"
        additional_data = {}
        
        if user_id:
            detail = f"Пользователь с ID {user_id} не найден"
            additional_data["user_id"] = user_id
        elif username:
            detail = f"Пользователь '{username}' не найден"
            additional_data["username"] = username
        
        super().__init__(
            detail=detail,
            error_code="USER_NOT_FOUND",
            additional_data=additional_data
        )


class UserProfileUpdateException(UserException):
    def __init__(self, detail: str = "Не удалось обновить профиль"):
        super().__init__(
            detail=detail,
            error_code="PROFILE_UPDATE_FAILED"
        )


class UserStatusException(UserException):
    def __init__(self, detail: str = "Не удалось изменить статус"):
        super().__init__(
            detail=detail,
            error_code="USER_STATUS_ERROR"
        )

class ChatException(ServiceHTTPException):
    def __init__(
        self,
        detail: str = "Ошибка работы с чатом",
        error_code: str = "CHAT_ERROR"
    ):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code=error_code
        )


class ChatNotFoundException(ChatException):
    def __init__(self, chat_id: Optional[int] = None):
        detail = "Чат не найден"
        additional_data = {}
        
        if chat_id:
            detail = f"Чат с ID {chat_id} не найден"
            additional_data["chat_id"] = chat_id
        
        super().__init__(
            detail=detail,
            error_code="CHAT_NOT_FOUND",
            additional_data=additional_data
        )


class ChatCreationException(ChatException):
    def __init__(self, detail: str = "Не удалось создать чат"):
        super().__init__(
            detail=detail,
            error_code="CHAT_CREATION_FAILED"
        )


class NotChatMemberException(ChatException):
    def __init__(self, chat_id: Optional[int] = None, user_id: Optional[int] = None):
        detail = "Вы не являетесь участником этого чата"
        additional_data = {}
        
        if chat_id:
            additional_data["chat_id"] = chat_id
        if user_id:
            additional_data["user_id"] = user_id
        
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="NOT_CHAT_MEMBER",
            additional_data=additional_data
        )


class ChatAlreadyExistsException(ChatException):
    def __init__(self, detail: str = "Такой чат уже существует"):
        super().__init__(
            detail=detail,
            error_code="CHAT_ALREADY_EXISTS"
        )


class ChatPermissionsException(ChatException):
    def __init__(
        self,
        detail: str = "Недостаточно прав для выполнения операции в чате",
        required_role: Optional[str] = None
    ):
        additional_data = {}
        if required_role:
            additional_data["required_role"] = required_role
        
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="CHAT_PERMISSIONS_ERROR",
            additional_data=additional_data
        )


class UserAlreadyInChatException(ChatException):
    def __init__(self, chat_id: int, user_id: int):
        super().__init__(
            detail=f"Пользователь {user_id} уже является участником чата {chat_id}",
            error_code="USER_ALREADY_IN_CHAT",
            additional_data={
                "chat_id": chat_id,
                "user_id": user_id
            }
        )


class ChatFullException(ChatException):
    def __init__(self, chat_id: int, max_members: int = 100):
        super().__init__(
            detail=f"Чат достиг максимального количества участников ({max_members})",
            error_code="CHAT_FULL",
            additional_data={
                "chat_id": chat_id,
                "max_members": max_members
            }
        )

class MessageException(ServiceHTTPException):
    def __init__(
        self,
        detail: str = "Ошибка работы с сообщением",
        error_code: str = "MESSAGE_ERROR"
    ):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code=error_code
        )


class MessageNotFoundException(MessageException):
    def __init__(self, message_id: Optional[int] = None):
        detail = "Сообщение не найдено"
        additional_data = {}
        
        if message_id:
            detail = f"Сообщение с ID {message_id} не найдено"
            additional_data["message_id"] = message_id
        
        super().__init__(
            detail=detail,
            error_code="MESSAGE_NOT_FOUND",
            additional_data=additional_data
        )


class MessageSendingException(MessageException):
    def __init__(self, detail: str = "Не удалось отправить сообщение"):
        super().__init__(
            detail=detail,
            error_code="MESSAGE_SENDING_FAILED"
        )


class MessageEditTimeoutException(MessageException):
    def __init__(self, message_id: int, edit_timeout_minutes: int = 15):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Сообщение можно редактировать только в течение {edit_timeout_minutes} минут после отправки",
            error_code="MESSAGE_EDIT_TIMEOUT",
            additional_data={
                "message_id": message_id,
                "edit_timeout_minutes": edit_timeout_minutes
            }
        )


class MessageDeleteForbiddenException(MessageException):
    def __init__(self, message_id: int, reason: str = "Недостаточно прав"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Не удалось удалить сообщение: {reason}",
            error_code="MESSAGE_DELETE_FORBIDDEN",
            additional_data={
                "message_id": message_id,
                "reason": reason
            }
        )


class MessageTooLongException(MessageException):
    def __init__(self, max_length: int = 5000):
        super().__init__(
            detail=f"Сообщение не должно превышать {max_length} символов",
            error_code="MESSAGE_TOO_LONG",
            additional_data={
                "max_length": max_length
            }
        )

class FileException(ServiceHTTPException):
    def __init__(
        self,
        detail: str = "Ошибка работы с файлом",
        error_code: str = "FILE_ERROR"
    ):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code=error_code
        )


class FileTooLargeException(FileException):
    def __init__(self, max_size_mb: int = 10):
        super().__init__(
            detail=f"Размер файла не должен превышать {max_size_mb} МБ",
            error_code="FILE_TOO_LARGE",
            additional_data={
                "max_size_mb": max_size_mb
            }
        )


class InvalidFileTypeException(FileException):
    def __init__(self, allowed_types: Optional[List[str]] = None):
        detail = "Недопустимый тип файла"
        additional_data = {}
        
        if allowed_types:
            detail = f"Допустимые типы файлов: {', '.join(allowed_types)}"
            additional_data["allowed_types"] = allowed_types
        
        super().__init__(
            detail=detail,
            error_code="INVALID_FILE_TYPE",
            additional_data=additional_data
        )


class FileUploadException(FileException):
    def __init__(self, detail: str = "Не удалось загрузить файл"):
        super().__init__(
            detail=detail,
            error_code="FILE_UPLOAD_FAILED"
        )


class WebSocketException(BaseServiceException):
    def __init__(self, message: str = "WebSocket ошибка"):
        super().__init__(message)


class WebSocketConnectionException(WebSocketException):
    def __init__(self, message: str = "Не удалось установить WebSocket соединение"):
        super().__init__(message)


class WebSocketAuthenticationException(WebSocketException):
    def __init__(self, message: str = "Ошибка аутентификации WebSocket"):
        super().__init__(message)

class DatabaseException(BaseServiceException):
    def __init__(self, message: str = "Ошибка базы данных"):
        super().__init__(message)


class DatabaseConnectionException(DatabaseException):
    def __init__(self, message: str = "Не удалось подключиться к базе данных"):
        super().__init__(message)


class DatabaseIntegrityException(DatabaseException):
    def __init__(self, message: str = "Нарушение целостности данных"):
        super().__init__(message)

class ValidationException(ServiceHTTPException):
    def __init__(
        self,
        detail: str = "Ошибка валидации данных",
        validation_errors: Optional[List[Dict[str, Any]]] = None
    ):
        additional_data = {}
        if validation_errors:
            additional_data["validation_errors"] = validation_errors
        
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail,
            error_code="VALIDATION_ERROR",
            additional_data=additional_data
        )


class BusinessRuleException(ServiceHTTPException):
    def __init__(self, detail: str = "Нарушение бизнес-правил"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
            error_code="BUSINESS_RULE_VIOLATION"
        )


class RateLimitException(ServiceHTTPException):
    def __init__(
        self,
        detail: str = "Слишком много запросов",
        retry_after: Optional[int] = None
    ):
        headers = {}
        if retry_after:
            headers["Retry-After"] = str(retry_after)
        
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=detail,
            error_code="RATE_LIMIT_EXCEEDED",
            headers=headers
        )


class ServiceUnavailableException(ServiceHTTPException):
    def __init__(
        self,
        detail: str = "Сервис временно недоступен",
        retry_after: Optional[int] = None
    ):
        headers = {}
        if retry_after:
            headers["Retry-After"] = str(retry_after)
        
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail,
            error_code="SERVICE_UNAVAILABLE",
            headers=headers
        )


class NotImplementedException(ServiceHTTPException):
    def __init__(self, detail: str = "Функционал еще не реализован"):
        super().__init__(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=detail,
            error_code="NOT_IMPLEMENTED"
        )

def handle_service_exception(exception: BaseServiceException) -> Dict[str, Any]:
    if isinstance(exception, ServiceHTTPException):
  
        raise exception
    
    raise ServiceHTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=str(exception),
        error_code="INTERNAL_SERVER_ERROR"
    )


def error_response(
    error_code: str,
    message: str,
    status_code: int = status.HTTP_400_BAD_REQUEST,
    **additional_data
) -> Dict[str, Any]:
    return {
        "success": False,
        "error": {
            "code": error_code,
            "message": message,
            **additional_data
        },
        "timestamp": __import__("datetime").datetime.utcnow().isoformat()
    }
