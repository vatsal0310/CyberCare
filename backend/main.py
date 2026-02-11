from fastapi import FastAPI
from pydantic import BaseModel
from password_checker import analyze_password
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CyberCare API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PasswordRequest(BaseModel):
    password: str

@app.post("/analyze-password")
def analyze(req: PasswordRequest):
    return analyze_password(req.password)
