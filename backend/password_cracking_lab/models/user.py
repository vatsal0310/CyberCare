# ⚠️  DO NOT define a User model here.
#
# Users live exclusively in the AUTH database (DATABASE_URL / cybercare DB).
# The PCL module uses its own separate database (PCL_DATABASE_URL / pcl_db).
#
# Defining a User model under PCL's Base would cause SQLAlchemy to create a
# phantom "users" table in pcl_db. Any ForeignKey("users.id") on analytics or
# leaderboard then creates a real PostgreSQL FK constraint referencing that
# empty table — causing ForeignKeyViolation on every INSERT because real users
# only exist in the auth DB, never in pcl_db.
#
# User identity is enforced at the application layer via get_current_user()
# (JWT validation against the auth DB). The user_id stored in PCL tables is
# just a plain Integer — no DB-level FK needed or wanted.