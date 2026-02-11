from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Payments(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) 
    payment_method_id = Column(Integer, ForeignKey("payment_methods.id"), nullable=False) 
    amount = Column(Integer,nullable=False)
    currency = Column(String(3),nullable=False)
    paymnet_date = Column(DateTime,default=datetime=utcnow())
    paymnet_duration = Column(DateTime,nullable=False)
    auto_renewal = Column(Boolean,nullable=False)
    

    # Связи
    users = relationship("users",foreign_keys=[user_id], back_populates="payments")
    payments_method = relationship("payments_methods",foreign_keys=[payment_method_id],back_populates="payments")