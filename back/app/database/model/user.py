from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
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
    last_online_timestamp = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Связи
    groups = relationship("groups", back_populates="creater")
    sent_messages = relationship("messages", back_populates="sender")
    received_messages = relationship("messages",back_populates="receiver")
    channels = relationship("channels",back_populates="usr_channel")
    folders = relationship("folders", back_populates="users")
    payments = relationship("payments", back_populates="users")
    payments_method = relationship("paymnet_methods", back_populates="users")
    user_chan = relationship("user_channels", back_populates="users_chans")
 