from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.sql import func
from password_cracking_lab.core.database import Base


class Leaderboard(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)

    # ✅ FIX: Plain Integer — no ForeignKey("users.id").
    # Leaderboard lives under PCL's own SQLAlchemy Base, which has no 'users' table.
    # 'users' belongs to auth.database.Base — a completely separate metadata registry.
    # Using ForeignKey("users.id") across two different Base registries causes
    # NoReferencedTableError on every db.commit() because SQLAlchemy can't resolve
    # the FK target within PCL's metadata. Referential integrity is enforced by
    # application logic (user_id comes from get_current_user dependency).
    user_id = Column(Integer, nullable=False, unique=True, index=True)

    score = Column(Integer, default=0)

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
