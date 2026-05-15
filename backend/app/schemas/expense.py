from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ExpenseBase(BaseModel):
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    date: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(ExpenseBase):
    """برای بروزرسانی هزینه - همه فیلدها اختیاری هستن"""
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    date: Optional[str] = None

class ExpenseResponse(ExpenseBase):
    id: int
    is_deleted: bool = False
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
