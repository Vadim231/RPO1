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