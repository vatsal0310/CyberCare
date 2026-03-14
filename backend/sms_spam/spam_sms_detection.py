from fastapi import APIRouter
from pydantic import BaseModel
import pickle
import re
import string

sms_router = APIRouter()

# Load model
model = pickle.load(open("sms_spam/spam_model.pkl", "rb"))
vectorizer = pickle.load(open("sms_spam/vectorizer.pkl", "rb"))

THRESHOLD = 0.65


class SMSRequest(BaseModel):
    message: str


def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", " url ", text)
    text = re.sub(r'\d+', ' number ', text)
    text = re.sub(r'[₹$]', ' money ', text)
    text = text.replace("rs.", " money ")
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text


def predict_sms(text):

    cleaned = clean_text(text)

    text_vec = vectorizer.transform([cleaned])

    prob = model.predict_proba(text_vec)[0][1]

    if prob > THRESHOLD:
        label = "SPAM 🚨"
    else:
        label = "HAM ✅"

    return label, prob


@sms_router.post("/detect-sms-spam")
def detect_sms_spam(request: SMSRequest):

    label, probability = predict_sms(request.message)

    return {
        "message": request.message,
        "prediction": label,
        "spam_probability": round(probability, 4)
    }