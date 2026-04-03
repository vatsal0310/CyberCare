import os
import time
import logging

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker, declarative_base

logger = logging.getLogger(__name__)

# ── PCL now shares the main CyberCare database ──────────────────────────────
# Using PCL_DATABASE_URL if explicitly set, otherwise falling back to
# DATABASE_URL (the main cybercare DB). This means PCL tables (lab_sessions,
# analytics, leaderboard, etc.) live alongside auth tables in one database,
# which eliminates all cross-database FK violations.
DATABASE_URL = os.getenv("PCL_DATABASE_URL") or os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "❌ Neither PCL_DATABASE_URL nor DATABASE_URL is set. "
        "Add DATABASE_URL to docker-compose.yml under the backend service."
    )

SQL_ECHO = os.getenv("DEBUG_SQL", "false").lower() == "true"

MAX_RETRIES = 10
RETRY_DELAY = 2

engine = None

for attempt in range(1, MAX_RETRIES + 1):
    try:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            pool_timeout=30,
            pool_recycle=1800,
            echo=SQL_ECHO,
        )
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("✅ PCL Database connected successfully")
        break
    except OperationalError as e:
        logger.warning(f"⏳ Waiting for PCL database... ({attempt}/{MAX_RETRIES}) — {e}")
        if attempt == MAX_RETRIES:
            raise RuntimeError(
                f"❌ PCL Database not available after {MAX_RETRIES} retries."
            )
        time.sleep(RETRY_DELAY)

if engine is None:
    raise RuntimeError("❌ PCL Database engine failed to initialize.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def create_tables():
    from password_cracking_lab.models import (  # noqa: F401
        lab_session,
        submission,
        leaderboard,
        analytics,
        command_log,
    )
    Base.metadata.create_all(bind=engine)
    logger.info("✅ All PCL database tables verified/created")