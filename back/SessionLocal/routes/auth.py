from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def login():
    return {"status": "ok"}
