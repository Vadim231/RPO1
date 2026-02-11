from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Group(Base):
    __tablename__ = "groups"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(50), nullable=False)
    description = Column(String(100), nullable=False)
    available_reactions = Column(Boolean,nullable=False)
    is_private = Column(Boolean,nullable=False)
    is_history_hidden = Column(Boolean,nullable=False,default=False)
    creation_date = Column(DateTime,default=datetime.utcnow())
    creater_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Связи
    creater = relationship("User", back_populates="groups")
    comment_channels = relationship("Channel", back_populates="comment_group")