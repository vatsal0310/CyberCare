import asyncio
import random
from datetime import datetime
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel

from auth.database  import get_db           # YOUR existing get_db
from soc_lab.models import SecurityLog
from soc_lab.state  import blocked_ips, isolated_hosts

router = APIRouter()


class AttackRequest(BaseModel):
    attack_type: str
    target: str


# ── CHAOS ENGINE ──────────────────────────────────────────────────────────────
async def execute_chaos_campaign(db: Session):
    attacks = [
        {"type": "SQL Injection",       "targets": ["Web App Login", "Customer Portal"],    "severity": "High",   "payloads": ["' OR 1=1 --", "admin' --", "1; DROP TABLE users"]},
        {"type": "Brute Force SSH",     "targets": ["Server 10.0.1.5", "DB-Host 10.0.1.8"],"severity": "Medium", "payloads": ["admin:admin123", "root:root"]},
        {"type": "Cross-Site Scripting","targets": ["Support Forum", "User Profile"],        "severity": "High",   "payloads": ["<script>alert('XSS')</script>"]},
        {"type": "Automated Port Scan", "targets": ["Subnet 10.0.1.0/24"],                  "severity": "Low",    "payloads": ["SYN Stealth Scan"]},
        {"type": "Ping Sweep",          "targets": ["Gateway 10.0.0.1"],                    "severity": "Low",    "payloads": ["ICMP Echo Request"]},
    ]

    for _ in range(random.randint(25, 38)):
        attack  = random.choice(attacks)
        rand_ip = f"{random.randint(11,200)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}"
        target  = random.choice(attack["targets"])

        status   = "active"
        action   = None
        severity = attack["severity"]

        if target in isolated_hosts:
            status   = "resolved"
            action   = "Failed: Target Host Offline"
            severity = "Low"

        db.add(SecurityLog(
            timestamp    = datetime.now(),
            attack_type  = attack["type"],
            target       = target,
            source_ip    = rand_ip,
            payload      = random.choice(attack["payloads"]),
            severity     = severity,
            status       = status,
            action_taken = action,
        ))
        db.commit()
        await asyncio.sleep(random.uniform(0.3, 1.2))


# ── ENDPOINT 1: Targeted Attack ───────────────────────────────────────────────
@router.post("/launch")
async def launch_attack(req: AttackRequest, db: Session = Depends(get_db)):
    payload_map  = {"SQL Injection": "' OR 1=1 --", "Brute Force": "admin:admin123", "Cross-Site Scripting": "<script>alert(1)</script>"}
    severity_map = {"SQL Injection": "High",         "Brute Force": "Medium",         "Cross-Site Scripting": "High"}
    ip_map       = {"SQL Injection": "10.0.2.88",    "Brute Force": "10.0.1.5",       "Cross-Site Scripting": "10.0.4.22"}

    payload     = payload_map.get(req.attack_type, "generic_payload")
    severity    = severity_map.get(req.attack_type, "Medium")
    attacker_ip = ip_map.get(req.attack_type, f"10.0.2.{random.randint(10,99)}")
    status      = "active"
    action      = None

    if attacker_ip in blocked_ips:
        status = "resolved"; action = "Auto-Dropped by Firewall Rule"; severity = "Low"
    elif req.target in isolated_hosts:
        status = "resolved"; action = "Failed: Target Host Offline (Isolated)"; severity = "Low"

    db.add(SecurityLog(
        timestamp    = datetime.now(),
        attack_type  = req.attack_type,
        target       = req.target,
        source_ip    = attacker_ip,
        payload      = payload,
        severity     = severity,
        status       = status,
        action_taken = action,
    ))
    db.commit()
    return {"message": f"Targeted {req.attack_type} launched successfully."}


# ── ENDPOINT 2: Chaos Campaign ────────────────────────────────────────────────
@router.post("/chaos")
async def launch_chaos(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(execute_chaos_campaign, db)
    return {"message": "Chaos campaign initiated", "status": "running in background"}