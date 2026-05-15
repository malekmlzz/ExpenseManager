from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.income import IncomeCreate, IncomeUpdate, IncomeResponse
from ..services.income_service import IncomeService

router = APIRouter(prefix="/incomes", tags=["Incomes"])

@router.get("", response_model=List[IncomeResponse])
def get_incomes(income_type: str = None, db: Session = Depends(get_db)):
    return IncomeService.get_all(db, income_type)

@router.get("/{income_type}")
def get_income_by_type(income_type: str, db: Session = Depends(get_db)):
    income = IncomeService.get_by_type(db, income_type)
    if not income:
        return {"amount": 0}
    return {"amount": income.amount}

@router.post("", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
def create_income(income: IncomeCreate, db: Session = Depends(get_db)):
    # اگه قبلاً وجود داشته، آپدیت کن
    existing = IncomeService.get_by_type(db, income.type)
    if existing:
        return IncomeService.update(db, existing.id, income)
    return IncomeService.create(db, income)

@router.delete("/{income_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_income(income_id: int, db: Session = Depends(get_db)):
    if not IncomeService.delete(db, income_id):
        raise HTTPException(status_code=404, detail="Income not found")
    return None
