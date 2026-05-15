from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import models
from .cases import get_current_user

router = APIRouter(
    prefix="/chain_of_custody",
    tags=["chain_of_custody"]
)

@router.get("/")
def get_chain_of_custody(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    entries = db.query(models.ChainOfCustodyEntry)\
        .order_by(models.ChainOfCustodyEntry.timestamp.desc())\
        .all()

    return entries
