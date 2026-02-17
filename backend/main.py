from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from PasswordChecker.password_checker import analyze_password
from Penetration_testing.features_pentesting.router import router as pentest_router
from breach.breach_router import router as breach_router   # ← ADD THIS

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
# PENETRATION TESTING
# =====================================================

app.include_router(
    pentest_router,
    prefix="/pentest",
    tags=["Penetration Testing"]
)

# =====================================================
# DATA BREACH CHECKER (NEW FEATURE)
# =====================================================

app.include_router(
    breach_router,
    prefix="/breach",
    tags=["Data Breach Checker"]
)
