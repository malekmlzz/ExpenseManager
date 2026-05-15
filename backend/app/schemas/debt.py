from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DebtBase(BaseModel):
    amount: float = Field(..., gt=0)
    person: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    due_date: Optional[str] = None
    status: str = Field(default="pending", pattern="^(pending|paid)$")

class DebtCreate(DebtBase):
    pass

class DebtUpdate(DebtBase):
    pass

class DebtResponse(DebtBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
