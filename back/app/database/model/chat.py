from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Chat(Base):
    __tablename__ = "chats"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    is_group = Column(Boolean, default=False)
    title = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    