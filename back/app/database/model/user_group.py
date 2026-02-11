from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User_Group(Base):
    __tablename__ = "user_groups"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) 
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    role = Column(String(15),nullable=False)
    date_joined = Column(DateTime(timezone=True),default=datetime.utcnow())
    is_muted = Column(Boolean,default=False)
    is_admin = Column(Boolean,default=False)
    group_info = Column(Boolean,default=False)
    manage_messages = Column(Boolean,default=False)
    add_members = Column(Boolean,default=True)