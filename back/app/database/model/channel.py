from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Channel(Base):
    __tablename__ = "channels"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    description = Column(String(100), nullable=False)
    available_reactions = Column(Boolean,nullable=False)
    is_private = Column(Boolean,nullable=False) 
    is_verified = Column(Boolean,nullable=False,default=False)
    creation_date = Column(DateTime,default=datetime.utcnow())
    is_signed_message = Column(Boolean,nullable=False)
    comment_chat_id = Column(Integer, ForeignKey('groups.id'), nullable=True)
    creater_id = Column(Integer, ForeignKey("users.id"), nullable=False)


    # Связи
    usr_channel = relationship("User_Channel", back_populates="channels")
    comment_group = relationship("Group", back_populates="comment_channels")