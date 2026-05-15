from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.sql import func
from ..database import Base

class Income(Base):
    __tablename__ = "incomes"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    type = Column(String(50), nullable=False)  # monthly, fixed, extra
    description = Column(String(200), nullable=True)
    date = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
