from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(String(5000))
    date_written = Column(TIMESTAMP)
    is_edit = Column(Boolean, default=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_reply_message = Column(Boolean,default=False)
    is_forward_message = Column(Boolean,default=False)
    reply_to_message_id = Column(Integer, ForeignKey("messages.id"), nullable=True) 
    forward_origin_id = Column(Integer, ForeignKey("messages.id"), nullable=True)  
    # Relationships with explicit foreign keys to avoid ambiguity
    sender = relationship("User", back_populates="sent_messages", foreign_keys=[sender_id])
    receiver = relationship("User", back_populates="received_messages", foreign_keys=[receiver_id])
    reply_to = relationship("Message", foreign_keys=[reply_to_message_id], remote_side=[id])  
    forward_origin = relationship("Message", foreign_keys=[forward_origin_id], remote_side=[id])
