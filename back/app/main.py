from fastapi import FastAPI
from SessionLocal.routes import auth, users, chats
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
# Import all models to register them with Base
from app.database.model import user, message, group, channel, user_channel, user_group, folder, payment, payments_method

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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

 