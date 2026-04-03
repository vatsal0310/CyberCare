from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import logging
from sqlalchemy.exc import IntegrityError

from password_cracking_lab.core.database import SessionLocal
from password_cracking_lab.generator import PasswordLabGenerator
from password_cracking_lab.models.lab_session import LabSession
from password_cracking_lab.services.docker_service import (
    create_lab_container, exec_command, write_file_to_container,
    on_password_cracked, stop_lab_container
)
from auth.security import get_current_user
from auth.models import User

router = APIRouter(prefix="/lab", tags=["Lab"])
logger = logging.getLogger(__name__)

TIMER_SECONDS = 600  # 10 minutes


# ---------- Request Models ----------
class LabStartRequest(BaseModel):
    difficulty: str     # beginner | intermediate | advanced


# ---------- DB Dependency ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Start Lab ----------
@router.post("/start")
def start_lab(
    payload: LabStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    allowed_difficulties = ["beginner", "intermediate", "advanced"]

    if payload.difficulty not in allowed_difficulties:
        raise HTTPException(status_code=400, detail="Invalid difficulty level")

    now = datetime.now(timezone.utc)

    # ----------------------------
    # CHECK FOR EXISTING SESSION — clean up any old running sessions
    # ----------------------------
    existing_sessions = db.query(LabSession).filter(
        LabSession.user_id == current_user.id,
        LabSession.status == "running"
    ).all()

    for existing in existing_sessions:
        # Stop and remove the Docker container if it exists
        if existing.container_id:
            try:
                stop_lab_container(existing.container_id)
            except Exception as e:
                logger.warning(f"[LAB START] Could not remove old container {existing.container_id}: {e}")
        existing.status = "expired"

    if existing_sessions:
        db.commit()
        logger.info(f"[LAB START] Cleaned up {len(existing_sessions)} old session(s) for user {current_user.id}")

    # ----------------------------
    # CREATE DB SESSION FIRST
    # ----------------------------
    mode_map = {
        "beginner": "guided",
        "intermediate": "hints",
        "advanced": "free"
    }
    mode = mode_map[payload.difficulty]

    lab_data = PasswordLabGenerator.generate_lab(payload.difficulty)

    new_session = LabSession(
        user_id=current_user.id,
        difficulty=lab_data["difficulty"],
        mode=mode,
        target_hash=lab_data["hash"],
        correct_password=lab_data["plain_password"],
        algorithm=lab_data["algorithm"],
        status="running",
        container_id=None,
        container_port=None,
        expires_at=None,
        current_step=1,
        hints_used=0,
        score=lab_data["points"],
    )

    try:
        db.add(new_session)
        db.commit()
        db.refresh(new_session)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to create lab session. Please try again."
        )

    try:
        # ----------------------------
        # CREATE CONTAINER
        # ----------------------------
        container_info = create_lab_container(timeout_seconds=TIMER_SECONDS)
        container_id = container_info["container_id"]
        port = container_info["port"]
        expires_at = container_info["expires_at"]

        write_file_to_container(
            container_id,
            "/home/labuser/hash.txt",
            lab_data["hash"]
        )

        new_session.container_id = container_id
        new_session.container_port = port
        new_session.expires_at = expires_at

        db.commit()
        db.refresh(new_session)

        return {
            "session_id": new_session.id,
            "difficulty": lab_data["difficulty"],
            "mode": mode,
            "algorithm": lab_data["algorithm"],
            "target_hash": lab_data["hash"],
            "points": lab_data["points"],
            "max_score": lab_data["points"],
            "timer_seconds": TIMER_SECONDS,
            "expires_at": expires_at,
            "terminal": {
                "type": "web",
                "host": "localhost",
                "port": port,
                "username": "labuser",
            },
        }

    except Exception as e:
        import traceback
        logger.error(f"[LAB START ERROR] {str(e)}\n{traceback.format_exc()}")

        new_session.status = "expired"
        db.commit()

        raise HTTPException(status_code=500, detail=f"Lab start failed: {str(e)}")


# ---------- Get Session Status ----------
@router.get("/status/{session_id}")
def get_lab_status(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(LabSession).filter(
        LabSession.id == session_id,
        LabSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if (
        session.status == "running"
        and session.expires_at
        and datetime.now(timezone.utc) > session.expires_at.replace(tzinfo=timezone.utc)
    ):
        session.status = "expired"
        db.commit()

    time_remaining = 0
    if session.status == "running" and session.expires_at:
        delta = session.expires_at.replace(tzinfo=timezone.utc) - datetime.now(timezone.utc)
        time_remaining = max(0, int(delta.total_seconds()))

    return {
        "session_id": session.id,
        "status": session.status,
        "difficulty": session.difficulty,
        "mode": session.mode,
        "algorithm": session.algorithm,
        "target_hash": session.target_hash,
        "current_score": session.score,
        "hints_used": session.hints_used,
        "current_step": session.current_step,
        "attempts": session.attempts,
        "time_remaining_seconds": time_remaining,
        "expires_at": session.expires_at.isoformat() if session.expires_at else None,
    }


# ---------- Get Hint (Intermediate Only) ----------
@router.post("/hint")
def get_hint(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(LabSession).filter(
        LabSession.id == session_id,
        LabSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.status != "running":
        raise HTTPException(status_code=400, detail="Session is no longer active")

    if session.mode != "hints":
        raise HTTPException(status_code=403, detail="Hints are not available in this mode")

    if session.hints_used >= 5:
        raise HTTPException(status_code=400, detail="Maximum hints reached (5/5)")

    session.hints_used += 1

    if session.hints_used > 3:
        session.score = max(10, session.score - 5)

    db.commit()

    hints = {
        1: "Start by listing files in your home directory to find the hash file.",
        2: "The hash is 64 hexadecimal characters long — this indicates SHA-256.",
        3: "The password is likely a common dictionary word with extra characters.",
        4: "Try combining a dictionary word with 2 digits at the end.",
        5: "Use Hashcat hybrid mode: hashcat -m 1400 hash.txt wordlist.txt -a 6 ?d?d",
    }

    return {
        "hint_number": session.hints_used,
        "hint": hints.get(session.hints_used),
        "hints_remaining": 5 - session.hints_used,
        "current_score": session.score,
        "penalty_applied": session.hints_used > 3,
    }


# ---------- Advance Step (Beginner Only) ----------
@router.post("/step")
def advance_step(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(LabSession).filter(
        LabSession.id == session_id,
        LabSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.status != "running":
        raise HTTPException(status_code=400, detail="Session is no longer active")

    if session.mode != "guided":
        raise HTTPException(status_code=403, detail="Steps are only available in guided mode")

    MAX_STEPS = 4
    if session.current_step >= MAX_STEPS:
        raise HTTPException(status_code=400, detail="All steps already completed")

    session.current_step += 1
    db.commit()

    steps = {
        1: {
            "step": 1,
            "title": "Find the Hash",
            "instruction": "List the files in your home directory.",
            "command": "ls /home/labuser/",
            "explanation": "The hash.txt file contains the hashed password you need to crack."
        },
        2: {
            "step": 2,
            "title": "Read the Hash",
            "instruction": "Display the contents of hash.txt.",
            "command": "cat hash.txt",
            "explanation": "This is an MD5 hash — 32 hexadecimal characters. MD5 is a fast, weak hashing algorithm."
        },
        3: {
            "step": 3,
            "title": "Run John the Ripper",
            "instruction": "Use John with the rockyou wordlist to crack the hash.",
            "command": "john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt hash.txt",
            "explanation": "John hashes every word in rockyou.txt and compares it to your hash. The cracked password will appear in the output — look for it between the hash lines."
        },
        4: {
            "step": 4,
            "title": "View the Cracked Password",
            "instruction": "Display the cracked password. Then type it into the Submit box below.",
            "command": "john --show --format=raw-md5 hash.txt",
            "explanation": "This reads from john's pot file. If it shows 0 cracked, the password was already shown in step 3's output — check the line before 'Session completed' and submit it below.",
        },
    }

    return {
        "next_step": session.current_step,
        "total_steps": MAX_STEPS,
        "step_info": steps.get(session.current_step),
    }


# ---------- Force Reset ----------
@router.post("/reset")
def reset_lab_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    running = db.query(LabSession).filter(
        LabSession.user_id == current_user.id,
        LabSession.status == "running"
    ).all()

    count = len(running)
    for session in running:
        session.status = "expired"

    db.commit()

    return {
        "message": f"Reset {count} session(s). You can now start a new lab.",
        "reset_count": count,
    }