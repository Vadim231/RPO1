from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc, func


class MessageService:
    def __init__(self, db: AsyncSession):
        self.db = db

 
    def send_message():
        ...


    def get_chat_messages():
        ... 


    def mark_as_read():
        ... 


    def update_message():
        ... 