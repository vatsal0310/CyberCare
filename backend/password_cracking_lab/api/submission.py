from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from password_cracking_lab.core.database import SessionLocal
from password_cracking_lab.models.lab_session import LabSession
from password_cracking_lab.models.submission import Submission
from password_cracking_lab.models.leaderboard import Leaderboard
from password_cracking_lab.models.analytics import Analytics
from password_cracking_lab.services.docker_service import on_password_cracked
from auth.security import get_current_user
from auth.models import User

router = APIRouter(prefix="/submission", tags=["Submission"])


class SubmitRequest(BaseModel):
    session_id: int
    submitted_password: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/submit")
def submit_password(
    payload: SubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = (
        db.query(LabSession)
        .filter(
            LabSession.id == payload.session_id,
            LabSession.user_id == current_user.id
        )
        .first()
    )

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.status == "completed":
        raise HTTPException(status_code=400, detail="Lab already completed")

    if session.status == "expired":
        raise HTTPException(status_code=400, detail="Lab session has expired — time ran out")

    if session.status != "running":
        raise HTTPException(status_code=400, detail="Session is not active")

    is_correct = payload.submitted_password.strip() == session.correct_password.strip()

    session.attempts = (session.attempts or 0) + 1

    submission = Submission(
        session_id=session.id,
        submitted_password=payload.submitted_password,
        is_correct=is_correct
    )
    db.add(submission)

    time_taken = None
    time_penalty = 0
    attempt_penalty = 0
    hint_penalty = 0

    print("Submitted:", repr(payload.submitted_password))
    print("Correct:", repr(session.correct_password))
    if is_correct:
        session.status = "completed"
        session.completed_at = datetime.now(timezone.utc)

        # ✅ Ensure both timestamps are timezone aware
        created_at = session.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        time_taken = round(
            (session.completed_at - created_at).total_seconds()
        )

        base_points_map = {
            "beginner": 50,
            "intermediate": 100,
            "advanced": 200
        }

        base = base_points_map.get(session.difficulty, 50)

        # ⏱ Time penalties
        time_penalty = 0
        if time_taken > 300:
            time_penalty += 10
        if time_taken > 600:
            time_penalty += 20

        # ❌ Attempt penalty (non-beginner only)
        attempt_penalty = 0
        if session.difficulty != "beginner":
            attempt_penalty = (session.attempts - 1) * 5

        # 💡 Hint penalty carry-over
        hint_penalty = 0
        if session.hints_used and session.hints_used > 3:
            hint_penalty = (session.hints_used - 3) * 5

        score = base - time_penalty - attempt_penalty - hint_penalty
        session.score = max(score, 10)

        # 🧹 DELETE CONTAINER SAFELY
        if session.container_id:
            container_id = session.container_id
            try:
                on_password_cracked(container_id)
            except Exception as e:
                print(f"Docker cleanup error: {e}")

            # Clear container fields AFTER cleanup attempt
            session.container_id = None
            session.container_port = None

        # 🏆 Leaderboard
        leaderboard = db.query(Leaderboard).filter(
            Leaderboard.user_id == session.user_id
        ).first()

        if leaderboard:
            leaderboard.score += session.score
        else:
            db.add(
                Leaderboard(
                    user_id=session.user_id,
                    score=session.score
                )
            )

        # 📊 Analytics
        analytics = db.query(Analytics).filter(
            Analytics.user_id == session.user_id
        ).first()

        if analytics:
            analytics.total_score += session.score
            analytics.total_time += time_taken
        else:
            db.add(
                Analytics(
                    user_id=session.user_id,
                    total_score=session.score,
                    total_time=time_taken
                )
            )

    db.commit()

    return {
        "success": is_correct,
        "session_id": session.id,
        "session_status": session.status,
        "difficulty": session.difficulty,
        "mode": session.mode,
        "algorithm": session.algorithm,
        "attempts": session.attempts,
        "hints_used": session.hints_used,
        "time_taken_seconds": time_taken,
        "score": session.score if is_correct else None,
        "max_score": {"beginner": 50, "intermediate": 100, "advanced": 200}.get(session.difficulty),
        "base_score": base_points_map.get(session.difficulty) if is_correct else None,
        "time_penalty": time_penalty if is_correct else None,
        "attempt_penalty": attempt_penalty if is_correct else None,
        "hint_penalty": hint_penalty if is_correct else None,
        "message": (
            "Password cracked! Well done."
            if is_correct else
            "Incorrect password. Try again."
        ),
    }