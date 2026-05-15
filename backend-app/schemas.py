from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class InvestigatorCreate(BaseModel):
    username: str
    password: str
    full_name: Optional[str] = None

class InvestigatorOut(BaseModel):
    id: int
    username: str
    full_name: Optional[str]
    role: str

    class Config:
        orm_mode = True

class CaseCreate(BaseModel):
    title: str
    description: Optional[str] = None

class CaseOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    owner_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class EvidenceCreate(BaseModel):
    evidence_id: str = Field(..., description="Unique evidence ID (GUID/UUID)")
    case_id: int
    source_device: str
    log_type: str
    metadata: Optional[Any] = None

class EvidenceOut(BaseModel):
    id: int
    evidence_id: str
    case_id: int
    source_device: str
    log_type: str
    time_of_acquisition: datetime
    storage_path: Optional[str]
    sha256: str
    metadata: Optional[Any]
    action_history: Optional[Any]

    class Config:
        orm_mode = True

class ChainEntryCreate(BaseModel):
    evidence_id: int
    operator: str
    action: str
    note: Optional[str] = None
