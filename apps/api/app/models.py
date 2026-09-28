import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, Integer, Text, JSON, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from .db import Base

def uid(): return str(uuid.uuid4())
def now(): return datetime.now(timezone.utc)

class User(Base):
    __tablename__="users"
    id: Mapped[str]=mapped_column(String(36), primary_key=True, default=uid)
    email: Mapped[str]=mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str]=mapped_column(String(255))
    name: Mapped[str]=mapped_column(String(120), default="")
    created_at: Mapped[datetime]=mapped_column(DateTime(timezone=True), default=now)

class Organization(Base):
    __tablename__="organizations"
    id: Mapped[str]=mapped_column(String(36), primary_key=True, default=uid)
    name: Mapped[str]=mapped_column(String(120))
    slug: Mapped[str]=mapped_column(String(120), unique=True, index=True)
    plan: Mapped[str]=mapped_column(String(40), default="free")
    created_at: Mapped[datetime]=mapped_column(DateTime(timezone=True), default=now)

class Membership(Base):
    __tablename__="memberships"
    __table_args__=(UniqueConstraint("user_id","org_id"),)
    id: Mapped[str]=mapped_column(String(36), primary_key=True, default=uid)
    user_id: Mapped[str]=mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    org_id: Mapped[str]=mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"))
    role: Mapped[str]=mapped_column(String(30), default="viewer")

class Cluster(Base):
    __tablename__="clusters"
    id: Mapped[str]=mapped_column(String(36), primary_key=True, default=uid)
    org_id: Mapped[str]=mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    name: Mapped[str]=mapped_column(String(160))
    environment: Mapped[str]=mapped_column(String(60), default="production")
    status: Mapped[str]=mapped_column(String(30), default="pending")
    agent_token_hash: Mapped[str]=mapped_column(String(255))
    score: Mapped[int]=mapped_column(Integer, default=100)
    last_seen_at: Mapped[datetime|None]=mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime]=mapped_column(DateTime(timezone=True), default=now)

class Scan(Base):
    __tablename__="scans"
    id: Mapped[str]=mapped_column(String(36), primary_key=True, default=uid)
    org_id: Mapped[str]=mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    cluster_id: Mapped[str]=mapped_column(ForeignKey("clusters.id", ondelete="CASCADE"), index=True)
    status: Mapped[str]=mapped_column(String(30), default="completed")
    score: Mapped[int]=mapped_column(Integer, default=100)
    counts: Mapped[dict]=mapped_column(JSON, default=dict)
    metadata_json: Mapped[dict]=mapped_column(JSON, default=dict)
    created_at: Mapped[datetime]=mapped_column(DateTime(timezone=True), default=now)

class Finding(Base):
    __tablename__="findings"
    __table_args__=(UniqueConstraint("cluster_id","stable_id"),)
    id: Mapped[str]=mapped_column(String(36), primary_key=True, default=uid)
    org_id: Mapped[str]=mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    cluster_id: Mapped[str]=mapped_column(ForeignKey("clusters.id", ondelete="CASCADE"), index=True)
    scan_id: Mapped[str]=mapped_column(ForeignKey("scans.id", ondelete="CASCADE"))
    stable_id: Mapped[str]=mapped_column(String(255))
    control: Mapped[str]=mapped_column(String(120), default="")
    severity: Mapped[str]=mapped_column(String(20), index=True)
    title_en: Mapped[str]=mapped_column(Text)
    title_mn: Mapped[str]=mapped_column(Text, default="")
    resource: Mapped[str]=mapped_column(String(500), default="")
    namespace: Mapped[str]=mapped_column(String(180), default="")
    status: Mapped[str]=mapped_column(String(30), default="OPEN", index=True)
    confidence: Mapped[str]=mapped_column(String(20), default="")
    found_by: Mapped[list]=mapped_column(JSON, default=list)
    evidence: Mapped[dict]=mapped_column(JSON, default=dict)
    remediation_en: Mapped[str]=mapped_column(Text, default="")
    remediation_mn: Mapped[str]=mapped_column(Text, default="")
    first_seen_at: Mapped[datetime]=mapped_column(DateTime(timezone=True), default=now)
    last_seen_at: Mapped[datetime]=mapped_column(DateTime(timezone=True), default=now)

class AuditLog(Base):
    __tablename__="audit_logs"
    id: Mapped[str]=mapped_column(String(36), primary_key=True, default=uid)
    org_id: Mapped[str]=mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    actor_user_id: Mapped[str|None]=mapped_column(String(36), nullable=True)
    action: Mapped[str]=mapped_column(String(120))
    target: Mapped[str]=mapped_column(String(255), default="")
    details: Mapped[dict]=mapped_column(JSON, default=dict)
    created_at: Mapped[datetime]=mapped_column(DateTime(timezone=True), default=now)
