from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from ..services.expense_service import ExpenseService

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.get("", response_model=List[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    """دریافت فقط هزینه‌های فعال (حذف نشده)"""
    return ExpenseService.get_all(db, include_deleted=False)

@router.get("/total")
def get_total_expenses(db: Session = Depends(get_db)):
    """مجموع هزینه‌های فعال"""
    return {"total": ExpenseService.get_total_active(db)}

@router.get("/history")
def get_expense_history(db: Session = Depends(get_db)):
    """دریافت همه هزینه‌ها (حتی حذف شده) برای گزارشات"""
    return ExpenseService.get_all(db, include_deleted=True)

@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    return ExpenseService.create(db, expense)

@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, expense: ExpenseUpdate, db: Session = Depends(get_db)):
    updated = ExpenseService.update(db, expense_id, expense)
    if not updated:
        raise HTTPException(status_code=404, detail="Expense not found")
    return updated

@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    """حذف نرم (فقط علامت حذف میخوره، از دیتابیس پاک نمیشه)"""
    if not ExpenseService.delete(db, expense_id):
        raise HTTPException(status_code=404, detail="Expense not found")
    return None
