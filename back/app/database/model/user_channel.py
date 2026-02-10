from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User_Channel(Base):
    __tablename__ = "user_channels"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) 
    channel_id = Column(Integer, ForeignKey("channels.id"), nullable=False)
    date_joined = Column(DateTime(timezone=True),default=datetime.utcnow())
    is_muted = Column(Boolean,default=False)
    is_admin = Column(Boolean,default=False)
    channel_change_info = Column(Boolean,default=False)
    manage_messages = Column(Boolean,default=False)
    add_members = Column(Boolean,default=True)

    # Связи
    users = relationship("users",foreign_keys=[user_id], back_populates="user")
    channels = relationship("channels",foreign_keys=[channel_id],back_populates="usr_channel")