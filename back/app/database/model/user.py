from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    phone_number = Column(String(100), unique=True, nullable=True)
    bio = Column(String(100), nullable=True)
    is_premium = Column(Boolean, nullable=False)
    last_online_timestamp = Column(TIMESTAMP)
    
    # Relationships configured with explicit foreign keys
    sent_messages = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
    received_messages = relationship("Message", back_populates="receiver", foreign_keys="Message.receiver_id")
 