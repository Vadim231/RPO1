from fastapi import APIRouter


router = APIRouter()

@router.get("/")
def get_all_users():
    return {"message": "Список пользователей"}


