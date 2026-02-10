from fastapi import FastAPI
from SessionLocal.routes import auth, users, chats

app = FastAPI(
    title="Кроссплатформенный десктопный мессенджер",
    description="Backend мессенджер",
    version="1.0.0"
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

 