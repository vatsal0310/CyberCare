from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from auth.database import Base  # reuses YOUR existing Base & engine


class SecurityLog(Base):
    __tablename__ = "security_logs"

    id           = Column(Integer, primary_key=True, index=True)
    timestamp    = Column(DateTime, default=datetime.utcnow)
    attack_type  = Column(String)
    target       = Column(String)
    source_ip    = Column(String)
    payload      = Column(String, nullable=True)
    severity     = Column(String)
    status       = Column(String, default="active")   # active | resolved | missed
    action_taken = Column(String, nullable=True)