from fastapi import HTTPException
import re

BLOCKED_DOMAINS = ["google.com", "facebook.com", "instagram.com", "amazon.com"]

def validate_target(target: str):
    if any(b in target.lower() for b in BLOCKED_DOMAINS):
        raise HTTPException(status_code=403, detail="Target not allowed.")

    pattern = r"^https?://|^[\w\.-]+$|^\d{1,3}(\.\d{1,3}){3}$"
    if not re.match(pattern, target):
        raise HTTPException(status_code=400, detail="Invalid target format.")
