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
    
    # Связи
    groups = relationship("Group", back_populates="creater")
    sent_messages = relationship("Message", back_populates="sender")
    received_messages = relationship("Message",back_populates="receiver")
    channels = relationship("Channel",back_populates="usr_channel")
    folders = relationship("Folder", back_populates="users")
    payments = relationship("Payments", back_populates="users")
    payments_method = relationship("Payments_Methods", back_populates="users")
    user_chan = relationship("User_Channel", back_populates="users_chans")
 