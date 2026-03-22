from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from attack_graph.database import Base
import uuid


class Scenario(Base):
    __tablename__ = "scenarios"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(Integer, nullable=False)
    name        = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    assets       = relationship("Asset",      back_populates="scenario", cascade="all, delete")
    connections  = relationship("Connection", back_populates="scenario", cascade="all, delete")
    attack_paths = relationship("AttackPath", back_populates="scenario", cascade="all, delete")


class Asset(Base):
    __tablename__ = "assets"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id   = Column(UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=False)
    name          = Column(String(100), nullable=False)
    asset_type    = Column(String(50), nullable=False)
    sensitivity   = Column(String(20), default="medium")
    exposure      = Column(String(20), default="internal")
    auth_required = Column(Boolean, default=True)
    encrypted     = Column(Boolean, default=False)
    pos_x         = Column(Float, default=0)
    pos_y         = Column(Float, default=0)

    scenario = relationship("Scenario", back_populates="assets")


class Connection(Base):
    __tablename__ = "connections"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id   = Column(UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=False)
    source_id     = Column(UUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)
    target_id     = Column(UUID(as_uuid=True), ForeignKey("assets.id"), nullable=False)
    protocol      = Column(String(20), default="HTTPS")
    port          = Column(Integer, nullable=True)
    encrypted     = Column(Boolean, default=False)
    auth_required = Column(Boolean, default=True)

    scenario = relationship("Scenario", back_populates="connections")


class AttackPath(Base):
    __tablename__ = "attack_paths"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id      = Column(UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=False)
    path_sequence    = Column(JSONB, nullable=False)
    risk_score       = Column(Float, default=0.0)
    severity         = Column(String(20), default="low")
    stride_threats   = Column(JSONB, default=list)
    mitre_techniques = Column(JSONB, default=list)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    scenario = relationship("Scenario", back_populates="attack_paths")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(Integer, nullable=False)
    scenario_id  = Column(UUID(as_uuid=True), nullable=True)
    action       = Column(String(50), nullable=False)
    anomaly_flag = Column(Boolean, default=False)
    detail       = Column(Text, nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())