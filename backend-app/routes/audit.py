from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import models, schemas
from .cases import get_current_user

router = APIRouter(prefix="/audit_logs", tags=["audit"])

@router.get("/")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    logs = db.query(models.AuditLog)\
        .order_by(models.AuditLog.timestamp.desc())\
        .all()

    return logs
