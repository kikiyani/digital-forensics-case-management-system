import os
import hashlib
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy.orm import Session
from .. import database, models, schemas
from typing import List
from fastapi.security import OAuth2PasswordBearer
from ..auth import decode_token
from datetime import datetime
import json
from pathlib import Path

router = APIRouter(prefix="/evidence", tags=["evidence"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

STORAGE_DIR = Path(__file__).resolve().parents[2] / "storage"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid auth token")
    username = payload["sub"]
    user = db.query(models.Investigator).filter(models.Investigator.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def sha256_of_fileobj(fileobj):
    h = hashlib.sha256()
    fileobj.seek(0)
    while chunk := fileobj.read(8192):
        if isinstance(chunk, str):
            chunk = chunk.encode()
        h.update(chunk)
    fileobj.seek(0)
    return h.hexdigest()

@router.post("/upload", response_model=schemas.EvidenceOut)
async def upload_evidence(
    evidence_id: str = Form(...),
    case_id: int = Form(...),
    source_device: str = Form(...),
    log_type: str = Form(...),
    metadata_json: str = Form("{}"),
    file: UploadFile = File(...),
    current_user: models.Investigator = Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    # Validate case exists & permission
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # save file
    safe_filename = f"{evidence_id}_{file.filename}"
    dest_path = STORAGE_DIR / safe_filename
    with open(dest_path, "wb") as out_f:
        contents = await file.read()
        out_f.write(contents)

    # compute sha256
    import io
    file_like = io.BytesIO(contents)
    sha256 = sha256_of_fileobj(file_like)

    # parse metadata if JSON
    try:
        metadata = json.loads(metadata_json) if metadata_json else {}
    except Exception:
        metadata = {"raw": metadata_json}

    evidence = models.EvidenceItem(
        evidence_id=evidence_id,
        case_id=case_id,
        source_device=source_device,
        log_type=log_type,
        storage_path=str(dest_path),
        sha256=sha256,
        metadata=metadata,
        action_history=[{"actor": current_user.username, "action": "ingested", "time": datetime.utcnow().isoformat()}]
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)

    # add chain entry
    chain = models.ChainOfCustodyEntry(evidence_id=evidence.id, operator=current_user.username, action="collected", note="Uploaded via web UI")
    db.add(chain)
    # add audit log (append-only)
    audit = models.AuditLog(investigator_id=current_user.id, action="upload_evidence", details={"evidence_id": evidence.evidence_id, "filename": file.filename})
    db.add(audit)
    db.commit()

    return evidence

@router.get("/case/{case_id}", response_model=List[schemas.EvidenceOut])
def list_evidence_for_case(case_id: int, current_user: models.Investigator = Depends(get_current_user), db: Session = Depends(database.get_db)):
    # permission: must be owner or admin or assigned via additional logic (simple for now)
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if current_user.role != "admin" and case.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    items = db.query(models.EvidenceItem).filter(models.EvidenceItem.case_id == case_id).all()
    return items

@router.get("/{evidence_id}")
def get_evidence_detail(evidence_id: str, current_user: models.Investigator = Depends(get_current_user), db: Session = Depends(database.get_db)):
    item = db.query(models.EvidenceItem).filter(models.EvidenceItem.evidence_id == evidence_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    # basic permission: owner or admin
    case = db.query(models.Case).filter(models.Case.id == item.case_id).first()
    if current_user.role != "admin" and case.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    # return detail with chain entries
    chain = db.query(models.ChainOfCustodyEntry).filter(models.ChainOfCustodyEntry.evidence_id == item.id).all()
    return {
        "evidence": item,
        "chain_of_custody": [{"operator": c.operator, "action": c.action, "note": c.note, "timestamp": c.timestamp.isoformat()} for c in chain]
    }

@router.post("/chain", status_code=201)
def add_chain_entry(payload: schemas.ChainEntryCreate, current_user: models.Investigator = Depends(get_current_user), db: Session = Depends(database.get_db)):
    ev = db.query(models.EvidenceItem).filter(models.EvidenceItem.id == payload.evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence not found")
    entry = models.ChainOfCustodyEntry(evidence_id=payload.evidence_id, operator=payload.operator, action=payload.action, note=payload.note)
    db.add(entry)
    # also audit
    audit = models.AuditLog(investigator_id=current_user.id, action="chain_update", details={"evidence_id": ev.evidence_id, "action": payload.action})
    db.add(audit)
    db.commit()
    return {"status": "ok"}
