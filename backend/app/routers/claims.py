from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.claim import ClaimCreate, ClaimUpdate, ClaimResponse
from ..services.claim_service import ClaimService

router = APIRouter(prefix="/claims", tags=["Claims"])

@router.get("", response_model=List[ClaimResponse])
def get_claims(db: Session = Depends(get_db)):
    return ClaimService.get_all(db)

@router.get("/total")
def get_total_claims(db: Session = Depends(get_db)):
    return {"total": ClaimService.get_total(db)}

@router.post("", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
def create_claim(claim: ClaimCreate, db: Session = Depends(get_db)):
    return ClaimService.create(db, claim)

@router.put("/{claim_id}", response_model=ClaimResponse)
def update_claim(claim_id: int, claim: ClaimUpdate, db: Session = Depends(get_db)):
    updated = ClaimService.update(db, claim_id, claim)
    if not updated:
        raise HTTPException(status_code=404, detail="Claim not found")
    return updated

@router.delete("/{claim_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_claim(claim_id: int, db: Session = Depends(get_db)):
    if not ClaimService.delete(db, claim_id):
        raise HTTPException(status_code=404, detail="Claim not found")
    return None
