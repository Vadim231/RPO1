from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Folder(Base):
    __tablename__ = "folders"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    icon = Column(String(50), nullable=False)
    name_folder = Column(String(10), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)


    
    # Связи
    users = relationship("users",foreign_keys=[user_id], back_populates="folders")