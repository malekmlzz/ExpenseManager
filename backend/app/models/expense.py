from sqlalchemy import Column, Integer, Float, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from ..database import Base

class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    date = Column(String(20), nullable=False)
    is_deleted = Column(Boolean, default=False)  # 🔥 فیلد جدید
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)
