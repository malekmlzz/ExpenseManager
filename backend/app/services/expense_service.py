from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from ..models.expense import Expense
from ..schemas.expense import ExpenseCreate, ExpenseUpdate
from datetime import datetime

class ExpenseService:
    
    @staticmethod
    def get_all(db: Session, include_deleted: bool = False):
        query = db.query(Expense)
        if not include_deleted:
            query = query.filter(Expense.is_deleted == False)
        return query.order_by(Expense.date.desc()).all()
    
    @staticmethod
    def get_by_id(db: Session, expense_id: int):
        return db.query(Expense).filter(Expense.id == expense_id, Expense.is_deleted == False).first()
    
    @staticmethod
    def create(db: Session, data: ExpenseCreate):
        expense = Expense(**data.model_dump())
        db.add(expense)
        db.commit()
        db.refresh(expense)
        return expense
    
    @staticmethod
    def update(db: Session, expense_id: int, data: ExpenseUpdate):
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            return None
        # فقط فیلدهایی که مقدار دارن رو بروزرسانی کن
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(expense, key, value)
        db.commit()
        db.refresh(expense)
        return expense
    
    @staticmethod
    def delete(db: Session, expense_id: int):
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            return False
        expense.is_deleted = True
        expense.deleted_at = datetime.now()
        db.commit()
        return True
    
    @staticmethod
    def get_total_active(db: Session):
        result = db.query(db.func.sum(Expense.amount)).filter(Expense.is_deleted == False).scalar()
        return result or 0
