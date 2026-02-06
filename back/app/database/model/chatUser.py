from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class ChatUser(Base):
    __tablename__ = "chat_users"
    
    chat_id = Column(Integer, ForeignKey("chats.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    role = Column(String(20), default="member")  # member, admin
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    # Связи
    chat = relationship("Chat")
    user = relationship("User", back_populates="chats")