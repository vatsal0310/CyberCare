import pickle
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

model_path = BASE_DIR / "models" / "SVM_model.pkl"
vectorizer_path = BASE_DIR / "models" / "vectorizer.pkl"

model = pickle.load(open(model_path, "rb"))
vectorizer = pickle.load(open(vectorizer_path, "rb"))


def clean_email(text):

    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z ]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text


def predict_spam(email_text):

    cleaned = clean_email(email_text)

    features = vectorizer.transform([cleaned])

    prediction = model.predict(features)[0]

    if prediction == 0:
        return "Spam"
    else:
        return "Ham"