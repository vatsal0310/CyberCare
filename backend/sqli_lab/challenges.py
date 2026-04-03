import jwt
import time
from fastapi import APIRouter, Form, Header
from sqlalchemy import text
import os

from sqli_lab.database import engine   # ← YOUR existing engine, isolated DB

router = APIRouter(prefix="/api/sqli", tags=["SQLi Lab"])

SECRET_KEY = os.getenv("SQLI_SECRET_KEY", "cybercare_sqli_secret_key_fallback")

def get_updated_token(auth_header: str, challenge_id: str):
    completed = []
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            completed = payload.get("completed", [])
        except Exception:
            pass
    if challenge_id not in completed:
        completed.append(challenge_id)
    new_token = jwt.encode({"completed": completed}, SECRET_KEY, algorithm="HS256")
    return new_token, completed


# ── Challenge 1: Break the Login ─────────────────────────────────────────────
@router.post("/challenge1/login")
def challenge1_login(
    username: str = Form(...),
    password: str = Form(""),
    secure: bool = Form(False),
    authorization: str = Header(None),
):
    if secure:
        query_display = "SELECT id, username FROM users WHERE username = :username AND password = :password"
        try:
            with engine.connect() as conn:
                result = conn.execute(text(query_display), {"username": username, "password": password}).fetchone()
                safe_query_log = f"{query_display}\n-- [Safe Bindings: username='{username}', password='{password}']"
                if result:
                    new_token, completed = get_updated_token(authorization, "challenge1")
                    return {"success": True, "message": f"Welcome back, {result[1]}!", "query": safe_query_log, "token": new_token, "completed": completed}
                return {"success": False, "message": "Invalid credentials.", "query": safe_query_log}
        except Exception as e:
            return {"success": False, "error": str(e), "query": query_display}
    else:
        query = f"SELECT id, username FROM users WHERE username = '{username}' AND password = '{password}'"
        try:
            with engine.connect() as conn:
                result = conn.execute(text(query)).fetchone()
                if result:
                    new_token, completed = get_updated_token(authorization, "challenge1")
                    return {"success": True, "message": f"Welcome back, {result[1]}!", "query": query, "token": new_token, "completed": completed}
                return {"success": False, "message": "Invalid credentials.", "query": query}
        except Exception as e:
            return {"success": False, "error": str(e), "query": query}


# ── Challenge 2: Data Exfiltration ───────────────────────────────────────────
@router.get("/challenge2/search")
def challenge2_search(query: str = "", authorization: str = Header(None)):
    sql_query = f"SELECT id, name, description FROM products WHERE name LIKE '%{query}%'"
    try:
        with engine.connect() as conn:
            results = conn.execute(text(sql_query)).fetchall()
            data = [{"id": row[0], "name": row[1], "description": row[2]} for row in results]
            solved = any("CyberCare_SuperSecret_99!" in str(item.get("description", "")) for item in data)
            if solved:
                new_token, completed = get_updated_token(authorization, "challenge2")
                return {"success": True, "data": data, "query": sql_query, "token": new_token, "completed": completed}
            return {"success": True, "data": data, "query": sql_query}
    except Exception as e:
        return {"success": False, "error": str(e), "query": sql_query}


# ── Challenge 3: Error Reveals ───────────────────────────────────────────────
@router.get("/challenge3/status")
def challenge3_status(user_id: str = "", authorization: str = Header(None)):
    sql_query = f"SELECT username FROM users WHERE id = {user_id}"
    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql_query)).fetchone()
            if result:
                return {"success": True, "message": "User account is Active.", "query": sql_query}
            return {"success": False, "message": "User not found.", "query": sql_query}
    except Exception as e:
        error_msg = str(e)
        if "CyberCare_SuperSecret_99!" in error_msg:
            new_token, completed = get_updated_token(authorization, "challenge3")
            return {"success": False, "error": error_msg, "query": sql_query, "token": new_token, "completed": completed}
        return {"success": False, "error": error_msg, "query": sql_query}


# ── Challenge 4: Blind Boolean ───────────────────────────────────────────────
@router.get("/challenge4/check_user")
def challenge4_check_user(username: str = "", authorization: str = Header(None)):
    sql_query = f"SELECT username FROM users WHERE username = '{username}'"
    try:
        with engine.connect() as conn:
            result = conn.execute(text(sql_query)).fetchone()
            if result:
                if "password" in username.lower() and "admin" in username.lower():
                    new_token, completed = get_updated_token(authorization, "challenge4")
                    return {"success": True, "exists": True, "message": "Username is already taken.", "query": sql_query, "token": new_token, "completed": completed}
                return {"success": True, "exists": True, "message": "Username is already taken.", "query": sql_query}
            return {"success": True, "exists": False, "message": "Username is available!", "query": sql_query}
    except Exception as e:
        return {"success": False, "exists": False, "message": "An unexpected error occurred.", "query": sql_query}


# ── Challenge 5: Timing Attack ───────────────────────────────────────────────
@router.get("/challenge5/reset_password")
def challenge5_reset(email: str = "", authorization: str = Header(None)):
    sql_query = f"SELECT id FROM users WHERE username = '{email}'"
    start_time = time.time()
    try:
        with engine.connect() as conn:
            conn.execute(text(sql_query))
    except Exception:
        pass
    end_time = time.time()
    duration = round((end_time - start_time) * 1000)
    if duration >= 2000 and "pg_sleep" in email.lower():
        new_token, completed = get_updated_token(authorization, "challenge5")
        return {"success": True, "message": "If that account exists, a password reset link has been sent.", "time_taken_ms": duration, "query": sql_query, "token": new_token, "completed": completed}
    return {"success": True, "message": "If that account exists, a password reset link has been sent.", "time_taken_ms": duration, "query": sql_query}


# ── Challenge 6: Stored Payload ──────────────────────────────────────────────
@router.post("/challenge6/set_profile")
def challenge6_set(profile_name: str = Form(...), authorization: str = Header(None)):
    with engine.connect() as conn:
        conn.execute(text("CREATE TABLE IF NOT EXISTS profiles (id SERIAL PRIMARY KEY, name VARCHAR(100))"))
        conn.execute(text("DELETE FROM profiles"))
        conn.execute(text("INSERT INTO profiles (name) VALUES (:name)"), {"name": profile_name})
        conn.commit()
    return {"success": True, "message": "Profile saved successfully."}


@router.get("/challenge6/view_profile")
def challenge6_view(authorization: str = Header(None)):
    with engine.connect() as conn:
        profile = conn.execute(text("SELECT name FROM profiles LIMIT 1")).fetchone()
        if not profile:
            return {"success": False, "error": "No profile has been set yet.", "query": "None"}
        stored_name = profile[0]
        sql_query = f"SELECT id, name FROM profiles WHERE name = '{stored_name}'"
        try:
            results = conn.execute(text(sql_query)).fetchall()
            data = [{"id": row[0], "name": row[1]} for row in results]
            solved = any("CyberCare_SuperSecret_99!" in str(item.get("name", "")) for item in data)
            if solved:
                new_token, completed = get_updated_token(authorization, "challenge6")
                return {"success": True, "data": data, "query": sql_query, "token": new_token, "completed": completed}
            return {"success": True, "data": data, "query": sql_query}
        except Exception as e:
            return {"success": False, "error": str(e), "query": sql_query}


# ── Reset ────────────────────────────────────────────────────────────────────
@router.post("/reset")
def reset_database():
    try:
        with engine.connect() as conn:
            conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
            conn.execute(text("DROP TABLE IF EXISTS products CASCADE"))
            conn.execute(text("DROP TABLE IF EXISTS profiles CASCADE"))
            conn.execute(text("""
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(50) NOT NULL
                )
            """))
            conn.execute(text("INSERT INTO users (username, password) VALUES ('admin', 'CyberCare_SuperSecret_99!')"))
            conn.execute(text("""
                CREATE TABLE products (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100),
                    description TEXT
                )
            """))
            conn.execute(text("""
                INSERT INTO products (name, description) VALUES
                ('Cyber Shield', 'Standard firewall protection suite.'),
                ('Quantum Key', 'Military-grade encryption software.'),
                ('Network Scanner', 'Find vulnerabilities in your local subnet.')
            """))
            conn.execute(text("CREATE TABLE profiles (id SERIAL PRIMARY KEY, name VARCHAR(100))"))
            conn.commit()
        return {"success": True, "message": "Database reset successfully."}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ── Startup Init ─────────────────────────────────────────────────────────────
def init_sqli_db():
    """Call this from main.py on startup to seed the SQLi lab database."""
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(50) NOT NULL
                )
            """))
            conn.execute(text("""
                INSERT INTO users (username, password)
                VALUES ('admin', 'CyberCare_SuperSecret_99!')
                ON CONFLICT (username) DO NOTHING
            """))
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS products (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100),
                    description TEXT
                )
            """))
            result = conn.execute(text("SELECT COUNT(*) FROM products")).scalar()
            if result == 0:
                conn.execute(text("""
                    INSERT INTO products (name, description) VALUES
                    ('Cyber Shield', 'Standard firewall protection suite.'),
                    ('Quantum Key', 'Military-grade encryption software.'),
                    ('Network Scanner', 'Find vulnerabilities in your local subnet.')
                """))
            conn.execute(text("CREATE TABLE IF NOT EXISTS profiles (id SERIAL PRIMARY KEY, name VARCHAR(100))"))
            conn.commit()
    except Exception as e:
        print(f"SQLi Lab DB init error: {e}")