from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.security import OAuth2PasswordBearer

from ..database import get_db
from .. import models, schemas
from ..auth import decode_token

router = APIRouter(prefix="/cases", tags=["cases"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid auth token")

    user = db.query(models.Investigator)\
        .filter(models.Investigator.username == payload["sub"])\
        .first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

@router.post("/", response_model=schemas.CaseOut)
def create_case(
    payload: schemas.CaseCreate,
    current_user: models.Investigator = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    case = models.Case(
        title=payload.title,
        description=payload.description,
        owner_id=current_user.id
    )

    db.add(case)
    db.commit()
    db.refresh(case)

    return case

@router.get("/", response_model=List[schemas.CaseOut])
def list_cases(
    db: Session = Depends(get_db),
    current_user: models.Investigator = Depends(get_current_user)
):
    if current_user.role == "admin":
        cases = db.query(models.Case).all()
    else:
        cases = db.query(models.Case)\
            .filter(models.Case.owner_id == current_user.id)\
            .all()

    return cases


@router.get("/full")
def list_cases_full(
    db: Session = Depends(get_db),
    current_user: models.Investigator = Depends(get_current_user)
):
    # Role-based filtering
    if current_user.role == "admin":
        cases = db.query(models.Case).all()
    else:
        cases = db.query(models.Case)\
            .filter(models.Case.owner_id == current_user.id)\
            .all()

    result = []

    for case in cases:
        # Use the correct model name
        custody_entries = db.query(models.ChainOfCustodyEntry)\
            .filter(models.ChainOfCustodyEntry.evidence_id == case.id)\
            .order_by(models.ChainOfCustodyEntry.timestamp)\
            .all()

        # Build evidence array
        evidence = [
            {
                "evidence_id": c.id,
                "operator": c.operator,
                "action": c.action,
                "note": c.note,
                "timestamp": c.timestamp
            }
            for c in custody_entries
        ]

        result.append({
            "case_id": case.id,
            "title": case.title,
            "description": case.description,
            "created_at": case.created_at,
            "evidence": evidence
        })

    return result

