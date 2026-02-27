# 📡 Socket.IO — Документация

## Обзор

Проект использует **Socket.IO** для обмена сообщениями в реальном времени между клиентами. Socket.IO обеспечивает надёжное соединение с автоматическим переподключением, поддержкой fallback-транспортов и простой работой с событиями.

---

## 🏗️ Архитектура

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Client 1  │◄───────►│   FastAPI +      │◄───────►│   Client 2  │
│  (Electron) │  WS/    │   Socket.IO      │  WS/    │  (Electron) │
│             │ Polling │   Server         │ Polling │             │
└─────────────┘         └──────────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │  SQLite/    │
                        │  MySQL DB   │
                        └─────────────┘
```

---

## 🚀 Запуск

### Backend

```bash
# Перейти в директорию backend
cd back

# Установить зависимости
uv sync

# Запустить сервер (Socket.IO + FastAPI)
uv run python -m uvicorn app.main:socketio_app --reload --host 0.0.0.0 --port 8000
```

**Важно:** Для запуска используется `socketio_app`, а не `app`, чтобы Socket.IO мог обрабатывать WebSocket подключения.

### Frontend

```bash
# Перейти в директорию frontend
cd front

# Установить зависимости
npm install

# Запустить в режиме разработки
npm run dev
```

---

## 🔌 Подключение к Socket.IO

### Аутентификация

Подключение происходит через JWT токен, который передаётся при подключении:

```typescript
import { createSocketIO } from '@/shared/hooks/useSocketIO';
import { socketIOConfig } from '@/shared/config/socketio';

const socket = createSocketIO(socketIOConfig);

// Подключение с токеном
await socket.connect({ token: 'your-jwt-token-here' });
```

### Использование хука в React

```typescript
import { useChatSocket } from '@/features/chat/useChatSocket';

function ChatComponent({ chatId, token }) {
  const {
    socket,
    isConnected,
    sendTyping,
    markAsRead,
    getOnlineUsers,
  } = useChatSocket({
    chatId,
    token,
    onNewMessage: (data) => {
      console.log('Новое сообщение:', data.data);
    },
    onTyping: (data) => {
      console.log(`${data.username} печатает...`);
    },
  });

  return (
    <div>
      Статус: {isConnected ? '🟢 Подключено' : '🔴 Отключено'}
    </div>
  );
}
```

---

## 📤 События клиент → сервер

### 1. Подписка на чат

**Отправка:**
```typescript
socket.sendMessage({ type: 'subscribe', chat_id: 123 });
// или
socket.subscribeToChat(123);
```

**Ответ сервера:**
```json
{
  "type": "subscribed",
  "chat_id": 123,
  "timestamp": "2026-02-26T12:00:00.000Z"
}
```

### 2. Отписка от чата

**Отправка:**
```typescript
socket.sendMessage({ type: 'unsubscribe', chat_id: 123 });
// или
socket.unsubscribeFromChat(123);
```

### 3. Индикатор набора текста

**Отправка:**
```typescript
socket.sendTypingStatus(chatId, true);  // Начал печатать
socket.sendTypingStatus(chatId, false); // Перестал печатать
```

### 4. Подтверждение прочтения

**Отправка:**
```typescript
socket.sendReadReceipt(messageId, chatId);
```

### 5. Ping сервера

**Отправка:**
```typescript
socket.sendPing();
```

**Ответ:**
```json
{
  "type": "pong",
  "timestamp": "2026-02-26T12:00:00.000Z",
  "server_time": "2026-02-26T12:00:00.000Z"
}
```

### 6. Запрос онлайн пользователей

**Отправка:**
```typescript
socket.getOnlineUsers(chatId); // Для конкретного чата
socket.getOnlineUsers();       // Все онлайн пользователи
```

**Ответ:**
```json
{
  "type": "online_users",
  "chat_id": 123,
  "online_users": [1, 5, 12],
  "count": 3
}
```

---

## 📥 События сервер → клиент

### 1. Приветственное сообщение

Срабатывает при успешном подключении:

```json
{
  "type": "welcome",
  "message": "Добро пожаловать, username!",
  "user_id": 1,
  "username": "username",
  "server_time": "2026-02-26T12:00:00.000Z",
  "online": true
}
```

### 2. Новое сообщение

```json
{
  "type": "new_message",
  "data": {
    "id": 456,
    "chat_id": 123,
    "sender_id": 1,
    "content": "Привет!",
    "created_at": "2026-02-26T12:00:00.000Z"
  },
  "timestamp": "2026-02-26T12:00:00.000Z"
}
```

### 3. Обновление сообщения

```json
{
  "type": "message_update",
  "data": {
    "id": 456,
    "content": "Обновлённый текст",
    "is_edit": true,
    "edited_at": "2026-02-26T12:05:00.000Z"
  },
  "timestamp": "2026-02-26T12:05:00.000Z"
}
```

### 4. Удаление сообщения

```json
{
  "type": "message_delete",
  "data": {
    "message_id": 456
  },
  "timestamp": "2026-02-26T12:10:00.000Z"
}
```

### 5. Индикатор набора текста

```json
{
  "type": "user_typing",
  "chat_id": 123,
  "user_id": 1,
  "username": "username",
  "is_typing": true,
  "timestamp": "2026-02-26T12:00:00.000Z"
}
```

### 6. Подтверждение прочтения

```json
{
  "type": "message_read",
  "message_id": 456,
  "chat_id": 123,
  "read_by_user_id": 2,
  "read_by_username": "reader",
  "timestamp": "2026-02-26T12:00:00.000Z"
}
```

### 7. Статус пользователя

```json
{
  "type": "user_status",
  "data": {
    "user_id": 1,
    "is_online": true,
    "last_seen": "2026-02-26T11:55:00.000Z",
    "timestamp": "2026-02-26T12:00:00.000Z"
  }
}
```

### 8. Список онлайн пользователей

```json
{
  "type": "online_users",
  "chat_id": 123,
  "online_users": [1, 5, 12],
  "count": 3
}
```

### 9. Ошибка

```json
{
  "type": "error",
  "error": "Вы не участник этого чата"
}
```

---

## 📁 Структура файлов

### Backend

```
back/app/service/
├── socketio_service.py      # Основной сервис Socket.IO
│   ├── ConnectionManager    # Управление подключениями
│   ├── SocketIOService      # Обработка событий
│   └── sio                  # AsyncServer экземпляр
├── auth_service.py          # Аутентификация и JWT
└── exceptions.py            # Исключения
```

### Frontend

```
front/src/shared/
├── types/socketio.ts          # TypeScript типы событий
├── hooks/
│   ├── useSocketIO.ts         # Socket.IO клиент
│   └── useSocketIOHook.ts     # React хук для подключения
├── config/socketio.ts         # Конфигурация подключения
└── context/SocketIOContext.tsx # React контекст

front/src/features/chat/
└── useChatSocket.ts           # Хук для работы с чатом
```

---

## 🔐 Безопасность

### Аутентификация

1. Клиент получает JWT токен через REST API (`POST /auth/login`)
2. Токен передаётся при подключении к Socket.IO:
   ```typescript
   socket.connect({ token: jwtToken });
   ```
3. Сервер проверяет токен и устанавливает личность пользователя
4. При невалидном токене подключение отклоняется

### Авторизация

- Пользователь может подписываться только на чаты, в которых состоит
- Сообщения отправляются только от имени аутентифицированного пользователя
- Статусы прочтения проверяются на принадлежность к чату

---

## 🔄 Обработка ошибок

### На клиенте

```typescript
socket.on('error', (data) => {
  console.error('Socket.IO ошибка:', data.error);
  
  // Обработка конкретных ошибок
  switch (data.error) {
    case 'Вы не участник этого чата':
      // Показать уведомление
      break;
    case 'Невалидный токен':
      // Перенаправить на страницу входа
      break;
  }
});

// Обработка отключения
socket.on('disconnect', (reason) => {
  console.log('Отключено:', reason);
  
  if (reason === 'transport close') {
    // Попытка переподключения
    socket.connect({ token: jwtToken });
  }
});
```

### На сервере

```python
try:
    user = await self.authenticate_connection(token)
except WebSocketAuthenticationException as e:
    logger.warning(f"Ошибка аутентификации: {str(e)}")
    return False
except Exception as e:
    logger.error(f"Неожиданная ошибка: {str(e)}")
    return False
```

---

## 📊 Масштабирование

### Текущая конфигурация

- **Транспорты:** WebSocket + Polling (fallback)
- **Ping интервал:** 25 секунд
- **Ping таймаут:** 60 секунд
- **Максимальный payload:** 1MB

### Для продакшена

1. **Redis Adapter** для горизонтального масштабирования:
   ```bash
   uv add redis
   pip install python-socketio[redis]
   ```

2. **Настройка сервера:**
   ```python
   sio = socketio.AsyncServer(
       cors_allowed_origins=["https://yourdomain.com"],
       async_mode="asgi",
       transports=["websocket"],
       ping_timeout=60,
       ping_interval=25,
       logger=True,
       engineio_logger=True
   )
   ```

3. **Nginx конфигурация** для WebSocket:
   ```nginx
   location /socket.io/ {
       proxy_pass http://backend:8000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       proxy_set_header Host $host;
   }
   ```

---

## 🧪 Тестирование

### Проверка подключения

```bash
# Через curl (polling transport)
curl "http://localhost:8000/socket.io/?EIO=4&transport=polling"

# Ответ:
# 0{"sid":"abc123","upgrades":["websocket"],"pingTimeout":60000,"pingInterval":25000}
```

### Через браузерную консоль

```javascript
// Подключение
const socket = io('http://localhost:8000', {
  auth: { token: 'your-jwt-token' }
});

// Слушаем события
socket.on('connect', () => console.log('Connected:', socket.id));
socket.on('server_message', (data) => console.log('Message:', data));

// Отправляем события
socket.emit('message', { type: 'ping' });
```

---

## 🛠️ Решение проблем

### Ошибка: `ERR_CONNECTION_REFUSED` в Electron

**Причина:** Electron пытается подключиться до готовности Vite сервера.

**Решение:**
1. Дождитесь полной загрузки Vite (`VITE v5.x.x ready in xxx ms`)
2. Проверьте, что VITE_DEV_SERVER_URL установлен
3. Приложение автоматически выполнит повторное подключение

### Ошибка: `Невалидный токен`

**Причина:** JWT токен истёк или невалиден.

**Решение:**
```typescript
// Обновите токен перед подключением
const newToken = await refreshAuthToken();
socket.disconnect();
socket.connect({ token: newToken });
```

### Ошибка: `Table 'users' is already defined`

**Причина:** Множественный импорт моделей SQLAlchemy.

**Решение:** Используйте локальные импорты в функциях:
```python
def some_function():
    from app.database.model.user import User
    # ... работа с моделью
```

---

## 📚 Дополнительные ресурсы

- [Socket.IO официальная документация](https://socket.io/docs/v4/)
- [Python Socket.IO](https://python-socketio.readthedocs.io/)
- [FastAPI WebSocket](https://fastapi.tiangolo.com/advanced/websockets/)

---

## 📝 Changelog

### v1.0.0 (2026-02-26)
- ✅ Миграция с WebSocket на Socket.IO
- ✅ Добавлена поддержка polling транспорта
- ✅ Автоматическое переподключение
- ✅ Улучшена обработка ошибок
- ✅ Добавлены типы TypeScript для событий
- ✅ Созданы React хуки для удобной работы
