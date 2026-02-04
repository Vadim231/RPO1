from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_chats():
    return {"message": "ok"}
