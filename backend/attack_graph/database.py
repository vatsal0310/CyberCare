import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Uses the shared CyberCare Postgres container
# Falls back to localhost for local dev without Docker
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://cybercare:cybercare123@localhost:5432/cybercare"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)