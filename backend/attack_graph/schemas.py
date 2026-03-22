from pydantic import BaseModel, field_validator
from typing import Optional, List
from uuid import UUID
from datetime import datetime
import re

def block_real_identifiers(value: str) -> str:
    if re.match(r"\d+\.\d+\.\d+\.\d+", value):
        raise ValueError("Real IP addresses are not allowed.")
    if re.match(r"([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}", value):
        raise ValueError("Real domain names are not allowed.")
    return value

class ScenarioCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ScenarioOut(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    created_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

class AssetCreate(BaseModel):
    name: str
    asset_type: str
    sensitivity: Optional[str] = "medium"
    exposure: Optional[str] = "internal"
    auth_required: Optional[bool] = True
    encrypted: Optional[bool] = False
    pos_x: Optional[float] = 0
    pos_y: Optional[float] = 0

    @field_validator("name")
    @classmethod
    def validate_name(cls, v):
        return block_real_identifiers(v)

class AssetOut(AssetCreate):
    id: UUID
    scenario_id: UUID
    model_config = {"from_attributes": True}

class ConnectionCreate(BaseModel):
    source_id: UUID
    target_id: UUID
    protocol: Optional[str] = "HTTPS"
    port: Optional[int] = None
    encrypted: Optional[bool] = False
    auth_required: Optional[bool] = True

class ConnectionOut(ConnectionCreate):
    id: UUID
    scenario_id: UUID
    model_config = {"from_attributes": True}

class AttackPathOut(BaseModel):
    id: UUID
    path_sequence: List[str]
    risk_score: float
    severity: str
    stride_threats: List[str]
    mitre_techniques: List[str]
    model_config = {"from_attributes": True}

class AnalysisOut(BaseModel):
    scenario_id: UUID
    total_paths: int
    highest_risk: float
    attack_paths: List[AttackPathOut]