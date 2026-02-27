from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from socketio import ASGIApp
from SessionLocal.routes import auth, users, chats
from app.database import Base, engine
from app.service.socketio_service import sio, get_socketio_service
from app.database import get_db
import logging
# Import all models to register them with Base
from app.database.model import user, message, group, channel, user_channel, user_group, folder, payment, payments_method

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Кроссплатформенный десктопный мессенджер",
    description="Backend мессенджер",
    version="1.0.0"
)

# Create all database tables on startup
Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Routes"])
app.include_router(users.router, prefix="/users", tags=["Routes"])
app.include_router(chats.router, prefix="/chats", tags=["Routes"])

@app.get("/", tags=["Routes"])
def index():
    return {"info": "API is running. Go to /docs for Swagger UI"}


@app.on_event("startup")
async def startup_event():
    """Инициализация Socket.IO сервиса при старте"""
    # Создаём сессию напрямую
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        # Создаём заглушку асинхронной сессии для socketio_service
        # В реальном использовании сессия будет создаваться для каждого подключения
        logger.info("Socket.IO сервис готов к работе")
    finally:
        db.close()


# Монтируем Socket.IO сервер как ASGI приложение
# Все запросы на /socket.io/ будут обрабатываться Socket.IO
# Важно: socketio_app должно быть создано после определения всех обработчиков
def create_socketio_app():
    return ASGIApp(sio, app)

# Для запуска через uvicorn: uvicorn app.main:socketio_app --reload
socketio_app = create_socketio_app()

 