from fastapi import FastAPI
from pydantic import BaseModel
from password_checker import analyze_password
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CyberCare API")

origins = [
    "https://cyber-care-xi.vercel.app",   # <-- CHANGE to your real Vercel URL
    "http://localhost:5173",             # local React dev (important!)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PasswordRequest(BaseModel):
    password: str

@app.get("/")
def root():
    return {"status": "CyberCare API running"}

@app.post("/analyze-password")
def analyze(req: PasswordRequest):
    return analyze_password(req.password)
