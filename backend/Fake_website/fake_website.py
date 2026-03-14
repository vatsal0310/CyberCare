import os
import re
import math
import socket
import requests
from collections import Counter
from urllib.parse import urlparse
from datetime import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# ── API Key ────────────────────────────────────────────────────────────────
# Move your key to .env as:  GOOGLE_SAFE_BROWSING_KEY=AIzaSy...
GOOGLE_API_KEY = os.getenv("GOOGLE_SAFE_BROWSING_KEY", "")


# ── Request model ──────────────────────────────────────────────────────────
class URLRequest(BaseModel):
    url: str


# ══════════════════════════════════════════════════════════════════════════
#  FEATURE FUNCTIONS
# ══════════════════════════════════════════════════════════════════════════

# ── 1. URL Entropy ─────────────────────────────────────────────────────────
def url_entropy(url: str) -> float:
    """High entropy (>4.5) often means randomly generated / obfuscated URLs."""
    prob = [n / len(url) for n in Counter(url).values()]
    return round(-sum(p * math.log2(p) for p in prob), 3)


# ── 2. Brand impersonation ────────────────────────────────────────────────
BRANDS = [
    "paypal", "amazon", "google", "facebook", "apple", "microsoft",
    "netflix", "instagram", "twitter", "whatsapp", "hdfc", "sbi",
    "icici", "bank", "verify", "secure", "login", "signin", "account",
]

def brand_in_url(url: str) -> dict:
    """
    Returns which brand is being impersonated (if any) AND whether
    it looks like the actual brand domain or a fake copy.
    e.g.  paypal-secure-login.com  → impersonation
          paypal.com               → likely real
    """
    url_lower = url.lower()
    parsed = urlparse(url_lower if url_lower.startswith("http") else "http://" + url_lower)
    domain = parsed.netloc  # e.g. paypal-secure.xyz

    found_brands = [b for b in BRANDS if b in url_lower]
    if not found_brands:
        return {"detected": False, "brand": None, "is_impersonation": False}

    brand = found_brands[0]

    # If the brand is the root domain (paypal.com, google.com) → probably real
    # If brand appears in a subdomain or path → likely fake
    root = domain.replace("www.", "")
    is_real_domain = root.startswith(brand + ".") or root == brand
    is_impersonation = not is_real_domain

    return {
        "detected": True,
        "brand": brand,
        "is_impersonation": is_impersonation,
    }


# ── 3. Suspicious TLD ─────────────────────────────────────────────────────
SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".gq", ".tk", ".ml", ".cf", ".ga", ".pw",
    ".click", ".download", ".zip", ".review", ".country", ".kim",
    ".science", ".work", ".party", ".loan", ".win", ".date",
]

def suspicious_tld(url: str) -> dict:
    parsed = urlparse(url if url.startswith("http") else "http://" + url)
    domain = parsed.netloc.lower()
    for tld in SUSPICIOUS_TLDS:
        if domain.endswith(tld):
            return {"suspicious": True, "tld": tld}
    return {"suspicious": False, "tld": None}


# ── 4. URL length & structure ─────────────────────────────────────────────
def url_structure(url: str) -> dict:
    parsed = urlparse(url if url.startswith("http") else "http://" + url)
    domain = parsed.netloc

    # Count hyphens in domain (paypal-login-secure.com → suspicious)
    hyphen_count = domain.count("-")

    # Count subdomains  (login.verify.paypal.attacker.com → suspicious)
    subdomain_count = max(0, len(domain.split(".")) - 2)

    # Count digits in domain
    digit_count = sum(c.isdigit() for c in domain)

    # Count @ symbol (used in tricks like https://google.com@evil.com)
    has_at = "@" in url

    # IP address instead of domain name
    ip_pattern = re.compile(r"^\d{1,3}(\.\d{1,3}){3}$")
    is_ip = bool(ip_pattern.match(domain.split(":")[0]))

    return {
        "length": len(url),
        "hyphen_count": hyphen_count,
        "subdomain_count": subdomain_count,
        "digit_count": digit_count,
        "has_at_symbol": has_at,
        "is_ip_address": is_ip,
    }


# ── 5. HTTPS check ────────────────────────────────────────────────────────
def https_check(url: str) -> dict:
    uses_https = url.lower().startswith("https://")
    return {"uses_https": uses_https}


# ── 6. Suspicious keywords in URL ─────────────────────────────────────────
PHISHING_KEYWORDS = [
    "login", "signin", "verify", "update", "secure", "account",
    "banking", "confirm", "password", "credential", "authenticate",
    "free", "lucky", "winner", "prize", "urgent", "suspended",
    "limited", "click-here", "act-now", "offer",
]

def suspicious_keywords(url: str) -> dict:
    url_lower = url.lower()
    found = [kw for kw in PHISHING_KEYWORDS if kw in url_lower]
    return {"found": found, "count": len(found)}


# ── 7. Domain resolves? ───────────────────────────────────────────────────
def domain_resolves(url: str) -> bool:
    """Check if the domain actually resolves to an IP (basic liveness check)."""
    try:
        parsed = urlparse(url if url.startswith("http") else "http://" + url)
        socket.gethostbyname(parsed.netloc.split(":")[0])
        return True
    except Exception:
        return False


# ── 8. Google Safe Browsing ───────────────────────────────────────────────
def google_safe_check(url: str) -> dict:
    if not GOOGLE_API_KEY:
        return {"checked": False, "threat": None, "reason": "API key not configured"}

    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GOOGLE_API_KEY}"
    payload = {
        "client": {"clientId": "cybercare-detector", "clientVersion": "2.0"},
        "threatInfo": {
            "threatTypes": [
                "MALWARE",
                "SOCIAL_ENGINEERING",
                "UNWANTED_SOFTWARE",
                "POTENTIALLY_HARMFUL_APPLICATION",  # added
            ],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}],
        },
    }
    try:
        resp = requests.post(endpoint, json=payload, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if "matches" in data:
            return {
                "checked": True,
                "threat": data["matches"][0]["threatType"],
                "platform": data["matches"][0].get("platformType", "ANY_PLATFORM"),
            }
        return {"checked": True, "threat": None}
    except requests.exceptions.Timeout:
        return {"checked": False, "threat": None, "reason": "Google API timeout"}
    except Exception as e:
        return {"checked": False, "threat": None, "reason": str(e)}


# ══════════════════════════════════════════════════════════════════════════
#  RISK SCORE ENGINE
# ══════════════════════════════════════════════════════════════════════════

def calculate_risk_score(features: dict) -> dict:
    """
    Returns a 0–100 risk score and a verdict label.
    Each red flag adds weighted points.
    """
    score = 0
    flags = []

    gsb = features["google_safe_browsing"]
    structure = features["url_structure"]
    brand = features["brand_impersonation"]
    tld = features["suspicious_tld"]
    kw = features["suspicious_keywords"]
    entropy = features["entropy"]
    https = features["https"]

    # Google Safe Browsing — highest weight
    if gsb.get("threat"):
        score += 60
        flags.append(f"Flagged by Google Safe Browsing as {gsb['threat']}")

    # Brand impersonation
    if brand["is_impersonation"]:
        score += 25
        flags.append(f"Impersonating '{brand['brand']}' brand")

    # Suspicious TLD
    if tld["suspicious"]:
        score += 15
        flags.append(f"Uses suspicious domain ending '{tld['tld']}'")

    # No HTTPS
    if not https["uses_https"]:
        score += 10
        flags.append("Does not use HTTPS (no padlock)")

    # IP address as domain
    if structure["is_ip_address"]:
        score += 20
        flags.append("Uses raw IP address instead of a real domain name")

    # @ symbol trick
    if structure["has_at_symbol"]:
        score += 20
        flags.append("URL contains @ symbol — a common trick to disguise the real destination")

    # Too many hyphens
    if structure["hyphen_count"] >= 3:
        score += 10
        flags.append(f"Domain has {structure['hyphen_count']} hyphens — often seen in fake sites")
    elif structure["hyphen_count"] >= 2:
        score += 5

    # Too many subdomains
    if structure["subdomain_count"] >= 3:
        score += 10
        flags.append(f"Too many subdomains ({structure['subdomain_count']}) — a common phishing trick")

    # Very long URL
    if structure["length"] > 100:
        score += 8
        flags.append(f"Unusually long URL ({structure['length']} characters)")
    elif structure["length"] > 75:
        score += 4

    # High entropy
    if entropy > 4.8:
        score += 8
        flags.append(f"URL looks randomly generated (entropy: {entropy})")
    elif entropy > 4.5:
        score += 4

    # Suspicious keywords
    if kw["count"] >= 3:
        score += 10
        flags.append(f"Contains {kw['count']} suspicious words: {', '.join(kw['found'][:3])}")
    elif kw["count"] >= 1:
        score += 5

    # Many digits in domain
    if structure["digit_count"] >= 5:
        score += 5
        flags.append(f"Domain contains {structure['digit_count']} digits — unusual for real sites")

    score = min(score, 100)

    if score >= 70:
        verdict = "DANGEROUS"
        color = "red"
    elif score >= 40:
        verdict = "SUSPICIOUS"
        color = "orange"
    elif score >= 15:
        verdict = "CAUTION"
        color = "yellow"
    else:
        verdict = "LIKELY SAFE"
        color = "green"

    return {
        "score": score,
        "verdict": verdict,
        "color": color,
        "flags": flags,
    }


# ══════════════════════════════════════════════════════════════════════════
#  ROUTE
# ══════════════════════════════════════════════════════════════════════════

@router.post("/check")
def check_url(body: URLRequest):
    url = body.url.strip()

    if not url:
        raise HTTPException(status_code=400, detail="URL cannot be empty")

    # Normalise — add https:// if missing so urlparse works correctly
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    # Run all feature checks
    features = {
        "entropy":               url_entropy(url),
        "brand_impersonation":   brand_in_url(url),
        "suspicious_tld":        suspicious_tld(url),
        "url_structure":         url_structure(url),
        "https":                 https_check(url),
        "suspicious_keywords":   suspicious_keywords(url),
        "domain_resolves":       domain_resolves(url),
        "google_safe_browsing":  google_safe_check(url),
    }

    risk = calculate_risk_score(features)

    return {
        "url":      url,
        "features": features,
        "risk":     risk,
        "scanned_at": datetime.utcnow().isoformat() + "Z",
    }
