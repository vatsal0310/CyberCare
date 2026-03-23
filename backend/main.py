from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

# ── Non-tech routers ──────────────────────────────────────────
from Fake_website.fake_website import router as website_router
from PasswordChecker.password_checker import analyze_password
from breach.breach_router import router as breach_router
from Spam_detection.spam_router import router as spam_router
from quiz.quiz_api import router as quiz_router
from sms_spam.spam_sms_detection import sms_router
from pydantic import BaseModel

# ── Tech routers ──────────────────────────────────────────────
from smart_vulnerability_analyzer.features_pentesting.router import router as pentest_router
from smart_vulnerability_analyzer.features_pentesting.verification_router import router as verify_router
from attack_graph.router import router as attack_graph_router
from attack_graph.database import create_tables as create_attack_graph_tables

# ── Auth ──────────────────────────────────────────────────────
from auth.router import router as auth_router
from auth.database import create_tables as create_auth_tables

app = FastAPI(title="CyberCare API")

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup: create all tables ────────────────────────────────
@app.on_event("startup")
def startup():
    create_auth_tables()          # users table
    create_attack_graph_tables()  # scenarios, assets, connections, attack_paths, audit_logs

# ── Root ──────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "CyberCare API running"}

# ── Password (non-tech, no auth needed) ───────────────────────
class PasswordRequest(BaseModel):
    password: str

@app.post("/analyze-password")
def analyze(req: PasswordRequest):
    return analyze_password(req.password)

# ── Non-tech routers (no auth) ────────────────────────────────
app.include_router(breach_router,  prefix="/breach",   tags=["Data Breach Checker"])
app.include_router(spam_router,    prefix="/spam",      tags=["Spam Detection"])
app.include_router(sms_router,     prefix="/sms_spam",  tags=["SMS Spam Detection"])
app.include_router(quiz_router,    prefix="/quiz",      tags=["Cyber Security Quiz"])
app.include_router(website_router, prefix="/website",   tags=["Fake Website Detector"])

# ── Auth routes ───────────────────────────────────────────────
app.include_router(auth_router)          # /auth/login, /auth/register, /auth/me

# ── Tech routes ───────────────────────────────────────────────
app.include_router(pentest_router)       # /pentest/*
app.include_router(verify_router)        # /pentest/verify/*
app.include_router(attack_graph_router)  # /attack-graph/*