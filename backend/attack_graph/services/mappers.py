from typing import List


# ─── STRIDE Mapping ───────────────────────────────────────────────────────────

STRIDE_MAP = {
    "internet":          ["Spoofing", "Denial of Service"],
    "web_server":        ["Tampering", "Denial of Service", "Information Disclosure"],
    "api_server":        ["Spoofing", "Tampering", "Information Disclosure"],
    "database":          ["Information Disclosure", "Tampering"],
    "firewall":          ["Denial of Service", "Elevation of Privilege"],
    "admin_workstation": ["Elevation of Privilege", "Repudiation"],
    "internal_network":  ["Lateral Movement", "Elevation of Privilege"],
    "load_balancer":     ["Denial of Service", "Spoofing"],
    "dns_server":        ["Spoofing", "Tampering"],
    "mail_server":       ["Spoofing", "Information Disclosure"],
    "vpn":               ["Spoofing", "Elevation of Privilege"],
    "cdn":               ["Tampering", "Denial of Service"],
    "cache":             ["Information Disclosure", "Tampering"],
}


# ─── MITRE ATT&CK Mapping ─────────────────────────────────────────────────────

MITRE_MAP = {
    "internet":          ["T1190 - Exploit Public Facing Application"],
    "web_server":        ["T1190 - Exploit Public Facing Application", "T1059 - Command & Scripting"],
    "api_server":        ["T1078 - Valid Accounts", "T1190 - Exploit Public Facing Application"],
    "database":          ["T1530 - Data from Cloud Storage", "T1005 - Data from Local System"],
    "firewall":          ["T1562 - Impair Defenses"],
    "admin_workstation": ["T1078 - Valid Accounts", "T1548 - Abuse Elevation Control"],
    "internal_network":  ["T1021 - Remote Services", "T1570 - Lateral Tool Transfer"],
    "load_balancer":     ["T1499 - Endpoint Denial of Service"],
    "dns_server":        ["T1071 - Application Layer Protocol", "T1568 - Dynamic Resolution"],
    "mail_server":       ["T1566 - Phishing", "T1114 - Email Collection"],
    "vpn":               ["T1133 - External Remote Services"],
    "cdn":               ["T1557 - Adversary in the Middle"],
    "cache":             ["T1212 - Exploitation for Credential Access"],
}


# ─── Mapper Functions ─────────────────────────────────────────────────────────

def get_stride_threats(asset_types: List[str]) -> List[str]:
    """Return unique STRIDE threats for a list of asset types in a path."""
    threats = set()
    for asset_type in asset_types:
        threats.update(STRIDE_MAP.get(asset_type.lower(), []))
    return list(threats)


def get_mitre_techniques(asset_types: List[str]) -> List[str]:
    """Return unique MITRE techniques for a list of asset types in a path."""
    techniques = set()
    for asset_type in asset_types:
        techniques.update(MITRE_MAP.get(asset_type.lower(), []))
    return list(techniques)