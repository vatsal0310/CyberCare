"""
retrain_model.py
────────────────
Retrains the SMS spam detection model from spam.csv
and saves spam_model.pkl + vectorizer.pkl into the sms_spam/ folder.

Usage:
    python retrain_model.py
"""

import os
import re
import string
import pickle
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report
import numpy as np

# ── Config ───────────────────────────────────────────────────────────────────
CSV_PATH   = "spam.csv"          # path to your CSV file
OUTPUT_DIR = "."          # where to save the model files
os.makedirs(OUTPUT_DIR, exist_ok=True)


# ── Text cleaning (same as used in main.py) ───────────────────────────────────
def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", " url ", text)
    text = re.sub(r"\d+", " number ", text)
    text = re.sub(r"[₹$]", " money ", text)
    text = text.replace("rs.", " money ")
    text = text.translate(str.maketrans("", "", string.punctuation))
    return text


# ── Load & prepare data ───────────────────────────────────────────────────────
print("📂 Loading data...")
df = pd.read_csv(CSV_PATH).dropna(subset=["Msg", "Label"])
df["cleaned"] = df["Msg"].apply(clean_text)
df["label"]   = (df["Label"].str.strip().str.lower() == "spam").astype(int)

print(f"   Total samples : {len(df)}")
print(f"   SPAM          : {df['label'].sum()}")
print(f"   HAM           : {(df['label'] == 0).sum()}")


# ── Vectorize ─────────────────────────────────────────────────────────────────
print("\n🔤 Vectorizing...")
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),    # unigrams + bigrams
    sublinear_tf=True,     # log-scale TF
)
X = vectorizer.fit_transform(df["cleaned"])
y = df["label"]


# ── Train ─────────────────────────────────────────────────────────────────────
print("\n🏋️  Training model...")
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced",   # handles class imbalance gracefully
)

# Cross-validation before final fit
print("\n📊 Cross-validation (5-fold):")
for metric in ["accuracy", "f1", "precision", "recall"]:
    scores = cross_val_score(model, X, y, cv=5, scoring=metric)
    print(f"   {metric:10s}: {np.mean(scores):.4f} ± {np.std(scores):.4f}")

# Final fit on full data
model.fit(X, y)

# Train/test split report
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)
model_eval = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1, class_weight="balanced")
model_eval.fit(X_tr, y_tr)
print("\n📋 Classification Report (20% held-out test set):")
print(classification_report(y_te, model_eval.predict(X_te), target_names=["HAM", "SPAM"]))


# ── Save ──────────────────────────────────────────────────────────────────────
model_out = os.path.join(OUTPUT_DIR, "spam_model.pkl")
vec_out   = os.path.join(OUTPUT_DIR, "vectorizer.pkl")

pickle.dump(model,      open(model_out, "wb"))
pickle.dump(vectorizer, open(vec_out,   "wb"))

print(f"✅ Model saved     → {model_out}")
print(f"✅ Vectorizer saved → {vec_out}")
print("\n🎉 Done! You can now start your API with:")
print("   uvicorn main:app --reload --port 8000")