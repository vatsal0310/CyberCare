from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from attack_graph.database import get_db
from attack_graph.models import Scenario, Asset, Connection, AttackPath, AuditLog
from attack_graph.schemas import (
    ScenarioCreate, ScenarioOut, AssetCreate, AssetOut,
    ConnectionCreate, ConnectionOut, AnalysisOut, AttackPathOut
)
from attack_graph.services.validation import validate_asset, validate_scenario_name
from attack_graph.services.graph_engine import enumerate_attack_paths
from attack_graph.services.risk_scorer import score_path, get_severity
from attack_graph.services.mappers import get_stride_threats, get_mitre_techniques
from auth.security import get_current_user
from auth.models import User

router = APIRouter(prefix="/attack-graph", tags=["Attack Graph"])
auth   = Depends(get_current_user)


@router.post("/scenarios", response_model=ScenarioOut)
def create_scenario(data: ScenarioCreate, db: Session = Depends(get_db), current_user: User = auth):
    validate_scenario_name(data.name)
    scenario = Scenario(user_id=current_user.id, name=data.name, description=data.description)
    db.add(scenario); db.commit(); db.refresh(scenario)
    return scenario

@router.get("/scenarios", response_model=List[ScenarioOut])
def get_scenarios(db: Session = Depends(get_db), current_user: User = auth):
    return db.query(Scenario).filter(Scenario.user_id == current_user.id).all()

@router.delete("/scenarios/{scenario_id}")
def delete_scenario(scenario_id: UUID, db: Session = Depends(get_db), current_user: User = auth):
    scenario = db.query(Scenario).filter(Scenario.id == scenario_id, Scenario.user_id == current_user.id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found.")
    db.query(AttackPath).filter(AttackPath.scenario_id == scenario_id).delete()
    db.query(Connection).filter(Connection.scenario_id == scenario_id).delete()
    db.query(Asset).filter(Asset.scenario_id == scenario_id).delete()
    db.query(AuditLog).filter(AuditLog.scenario_id == scenario_id).delete()
    db.delete(scenario); db.commit()
    return {"message": "Scenario deleted."}

@router.post("/scenarios/{scenario_id}/assets", response_model=AssetOut)
def add_asset(scenario_id: UUID, data: AssetCreate, db: Session = Depends(get_db), current_user: User = auth):
    validate_asset(name=data.name, asset_type=data.asset_type)
    asset = Asset(scenario_id=scenario_id, **data.model_dump())
    db.add(asset); db.commit(); db.refresh(asset)
    return asset

@router.get("/scenarios/{scenario_id}/assets", response_model=List[AssetOut])
def get_assets(scenario_id: UUID, db: Session = Depends(get_db), current_user: User = auth):
    return db.query(Asset).filter(Asset.scenario_id == scenario_id).all()

@router.delete("/assets/{asset_id}")
def delete_asset(asset_id: UUID, db: Session = Depends(get_db), current_user: User = auth):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found.")
    db.delete(asset); db.commit()
    return {"message": "Asset deleted."}

@router.post("/scenarios/{scenario_id}/connections", response_model=ConnectionOut)
def add_connection(scenario_id: UUID, data: ConnectionCreate, db: Session = Depends(get_db), current_user: User = auth):
    if data.port:
        validate_asset(name="check", asset_type="web_server", port=data.port)
    connection = Connection(scenario_id=scenario_id, **data.model_dump())
    db.add(connection); db.commit(); db.refresh(connection)
    return connection

@router.get("/scenarios/{scenario_id}/connections", response_model=List[ConnectionOut])
def get_connections(scenario_id: UUID, db: Session = Depends(get_db), current_user: User = auth):
    return db.query(Connection).filter(Connection.scenario_id == scenario_id).all()

@router.post("/scenarios/{scenario_id}/analyze", response_model=AnalysisOut)
def analyze_scenario(scenario_id: UUID, db: Session = Depends(get_db), current_user: User = auth):
    assets      = db.query(Asset).filter(Asset.scenario_id == scenario_id).all()
    connections = db.query(Connection).filter(Connection.scenario_id == scenario_id).all()
    if not assets:
        raise HTTPException(status_code=400, detail="Add assets before running analysis.")

    db.query(AttackPath).filter(AttackPath.scenario_id == scenario_id).delete()
    asset_map   = {str(a.id): a for a in assets}
    saved_paths = []

    for path_ids in enumerate_attack_paths(assets, connections):
        path_assets = [asset_map[aid] for aid in path_ids if aid in asset_map]
        attack_path = AttackPath(
            scenario_id      = scenario_id,
            path_sequence    = [a.name for a in path_assets],
            risk_score       = score_path(path_ids, assets),
            severity         = get_severity(score_path(path_ids, assets)),
            stride_threats   = get_stride_threats([a.asset_type for a in path_assets]),
            mitre_techniques = get_mitre_techniques([a.asset_type for a in path_assets]),
        )
        db.add(attack_path); saved_paths.append(attack_path)

    db.add(AuditLog(user_id=current_user.id, scenario_id=scenario_id, action="analyzed"))
    db.commit()

    return AnalysisOut(
        scenario_id  = scenario_id,
        total_paths  = len(saved_paths),
        highest_risk = max((p.risk_score for p in saved_paths), default=0.0),
        attack_paths = saved_paths,
    )