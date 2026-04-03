from fastapi import APIRouter, HTTPException
from contextlib import asynccontextmanager
from pydantic import BaseModel
import pickle
import re
import string
import os

sms_router = APIRouter()

# ── Model references (loaded lazily at startup, not at import time) ─────────
_model = None
_vectorizer = None

THRESHOLD = 0.65

# ── Resolve paths relative to THIS file, not the working directory ──────────
# This means it works no matter where uvicorn is launched from.
_BASE = os.path.dirname(os.path.abspath(__file__))
_MODEL_PATH = os.path.join(_BASE, "spam_model.pkl")
_VEC_PATH   = os.path.join(_BASE, "vectorizer.pkl")


def load_models():
    """
    Call this once at startup (from main.py lifespan).
    Raises a clear RuntimeError if files are missing, so the server
    fails fast with a useful message instead of silently 404-ing.
    """
    global _model, _vectorizer
    try:
        _model      = pickle.load(open(_MODEL_PATH, "rb"))
        _vectorizer = pickle.load(open(_VEC_PATH,   "rb"))
        print(f"✅ SMS spam model loaded  → {_MODEL_PATH}")
        print(f"✅ SMS vectorizer loaded  → {_VEC_PATH}")
    except FileNotFoundError as e:
        raise RuntimeError(
            f"\n❌ SMS spam model file not found: {e}"
            f"\n   Expected model at   : {_MODEL_PATH}"
            f"\n   Expected vectorizer : {_VEC_PATH}"
            f"\n   Make sure spam_model.pkl and vectorizer.pkl"
            f"\n   are inside the same folder as spam_sms_detection.py"
        )


# ── Schema ────────────────────────────────────────────────────────────────────
class SMSRequest(BaseModel):
    message: str

class SMSResponse(BaseModel):
    message: str
    prediction: str
    spam_probability: float
    confidence_label: str     # LOW | MEDIUM | HIGH


# ── Helpers ───────────────────────────────────────────────────────────────────
def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", " url ", text)
    text = re.sub(r"\d+", " number ", text)
    text = re.sub(r"[₹$]", " money ", text)
    text = text.replace("rs.", " money ")
    text = text.translate(str.maketrans("", "", string.punctuation))
    return text


def get_confidence_label(prob: float) -> str:
    if prob >= 0.85:
        return "HIGH"
    elif prob >= 0.65:
        return "MEDIUM"
    else:
        return "LOW"


def predict_sms(text: str):
    cleaned = clean_text(text)
    vec_msg = _vectorizer.transform([cleaned])
    prob    = float(_model.predict_proba(vec_msg)[0][1])
    label   = "SPAM 🚨" if prob > THRESHOLD else "HAM ✅"
    return label, round(prob, 4)


# ── Route ─────────────────────────────────────────────────────────────────────
@sms_router.post("/detect-sms-spam", response_model=SMSResponse)
def detect_sms_spam(request: SMSRequest):
    if _model is None or _vectorizer is None:
        raise HTTPException(
            status_code=503,
            detail="SMS spam model is not loaded. Check server startup logs."
        )
    label, probability = predict_sms(request.message)
    return SMSResponse(
        message          = request.message,
        prediction       = label,
        spam_probability = probability,
        confidence_label = get_confidence_label(probability),
    )