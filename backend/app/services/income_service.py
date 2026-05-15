from sqlalchemy.orm import Session
from ..models.income import Income
from ..schemas.income import IncomeCreate, IncomeUpdate

class IncomeService:
    
    @staticmethod
    def get_all(db: Session, income_type: str = None):
        query = db.query(Income)
        if income_type:
            query = query.filter(Income.type == income_type)
        return query.order_by(Income.date.desc()).all()
    
    @staticmethod
    def get_by_id(db: Session, income_id: int):
        return db.query(Income).filter(Income.id == income_id).first()
    
    @staticmethod
    def get_by_type(db: Session, income_type: str):
        return db.query(Income).filter(Income.type == income_type).first()
    
    @staticmethod
    def create(db: Session, data: IncomeCreate):
        income = Income(**data.model_dump())
        db.add(income)
        db.commit()
        db.refresh(income)
        return income
    
    @staticmethod
    def update(db: Session, income_id: int, data: IncomeUpdate):
        income = IncomeService.get_by_id(db, income_id)
        if not income:
            return None
        for key, value in data.model_dump().items():
            setattr(income, key, value)
        db.commit()
        db.refresh(income)
        return income
    
    @staticmethod
    def delete(db: Session, income_id: int):
        income = IncomeService.get_by_id(db, income_id)
        if not income:
            return False
        db.delete(income)
        db.commit()
        return True
    
    @staticmethod
    def get_total_by_type(db: Session, income_type: str):
        result = db.query(db.func.sum(Income.amount)).filter(Income.type == income_type).scalar()
        return result or 0
