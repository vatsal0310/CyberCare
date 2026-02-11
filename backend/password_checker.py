import re

def analyze_password(password: str):
    score = 0
    feedback = []

    length = len(password)

    # Length scoring
    if length >= 16:
        score += 35
    elif length >= 12:
        score += 25
    elif length >= 8:
        score += 15
    else:
        feedback.append("Password should be at least 8 characters")

    # Character checks
    has_upper = bool(re.search(r"[A-Z]", password))
    has_lower = bool(re.search(r"[a-z]", password))
    has_digit = bool(re.search(r"\d", password))
    has_special = bool(re.search(r"[!@#$%^&*(),.?\":{}|<>]", password))

    if has_upper:
        score += 15
    else:
        feedback.append("Add an uppercase letter")

    if has_lower:
        score += 15
    else:
        feedback.append("Add a lowercase letter")

    if has_digit:
        score += 15
    else:
        feedback.append("Add a number")

    if has_special:
        score += 20
    else:
        feedback.append("Add a special character")

    # Variety bonus
    variety = sum([has_upper, has_lower, has_digit, has_special])
    if variety >= 3:
        score += 10

    # Cap at 100
    score = min(score, 100)

    # Strength mapping
    if score < 30:
        strength = "Very Weak"
    elif score < 50:
        strength = "Weak"
    elif score < 70:
        strength = "Medium"
    elif score < 85:
        strength = "Strong"
    else:
        strength = "Very Strong"

    return {
        "score": score,
        "strength": strength,
        "feedback": feedback
    }
