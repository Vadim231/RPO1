***

## Запуск проекта:

### Backend:
1. Установить пакет UV:

`pip install uv`

2. Синхронизировать зависимости:

`uv sync`

3. Перейти в папку back

`cd back`

4. Запустить проект (Socket.IO + FastAPI):

`uv run python -m uvicorn app.main:socketio_app --reload`

> **Важно:** Для работы с Socket.IO используется `socketio_app` вместо `app`

### Frontend:
1. Перейти в папку front:

`cd front`

2. Установить зависимости:

`npm install`

3. Запустить в режиме разработки:

`npm run dev`

### Переменные окружения (опционально):

Создайте файл `.env` в папке `front`:

```
VITE_SOCKET_URL=http://localhost:8000
```

***

## 📡 Socket.IO

Проект использует **Socket.IO** для обмена сообщениями в реальном времени.

**Быстрый старт:**
```typescript
import { useChatSocket } from '@/features/chat/useChatSocket';

function ChatComponent() {
  const { socket, isConnected, sendTyping } = useChatSocket({
    chatId: selectedChatId,
    token: authToken,
    onNewMessage: (data) => {
      console.log('Новое сообщение:', data.data);
    },
  });

  // Отправка индикатора набора текста
  sendTyping(true);
}
```

📖 **Подробная документация:** см. [SOCKETIO_README.md](SOCKETIO_README.md)

***

## 1. Цель проекта

Создать кроссплатформенный десктопный мессенджер (чат‑приложение), устанавливаемый на компьютеры пользователей, с централизованным хранением данных на отдельном сервере БД и единым backend‑API.

***

## 2. Общая архитектура

Тип архитектуры: многослойная client‑server‑архитектура.

Состав:

1. **Клиент**:
   - Electron‑приложение (Windows обязательно, по возможности Linux/macOS).
   - UI на HTML/CSS/JavaScript.
   - Взаимодействует только с сервером приложений по HTTP(S)/WebSocket.

2. **Сервер приложений (backend)**:
   - Язык: Python 3.10+.
   - Фреймворк: FastAPI (предпочтительно) или аналогичный.
   - Реализует:
     - REST API для CRUD‑операций.
     - WebSocket для обмена сообщениями в реальном времени.
     - Аутентификацию и авторизацию (JWT).
     - Бизнес‑логику (создание чатов, отправка сообщений, статусы).
   - Развёрнут на отдельном сервере/VPS с публичным доменным именем или IP.

3. **Сервер БД**:
   - MySQL (5.7+ или 8+).
   - Развёрнут на отдельном сервере или как managed‑решение.
   - Доступен только с серверов приложений (ограничение по IP/Firewall, приватная сеть, VPN).

4. **Хранение данных**:
   - Все пользователи, чаты и сообщения хранятся централизованно в MySQL.
   - Клиенты не имеют прямого доступа к БД, только через API.

***

## 3. Функциональные требования

### 3.1. Пользователи и аутентификация

Обязательно:
- **Регистрация**:
  - Поля: username (уникальный), email (опционально, уникальный), пароль.
  - Валидация: длина пароля, формат email, уникальность username/email.
  - Пароли хранятся только в виде безопасных хэшей (bcrypt/argon2).
- **Авторизация**:
  - Вход по username/email + пароль.
  - Выдача access‑token (JWT) с ограниченным временем жизни.
- **Профиль пользователя**:
  - Отображаемое имя.
  - Аватар (на первом этапе можно хранить только URL, без загрузки файлов).
  - Дата регистрации.

Расширение (можно заложить в дизайн БД, но не реализовывать сразу):
- Восстановление пароля (через email).
- Статус: онлайн/оффлайн, «был(а) в сети…».

### 3.2. Чаты и сообщения

Минимальный функционал:
- Личные чаты (1‑на‑1).
- Список чатов пользователя (диалоги, упорядоченные по времени последнего сообщения).
- Отправка текстовых сообщений.
- Отображение истории сообщений с пагинацией (по времени/лимиту).
- Метаданные сообщения:
  - Автор (отправитель).
  - Время отправки.
  - Признак принадлежности к конкретному чату.

Дополнительный/расширяемый функционал:
- **Групповые чаты**:
  - Название чата.
  - Роли участников (участник/админ).
- **Статусы сообщений**:
  - «Доставлено», «прочитано».
- **Отправка файлов**:
  - Сохранение файлов на файловом хранилище/объектном сторидже.
  - В БД хранится ссылка/путь и тип файла.

***

## 4. Нефункциональные требования

- **Платформы**:
  - Обязательно: Windows 10+.
  - По возможности: Linux, macOS.
- **Язык интерфейса**:
  - Русский, с возможностью добавления других языков (через JSON‑файлы локализации).
- **Производительность**:
  - Задержка доставки сообщения при стабильном соединении не более 1–2 секунд.
- **Устойчивость**:
  - При потере соединения клиент должен:
    - Пытаться переподключиться.
    - Досылать неотправленные сообщения после восстановления.
- **Масштаб**:
  - Базовый этап: до 100 одновременных пользователей.
  - Возможность масштабирования backend и БД в будущем без изменения клиентской части.

***

## 5. Технический стек

### 5.1. Клиент (Electron)

- Electron (Node.js).
- HTML5, CSS3.
- JavaScript (ES6+).
- Допустимо использование UI‑фреймворка (Bootstrap/Tailwind или др.).
- Взаимодействие с API:
  - REST: fetch / axios.
  - WebSocket: встроенный WebSocket API.

### 5.2. Backend (Python)

- **Python 3.10+**.
- **FastAPI**:
  - REST‑эндпойнты.
  - WebSocket‑подключения.
  - Pydantic‑схемы для валидации.
- **Сервер**: Uvicorn/Gunicorn.
- **Работа с БД**:
  - **SQLAlchemy 2.0+** (обязательно):
    - ORM‑модели для всех сущностей.
    - Session/AsyncSession с пулом подключений.
    - Асинхронный режим (async/await) для работы с FastAPI.
  - **Alembic** (обязательно):
    - Миграции БД.
    - Автогенерация миграций из изменений моделей SQLAlchemy.
- **Аутентификация**:
  - JWT (pyjwt или встроенные решения FastAPI).
  - Библиотека для хэширования паролей: passlib или bcrypt.

**Структура backend‑проекта**:

```
backend/
├── alembic.ini
├── alembic/
│   └── versions/           # Автогенерированные миграции
├── app/
│   ├── __init__.py
│   ├── main.py             # FastAPI app, роуты, middleware
│   ├── config.py           # Настройки (.env)
│   ├── database.py         # SQLAlchemy engine, SessionLocal, Base
│   ├── models/             # SQLAlchemy модели
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── chat.py
│   │   └── message.py
│   ├── schemas/            # Pydantic схемы
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── chat.py
│   ├── routes/             # API эндпойнты
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   └── chats.py
│   ├── services/           # Бизнес-логика
│   └── websocket/
│       └── chat_ws.py
├── requirements.txt
├── .env.example
└── docker-compose.yml (опционально)
```

**Пример database.py**:
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "mysql+aiomysql://user:pass@mysql-server:3306/chat_db"
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()
```

**Команды Alembic** (добавляются в документацию):
```
# Инициализация
alembic init alembic

# Генерация миграции из изменений моделей
alembic revision --autogenerate -m "add users table"

# Применение миграций
alembic upgrade head

# Откат
alembic downgrade -1
```

### 5.3. База данных (MySQL)

**SQLAlchemy модели** (пример структуры):

```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(100))
    avatar_url = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Связи
    sent_messages = relationship("Message", foreign_keys="[Message.sender_id]")
    chats = relationship("ChatUser", back_populates="user")

class Chat(Base):
    __tablename__ = "chats"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    is_group = Column(Boolean, default=False)
    title = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatUser(Base):
    __tablename__ = "chat_users"
    
    chat_id = Column(Integer, ForeignKey("chats.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    role = Column(String(20), default="member")  # member, admin
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    # Связи
    chat = relationship("Chat")
    user = relationship("User", back_populates="chats")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String(5000))  # или Text
    is_read = Column(Boolean, default=False)
    attachment_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Связи
    chat = relationship("Chat")
    sender = relationship("User")
```

***

## 6. API‑интерфейс

(Остаётся без изменений, но все операции с БД выполняются через SQLAlchemy с использованием SessionLocal/AsyncSession).

***

## 7. Клиентская логика (Electron)

(Без изменений).

***

## 8. Безопасность

(Без изменений, но добавляется):
- **SQLAlchemy** автоматически защищает от SQL‑инъекций при использовании ORM и параметризованных запросов.

***

## 9. Развёртывание и инфраструктура

### 9.1. Миграции БД

**Процесс миграции**:
1. Изменение моделей в `models/*.py`.
2. Генерация миграции:
   ```
   alembic revision --autogenerate -m "описание изменений"
   ```
3. Проверка сгенерированной миграции в `alembic/versions/`.
4. Применение на всех окружениях:
   ```
   alembic upgrade head
   ```

**CI/CD**:
- Автоматическое применение миграций при деплое.
- Проверка совместимости миграций с текущими моделями.

### 9.2. Базовый этап

(Без изменений).

### 9.3. Масштабирование (на будущее)

(Без изменений).

***

## 10. Этапы реализации

(Изменён 2-й и 3-й пункты):

1. Аналитика и детализация требований.
2. **Проектирование БД**:
   - Создание SQLAlchemy моделей.
   - Инициализация Alembic.
   - Создание начальных миграций.
3. **Реализация backend (базовый функционал)**:
   - Настройка SQLAlchemy + Alembic.
   - Регистрация, логин, /me.
   - CRUD чатов и сообщений по REST.
4. Реализация Electron‑клиента (базовый UI).
5. Добавление WebSocket.
6. Доработка UX/UI.
7. Тестирование.
8. Подготовка к продакшн.

***

## 11. Socket.IO интеграция

### Миграция с WebSocket на Socket.IO

Проект был переведён с нативного WebSocket на Socket.IO для улучшения:
- ✅ Автоматической переподключения при потере соединения
- ✅ Поддержки polling транспорта для старых браузеров
- ✅ Упрощённой работы с комнатами и событиями
- ✅ Встроенной поддержки ping/pong
- ✅ Типизации событий TypeScript

### Быстрый старт

**Подключение:**
```typescript
import { useChatSocket } from '@/features/chat/useChatSocket';

function ChatComponent() {
  const { socket, isConnected, sendTyping, markAsRead } = useChatSocket({
    chatId: selectedChatId,
    token: authToken,
    onNewMessage: (data) => {
      setMessages(prev => [...prev, data.data]);
    },
    onTyping: (data) => {
      setTypingUsers(prev => [...prev, data.username]);
    },
  });

  sendTyping(true); // Индикатор набора текста
  markAsRead(messageId); // Прочтение сообщения
}
```

### События

**Клиент → Сервер:**
| Событие | Описание | Параметры |
|---------|----------|-----------|
| `subscribe` | Подписка на чат | `chat_id` |
| `unsubscribe` | Отписка от чата | `chat_id` |
| `typing` | Индикатор набора текста | `chat_id`, `is_typing` |
| `read_receipt` | Подтверждение прочтения | `message_id`, `chat_id` |
| `ping` | Проверка соединения | - |
| `get_online_users` | Запрос онлайн пользователей | `chat_id` (опционально) |

**Сервер → Клиент:**
| Событие | Описание | Данные |
|---------|----------|--------|
| `server_message` | Приветственное сообщение | `type`, `user_id`, `username` |
| `new_message` | Новое сообщение | `data` с информацией о сообщении |
| `message_update` | Обновление сообщения | `data` с обновлёнными данными |
| `message_delete` | Удаление сообщения | `data.message_id` |
| `typing_status` | Индикатор набора текста | `chat_id`, `user_id`, `username`, `is_typing` |
| `read_receipt` | Подтверждение прочтения | `message_id`, `read_by_user_id` |
| `user_status` | Статус пользователя | `user_id`, `is_online`, `last_seen` |
| `online_users` | Список онлайн | `online_users[]`, `count` |
| `error` | Ошибка | `error` |

### Структура файлов

**Backend:**
```
back/app/service/
├── socketio_service.py    # Основной сервис Socket.IO
├── auth_service.py        # Аутентификация и JWT
└── exceptions.py          # Исключения
```

**Frontend:**
```
front/src/shared/
├── types/socketio.ts          # Типы событий
├── hooks/
│   ├── useSocketIO.ts         # Socket.IO клиент
│   └── useSocketIOHook.ts     # React хук
├── config/socketio.ts         # Конфигурация
└── context/SocketIOContext.tsx

front/src/features/chat/
└── useChatSocket.ts           # Хук для чата
```

### 🔐 Безопасность

1. **Аутентификация:** JWT токен передаётся при подключении
2. **Авторизация:** Проверка прав доступа к чату
3. **Валидация:** Все события проверяются на корректность

### 🛠️ Решение проблем

**Ошибка `ERR_CONNECTION_REFUSED` в Electron:**
- Причина: Electron запускается до готовности Vite
- Решение: Приложение автоматически выполнит повторное подключение

**Ошибка `Невалидный токен`:**
- Причина: JWT токен истёк
- Решение: Обновите токен и переподключитесь

**Ошибка `Table 'users' is already defined`:**
- Причина: Множественный импорт моделей
- Решение: Используйте локальные импорты в функциях

### 📚 Документация

📖 **Подробная документация:** см. [SOCKETIO_README.md](SOCKETIO_README.md)

***
