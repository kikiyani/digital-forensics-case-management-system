from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy import func, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Investigator(Base):
    __tablename__ = "investigators"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="investigator")  # "admin" or "investigator"
    active = Column(Boolean, default=True)

    cases = relationship("Case", back_populates="owner")

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    owner_id = Column(Integer, ForeignKey("investigators.id"))
    owner = relationship("Investigator", back_populates="cases")

    evidence_items = relationship("EvidenceItem", back_populates="case")

class EvidenceItem(Base):
    __tablename__ = "evidence_items"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String, unique=True, index=True)  # e.g., UUID or generated ID
    case_id = Column(Integer, ForeignKey("cases.id"))
    source_device = Column(String, nullable=False)
    log_type = Column(String)  # pcap, syslog, app, memory, disk
    time_of_acquisition = Column(DateTime(timezone=True), server_default=func.now())
    storage_path = Column(String)  # path on storage
    sha256 = Column(String, nullable=False, index=True)
    meta_data = Column(JSON)  # JSONB-like column
    action_history = Column(JSON)  # keep appendable actions history
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    case = relationship("Case", back_populates="evidence_items")
    chain_entries = relationship("ChainOfCustodyEntry", back_populates="evidence")

class ChainOfCustodyEntry(Base):
    __tablename__ = "chain_of_custody"
    id = Column(Integer, primary_key=True)
    evidence_id = Column(Integer, ForeignKey("evidence_items.id"))
    operator = Column(String)  # investigator username
    action = Column(String)  # collected, transferred, analyzed, sealed
    note = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    evidence = relationship("EvidenceItem", back_populates="chain_entries")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    investigator_id = Column(Integer, ForeignKey("investigators.id"), nullable=True)
    action = Column(String)
    details = Column(JSON)

    # optional relationship; lazy load to avoid cycles
