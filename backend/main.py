from fastapi import FastAPI
from pydantic import BaseModel
from PasswordChecker.password_checker import analyze_password
from fastapi.middleware.cors import CORSMiddleware

# ✅ Import penetration testing router
from Penetration_testing.features_pentesting.router import router as pentest_router

app = FastAPI(title="CyberCare API")

# ✅ CORS configuration (Production + Local)
origins = [
    "https://cyber-care-xi.vercel.app",  # Your deployed frontend
    "http://localhost:5173",            # Local React dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Existing Password Feature
# -----------------------------

class PasswordRequest(BaseModel):
    password: str

@app.get("/")
def root():
    return {"status": "CyberCare API running"}

@app.post("/analyze-password")
def analyze(req: PasswordRequest):
    return analyze_password(req.password)

# ✅ Include Pentesting Router
app.include_router(pentest_router, prefix="/pentest", tags=["Penetration Testing"])
