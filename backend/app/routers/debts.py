from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.debt import DebtCreate, DebtUpdate, DebtResponse
from ..services.debt_service import DebtService

router = APIRouter(prefix="/debts", tags=["Debts"])

@router.get("", response_model=List[DebtResponse])
def get_debts(db: Session = Depends(get_db)):
    return DebtService.get_all(db)

@router.get("/total")
def get_total_debts(db: Session = Depends(get_db)):
    return {"total": DebtService.get_total(db)}

@router.post("", response_model=DebtResponse, status_code=status.HTTP_201_CREATED)
def create_debt(debt: DebtCreate, db: Session = Depends(get_db)):
    return DebtService.create(db, debt)

@router.put("/{debt_id}", response_model=DebtResponse)
def update_debt(debt_id: int, debt: DebtUpdate, db: Session = Depends(get_db)):
    updated = DebtService.update(db, debt_id, debt)
    if not updated:
        raise HTTPException(status_code=404, detail="Debt not found")
    return updated

@router.delete("/{debt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_debt(debt_id: int, db: Session = Depends(get_db)):
    if not DebtService.delete(db, debt_id):
        raise HTTPException(status_code=404, detail="Debt not found")
    return None
