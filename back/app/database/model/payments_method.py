from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Payments_Methods(Base):
    __tablename__ = "payment_methods"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer,ForeignKey("users.id"),nullable=False)
    card_number=Column(String(16),nullable=False)
    card_type=Column(String(16),nullable=False)
    expiration_month=Column(Integer,nullable=False)
    expiration_year=Column(Integer,nullable=False)
    cvc_code=Column(Integer,nullable=False)
    card_holder_name = Column(String(50),nullable=False)
    

    # Связи
    users = relationship("users",foreign_keys=[user_id], back_populates="payments_method")