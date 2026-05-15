from sqlalchemy.orm import Session
from ..models.claim import Claim
from ..schemas.claim import ClaimCreate, ClaimUpdate

class ClaimService:
    
    @staticmethod
    def get_all(db: Session):
        return db.query(Claim).order_by(Claim.due_date.desc()).all()
    
    @staticmethod
    def get_by_id(db: Session, claim_id: int):
        return db.query(Claim).filter(Claim.id == claim_id).first()
    
    @staticmethod
    def create(db: Session, data: ClaimCreate):
        claim = Claim(**data.model_dump())
        db.add(claim)
        db.commit()
        db.refresh(claim)
        return claim
    
    @staticmethod
    def update(db: Session, claim_id: int, data: ClaimUpdate):
        claim = ClaimService.get_by_id(db, claim_id)
        if not claim:
            return None
        for key, value in data.model_dump().items():
            setattr(claim, key, value)
        db.commit()
        db.refresh(claim)
        return claim
    
    @staticmethod
    def delete(db: Session, claim_id: int):
        claim = ClaimService.get_by_id(db, claim_id)
        if not claim:
            return False
        db.delete(claim)
        db.commit()
        return True
    
    @staticmethod
    def get_total(db: Session):
        result = db.query(db.func.sum(Claim.amount)).filter(Claim.status == "pending").scalar()
        return result or 0
