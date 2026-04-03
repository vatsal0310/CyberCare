from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import sqlalchemy
load_dotenv()

# ── Non-tech ─────────────────────────────
from Fake_website.fake_website import router as website_router
from PasswordChecker.password_checker import analyze_password
from breach.breach_router import router as breach_router
from Spam_detection.spam_router import router as spam_router
from quiz.quiz_api import router as quiz_router
from sms_spam.spam_sms_detection import sms_router, load_models
from pydantic import BaseModel

# ── Tech ─────────────────────────────────
from smart_vulnerability_analyzer.features_pentesting.router import router as pentest_router
from smart_vulnerability_analyzer.features_pentesting.verification_router import router as verify_router
from attack_graph.router import router as attack_graph_router
from attack_graph.database import create_tables as create_attack_graph_tables

from soc_lab.red_team import router as red_router
from soc_lab.blue_team import router as blue_router
from soc_lab import models as soc_models

from sqli_lab.challenges import router as sqli_router, init_sqli_db

from auth.database import engine
from auth.router import router as auth_router
from auth.database import create_tables as create_auth_tables

# ── Guided Workflow ───────────────────────
from guided_workflow import models as guided_models
from guided_workflow.router import router as guided_workflow_router
from guided_workflow.seed import seed_all as seed_guided_workflow

# ── Password Cracking Lab ─────────────────────────────────────────────
from password_cracking_lab.core.database import create_tables as create_pcl_tables
from password_cracking_lab.api.lab import router as pcl_lab_router
from password_cracking_lab.api.terminal import router as pcl_terminal_router
from password_cracking_lab.api.submission import router as pcl_submission_router
from password_cracking_lab.api.session import router as pcl_session_router
from password_cracking_lab.api.overview import router as pcl_overview_router
from password_cracking_lab.api.difficulty import router as pcl_difficulty_router
from password_cracking_lab.api.analytics import router as pcl_analytics_router
from password_cracking_lab.api.leaderboard import router as pcl_leaderboard_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_auth_tables()
    create_attack_graph_tables()
    soc_models.Base.metadata.create_all(bind=engine)
    init_sqli_db()

    # Guided workflow
    guided_models.Base.metadata.create_all(bind=engine)
    seed_guided_workflow()

    # Safe column migration
    with engine.connect() as conn:
        conn.execute(
            sqlalchemy.text(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS "
                "has_consented BOOLEAN NOT NULL DEFAULT FALSE"
            )
        )
        conn.commit()

    # Load SMS spam model
    load_models()

    # ── Password Cracking Lab DB init ─────
    create_pcl_tables()

    yield


app = FastAPI(title="CyberCare API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "CyberCare API running"}

class PasswordRequest(BaseModel):
    password: str

@app.post("/analyze-password")
def analyze(req: PasswordRequest):
    return analyze_password(req.password)

# ── Non-tech ─────────────────────────────
app.include_router(breach_router,  prefix="/breach")
app.include_router(spam_router,    prefix="/spam")
app.include_router(sms_router,     tags=["SMS Spam Detection"])
app.include_router(quiz_router,    prefix="/quiz")
app.include_router(website_router, prefix="/website")

# ── Auth ─────────────────────────────────
app.include_router(auth_router)

# ── Tech ─────────────────────────────────
app.include_router(pentest_router)
app.include_router(verify_router)
app.include_router(attack_graph_router)

app.include_router(red_router,  prefix="/api/red",  tags=["Red Team"])
app.include_router(blue_router, prefix="/api/blue", tags=["Blue Team"])

app.include_router(sqli_router)

# ── Guided Workflow ───────────────────────
app.include_router(guided_workflow_router)

# ── Password Cracking Lab ─────────────────
app.include_router(pcl_lab_router,        prefix="/pcl")
app.include_router(pcl_terminal_router,   prefix="/pcl")
app.include_router(pcl_submission_router, prefix="/pcl")
app.include_router(pcl_session_router,    prefix="/pcl")
app.include_router(pcl_overview_router,   prefix="/pcl")
app.include_router(pcl_difficulty_router, prefix="/pcl")
app.include_router(pcl_analytics_router,  prefix="/pcl")
app.include_router(pcl_leaderboard_router,prefix="/pcl")
