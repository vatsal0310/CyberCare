from typing import List


# ─── Scoring Weights ──────────────────────────────────────────────────────────

SENSITIVITY_SCORE = {"low": 1, "medium": 3, "high": 7, "critical": 10}
EXPOSURE_SCORE    = {"restricted": 1, "internal": 3, "public": 8}

SEVERITY_THRESHOLDS = [
    (7.5, "critical"),
    (5.0, "high"),
    (2.5, "medium"),
    (0.0, "low"),
]


# ─── Per Asset Risk ───────────────────────────────────────────────────────────

def score_asset(asset) -> float:
    """Calculate risk score for a single asset (0-10)."""
    likelihood = EXPOSURE_SCORE.get(asset.exposure, 3)

    if not asset.auth_required:
        likelihood += 2
    if not asset.encrypted:
        likelihood += 1

    impact = SENSITIVITY_SCORE.get(asset.sensitivity, 3)

    raw = (likelihood * impact) / 10
    return round(min(raw, 10.0), 2)


# ─── Per Path Risk ────────────────────────────────────────────────────────────

def score_path(path_asset_ids: List[str], assets: list) -> float:
    """Calculate overall risk score for an attack path (0-10)."""
    asset_map = {str(a.id): a for a in assets}

    scores = [
        score_asset(asset_map[aid])
        for aid in path_asset_ids
        if aid in asset_map
    ]

    if not scores:
        return 0.0

    # Weighted: highest node risk matters most
    return round((sum(scores) / len(scores) + max(scores)) / 2, 2)


# ─── Severity Label ───────────────────────────────────────────────────────────

def get_severity(score: float) -> str:
    for threshold, label in SEVERITY_THRESHOLDS:
        if score >= threshold:
            return label
    return "low"