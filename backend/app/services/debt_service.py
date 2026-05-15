from sqlalchemy.orm import Session
from ..models.debt import Debt
from ..schemas.debt import DebtCreate, DebtUpdate

class DebtService:
    
    @staticmethod
    def get_all(db: Session):
        return db.query(Debt).order_by(Debt.due_date.desc()).all()
    
    @staticmethod
    def get_by_id(db: Session, debt_id: int):
        return db.query(Debt).filter(Debt.id == debt_id).first()
    
    @staticmethod
    def create(db: Session, data: DebtCreate):
        debt = Debt(**data.model_dump())
        db.add(debt)
        db.commit()
        db.refresh(debt)
        return debt
    
    @staticmethod
    def update(db: Session, debt_id: int, data: DebtUpdate):
        debt = DebtService.get_by_id(db, debt_id)
        if not debt:
            return None
        for key, value in data.model_dump().items():
            setattr(debt, key, value)
        db.commit()
        db.refresh(debt)
        return debt
    
    @staticmethod
    def delete(db: Session, debt_id: int):
        debt = DebtService.get_by_id(db, debt_id)
        if not debt:
            return False
        db.delete(debt)
        db.commit()
        return True
    
    @staticmethod
    def get_total(db: Session):
        result = db.query(db.func.sum(Debt.amount)).filter(Debt.status == "pending").scalar()
        return result or 0
