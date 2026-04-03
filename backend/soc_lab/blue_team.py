from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel

from auth.database  import get_db           # YOUR existing get_db
from soc_lab.models import SecurityLog
from soc_lab.state  import blocked_ips, isolated_hosts

router = APIRouter()


class RespondRequest(BaseModel):
    action: str


# ── 1. GET LOGS + SLA EXPIRATION ENGINE ──────────────────────────────────────
@router.get("/logs")
async def get_logs(db: Session = Depends(get_db)):
    active_logs        = db.query(SecurityLog).filter(SecurityLog.status == "active").all()
    current_time_local = datetime.now()
    current_time_utc   = datetime.utcnow()
    changes_made       = False

    for log in active_logs:
        if not log.timestamp:
            continue
        try:
            if isinstance(log.timestamp, str):
                log_time = datetime.fromisoformat(log.timestamp.split('.')[0].replace('Z', ''))
            else:
                log_time = log.timestamp

            if log_time.tzinfo is not None:
                log_time = log_time.replace(tzinfo=None)

            elapsed = (current_time_local - log_time).total_seconds()
            if elapsed < 0:
                elapsed = (current_time_utc - log_time).total_seconds()

            print(f"Log {log.id} | {log.severity} | {int(elapsed)}s active")

            if log.severity == "High" and elapsed > 45:
                log.status = "missed"
                log.action_taken = "NETWORK BREACHED: SLA Timer Expired"
                changes_made = True
            elif log.severity == "Medium" and elapsed > 120:
                log.status = "missed"
                log.action_taken = "NETWORK BREACHED: SLA Timer Expired"
                changes_made = True

        except Exception as e:
            print(f"TIME ERROR on Log {log.id}: {e}")

    if changes_made:
        db.commit()

    return db.query(SecurityLog).order_by(SecurityLog.timestamp.desc()).all()


# ── 2. RESPOND TO ALERT ───────────────────────────────────────────────────────
@router.post("/respond/{log_id}")
async def respond_to_alert(log_id: int, req: RespondRequest, db: Session = Depends(get_db)):
    log = db.query(SecurityLog).filter(SecurityLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")

    log.status       = "resolved"
    log.action_taken = req.action
    db.commit()

    if req.action == "Block IP on Firewall":
        blocked_ips.add(log.source_ip)
    elif req.action in ("Isolate Target", "Isolate Host"):
        isolated_hosts.add(log.target)

    return {"message": "Alert successfully mitigated and logged"}


# ── 3. RESET SIMULATION ───────────────────────────────────────────────────────
@router.delete("/reset")
async def reset_simulation(db: Session = Depends(get_db)):
    db.query(SecurityLog).delete()
    db.commit()
    blocked_ips.clear()
    isolated_hosts.clear()
    return {"message": "Simulation environment and firewall rules reset successfully."}