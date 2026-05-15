from sqlalchemy import Column, Integer, Float, String, Text, DateTime
from sqlalchemy.sql import func
from ..database import Base

class Debt(Base):
    __tablename__ = "debts"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    person = Column(String(100), nullable=False)  # به چه کسی بدهکارم
    description = Column(Text, nullable=True)
    due_date = Column(String(20), nullable=True)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
