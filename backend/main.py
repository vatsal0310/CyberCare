from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

# ── Non-tech routers ──────────────────────────────────────────────────
from Fake_website.fake_website import router as website_router
from PasswordChecker.password_checker import analyze_password
from breach.breach_router import router as breach_router
from Spam_detection.spam_router import router as spam_router
from quiz.quiz_api import router as quiz_router
from sms_spam.spam_sms_detection import sms_router

# ── Tech routers ──────────────────────────────────────────────────────
from smart_vulnerability_analyzer.features_pentesting.router import router as pentest_router
from smart_vulnerability_analyzer.features_pentesting.verification_router import router as verify_router
from attack_graph.router import router as attack_graph_router
from attack_graph.database import create_tables

app = FastAPI(title="CyberCare API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    create_tables()  # creates attack graph tables on boot

@app.get("/")
def root():
    return {"status": "CyberCare API running"}

# ── In-memory auth (non-tech users) ───────────────────────────────────
fake_users_db = {}

class AuthRequest(BaseModel):
    email: str
    password: str
    name: str = None

@app.post("/register")
def register(request: AuthRequest):
    if request.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    fake_users_db[request.email] = {"name": request.name, "password": request.password}
    return {"message": f"Welcome to the team, {request.name}!", "status": "success"}

@app.post("/login")
def login(request: AuthRequest):
    if request.email not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    if fake_users_db[request.email]["password"] != request.password:
        raise HTTPException(status_code=401, detail="Incorrect password")
    return {"message": "Login successful! Access granted.", "token": "fake-jwt-token-123"}

class PasswordRequest(BaseModel):
    password: str

@app.post("/analyze-password")
def analyze(req: PasswordRequest):
    return analyze_password(req.password)

# ── Non-tech routers ──────────────────────────────────────────────────
app.include_router(breach_router,  prefix="/breach",   tags=["Data Breach Checker"])
app.include_router(spam_router,    prefix="/spam",     tags=["Spam Detection"])
app.include_router(sms_router,     prefix="/sms_spam", tags=["SMS Spam Detection"])
app.include_router(quiz_router,    prefix="/quiz",     tags=["Cyber Security Quiz"])
app.include_router(website_router, prefix="/website",  tags=["Fake Website Detector"])

# ── Tech routers ──────────────────────────────────────────────────────
app.include_router(pentest_router)        # /pentest
app.include_router(verify_router)         # /pentest/verify
app.include_router(attack_graph_router)   # /attack-graph