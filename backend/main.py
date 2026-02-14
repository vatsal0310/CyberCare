from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib

from PasswordChecker.password_checker import analyze_password
from Penetration_testing.features_pentesting.router import router as pentest_router

app = FastAPI(title="CyberCare API")

# ✅ CORS configuration
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
# ---------------- Password Feature -------------------
# =====================================================

class PasswordRequest(BaseModel):
    password: str

@app.get("/")
def root():
    return {"status": "CyberCare API running"}

@app.post("/analyze-password")
def analyze(req: PasswordRequest):
    return analyze_password(req.password)

# =====================================================
# ------------- Penetration Testing -------------------
# =====================================================

app.include_router(
    pentest_router,
    prefix="/pentest",
    tags=["Penetration Testing"]
)
