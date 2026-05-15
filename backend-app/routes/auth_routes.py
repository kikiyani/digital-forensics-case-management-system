from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.Investigator).filter(models.Investigator.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/create_investigator", response_model=schemas.InvestigatorOut)
def create_investigator(payload: schemas.InvestigatorCreate, db: Session = Depends(database.get_db)):
    existing = db.query(models.Investigator).filter(models.Investigator.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    user = models.Investigator(
        username=payload.username,
        full_name=payload.full_name,
        hashed_password=auth.get_password_hash(payload.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
