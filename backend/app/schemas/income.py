from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class IncomeBase(BaseModel):
    amount: float = Field(..., gt=0)
    type: str = Field(..., pattern="^(monthly|fixed|extra)$")
    description: Optional[str] = None
    date: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))

class IncomeCreate(IncomeBase):
    pass

class IncomeUpdate(IncomeBase):
    pass

class IncomeResponse(IncomeBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
