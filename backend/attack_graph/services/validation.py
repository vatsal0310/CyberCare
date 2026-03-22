import re
from fastapi import HTTPException


# ─── Blocked Patterns ─────────────────────────────────────────────────────────

IP_PATTERN = re.compile(r"^\d{1,3}(\.\d{1,3}){3}$")
DOMAIN_PATTERN = re.compile(r"([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}")
CIDR_PATTERN = re.compile(r"\d+\.\d+\.\d+\.\d+/\d+")

# Common real company names to block
BLOCKED_KEYWORDS = [
    "google", "amazon", "microsoft", "facebook", "apple",
    "aws", "azure", "cloudflare", "github", "netflix"
]

# Allowed abstract asset names
ALLOWED_ASSET_TYPES = [
    "internet", "firewall", "load_balancer", "web_server",
    "api_server", "database", "internal_network", "admin_workstation",
    "dns_server", "mail_server", "vpn", "cdn", "cache"
]


# ─── Core Validators ──────────────────────────────────────────────────────────

def validate_asset_name(name: str) -> None:
    """Block real IPs, domains, CIDRs and known company names."""

    name_lower = name.lower().strip()

    if IP_PATTERN.match(name_lower):
        raise HTTPException(
            status_code=400,
            detail="Real IP addresses are not allowed. Use abstract names like 'Web Server 1'."
        )

    if CIDR_PATTERN.search(name_lower):
        raise HTTPException(
            status_code=400,
            detail="Real network ranges are not allowed. Use abstract names."
        )

    if DOMAIN_PATTERN.search(name_lower):
        raise HTTPException(
            status_code=400,
            detail="Real domain names are not allowed. Use abstract names like 'API Server'."
        )

    for keyword in BLOCKED_KEYWORDS:
        if keyword in name_lower:
            raise HTTPException(
                status_code=400,
                detail=f"Real company identifiers are not allowed. Use abstract names."
            )


def validate_asset_type(asset_type: str) -> None:
    """Ensure asset type is from allowed list."""

    if asset_type.lower() not in ALLOWED_ASSET_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid asset type. Allowed types: {', '.join(ALLOWED_ASSET_TYPES)}"
        )


def validate_port(port: int) -> None:
    """Ensure port is in valid range."""

    if port and not (1 <= port <= 65535):
        raise HTTPException(
            status_code=400,
            detail="Port must be between 1 and 65535."
        )


def validate_scenario_name(name: str) -> None:
    """Block scenario names that suggest real company targeting."""

    name_lower = name.lower().strip()

    for keyword in BLOCKED_KEYWORDS:
        if keyword in name_lower:
            raise HTTPException(
                status_code=400,
                detail="Scenario name cannot reference real companies or organizations."
            )

    if len(name) > 100:
        raise HTTPException(
            status_code=400,
            detail="Scenario name must be under 100 characters."
        )


# ─── Combined Validator (call this in routes) ─────────────────────────────────

def validate_asset(name: str, asset_type: str, port: int = None) -> None:
    validate_asset_name(name)
    validate_asset_type(asset_type)
    if port:
        validate_port(port)