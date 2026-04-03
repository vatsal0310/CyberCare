from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from password_cracking_lab.core.database import Base


class LabSession(Base):
    __tablename__ = "lab_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)

    difficulty = Column(String, nullable=False)          # beginner | intermediate | advanced
    mode = Column(String, nullable=False)                # guided | hints | free
    algorithm = Column(String, nullable=False)           # md5 | sha256 | bcrypt

    target_hash = Column(String, nullable=False)
    correct_password = Column(String, nullable=False)

    status = Column(String, default="running")           # running | completed | expired

    attempts = Column(Integer, default=0)

    expires_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    score = Column(Integer, nullable=True)

    container_id = Column(String, nullable=True)
    container_port = Column(Integer, nullable=True)

    current_step = Column(Integer, default=1)
    hints_used = Column(Integer, default=0)
