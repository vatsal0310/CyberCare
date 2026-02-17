import requests
import re
from typing import Dict, List


class EmailBreachChecker:
    """
    Checks whether an email appears in known data breaches
    Uses XposedOrNot API (FREE)
    """

    def __init__(self):
        self.base_url = "https://api.xposedornot.com/v1"
        self.headers = {
            "User-Agent": "CyberCare-SecurityTool/1.0",
            "Accept": "application/json"
        }

    def _is_valid_email(self, email: str) -> bool:
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None

    def check_email(self, email: str) -> Dict:

        if not self._is_valid_email(email):
            return {
                "status": "error",
                "message": "Invalid email format",
                "breaches_found": 0,
                "breaches": []
            }

        try:
            url = f"{self.base_url}/check-email/{email}"
            response = requests.get(url, headers=self.headers, timeout=10)

            # SAFE (not found)
            if response.status_code == 404:
                return {
                    "status": "safe",
                    "message": f"No breaches found for {email}",
                    "breaches_found": 0,
                    "breaches": [],
                    "recommendations": [
                        "Keep using strong passwords",
                        "Enable 2FA",
                        "Monitor accounts regularly"
                    ]
                }

            # BREACHED
            elif response.status_code == 200:
                data = response.json()
                breach_names = data.get("breaches", [[]])[0]

                breaches = []
                for b in breach_names:
                    breaches.append({
                        "name": b,
                        "description": f"Found in {b} breach"
                    })

                return {
                    "status": "breached",
                    "message": f"{len(breaches)} breach(es) found",
                    "breaches_found": len(breaches),
                    "breaches": breaches
                }

            elif response.status_code == 429:
                return {
                    "status": "error",
                    "message": "Rate limit exceeded. Try later."
                }

            else:
                return {
                    "status": "error",
                    "message": f"Service error: {response.status_code}"
                }

        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": f"Network error: {str(e)}"
            }
