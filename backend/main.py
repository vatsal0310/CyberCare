from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from Fake_website.fake_website import router as website_router
from PasswordChecker.password_checker import analyze_password
from breach.breach_router import router as breach_router
from Spam_detection.spam_router import router as spam_router
from quiz.quiz_api import router as quiz_router
from fastapi import FastAPI
from sms_spam.spam_sms_detection import sms_router
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="CyberCare API")

# ================= CORS =================

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():
    return {"status": "CyberCare API running"}

# =====================================================
# PASSWORD STRENGTH ANALYSIS (AI MODEL)
# =====================================================

class PasswordRequest(BaseModel):
    password: str

@app.post("/analyze-password")
def analyze(req: PasswordRequest):
    return analyze_password(req.password)

# =====================================================
# DATA BREACH CHECKER (NEW FEATURE)
# =====================================================

app.include_router(
    breach_router,
    prefix="/breach",
    tags=["Data Breach Checker"]
)

# =====================================================
# SPAM EMAIL & SMS DETECTION
# =====================================================

app.include_router(
    spam_router,
    prefix="/spam",
    tags=["Spam Detection"]
)

app.include_router(
    sms_router,
    prefix="/sms_spam",
    tags=["SMS Spam Detection"]
)

# =====================================================
# AI CYBER QUIZ GENERATOR
# =====================================================

app.include_router(
    quiz_router,
    prefix="/quiz",
    tags=["Cyber Security Quiz"]
)


app.include_router(
    website_router, 
    prefix="/website",
    tags=["Fake Website Detector"]
)