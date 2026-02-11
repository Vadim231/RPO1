from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from SessionLocal.schemas.chat import GroupOut, GroupCreate, ChannelOut, ChannelCreate
from SessionLocal.schemas.message import MessageOut
from app.database.model.group import Group
from app.database.model.channel import Channel
from app.database.model.message import Message
from app.database.model.user import User
from app.app import get_db
from datetime import datetime

router = APIRouter()

# === GROUPS ===

@router.get("/groups", response_model=List[GroupOut])
async def get_my_groups(user_id: int, db: Session = Depends(get_db)):
    # Получить группы, созданные пользователем
    groups = db.query(Group).filter(Group.creater_id == user_id).all()
    return groups

@router.post("/groups", response_model=GroupOut)
async def create_group(group: GroupCreate, user_id: int, db: Session = Depends(get_db)):
    # Создать новую группу
    new_group = Group(
        title=group.title,
        description=group.description,
        available_reactions=group.available_reactions,
        is_private=group.is_private,
        creater_id=user_id,
        creation_date=datetime.utcnow()
    )
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    return new_group

# === CHANNELS ===

@router.get("/channels", response_model=List[ChannelOut])
async def get_my_channels(user_id: int, db: Session = Depends(get_db)):
    # Получить каналы, созданные пользователем
    channels = db.query(Channel).filter(Channel.creater_id == user_id).all()
    return channels

@router.post("/channels", response_model=ChannelOut)
async def create_channel(channel: ChannelCreate, user_id: int, db: Session = Depends(get_db)):
    # Создать новый канал
    new_channel = Channel(
        title=channel.title,
        description=channel.description,
        available_reactions=channel.available_reactions,
        is_private=channel.is_private,
        is_signed_message=channel.is_signed_message,
        creater_id=user_id,
        creation_date=datetime.utcnow()
    )
    db.add(new_channel)
    db.commit()
    db.refresh(new_channel)
    return new_channel

# === MESSAGES ===

@router.post("/messages", response_model=MessageOut)
async def send_message(message: dict, sender_id: int, db: Session = Depends(get_db)):
    # Отправить сообщение
    new_message = Message(
        content=message.get("content"),
        sender_id=sender_id,
        receiver_id=message.get("receiver_id"),
        date_written=datetime.utcnow()
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@router.get("/messages/{receiver_id}", response_model=List[MessageOut])
async def get_messages(receiver_id: int, sender_id: int, db: Session = Depends(get_db)):
    # Получить сообщения между пользователями
    messages = db.query(Message).filter(
        ((Message.sender_id == sender_id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.receiver_id == sender_id))
    ).order_by(Message.date_written).all()
    return messages

