import requests
import hashlib
from typing import Dict


class PasswordBreachChecker:
    """
    Checks if a password appeared in breaches
    Uses HaveIBeenPwned Password API (k-anonymity)
    """

    def __init__(self):
        self.headers = {"User-Agent": "CyberCare-SecurityTool/1.0"}

    def check_password(self, password: str) -> Dict:

        if not password:
            return {
                "status": "error",
                "message": "Password cannot be empty"
            }

        try:
            # SHA1 hash
            sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
            prefix = sha1_hash[:5]
            suffix = sha1_hash[5:]

            url = f"https://api.pwnedpasswords.com/range/{prefix}"
            response = requests.get(url, headers=self.headers, timeout=10)

            if response.status_code != 200:
                return {"status": "error", "message": "API unavailable"}

            hashes = response.text.splitlines()
            exposed_count = 0

            for line in hashes:
                hash_suffix, count = line.split(":")
                if hash_suffix == suffix:
                    exposed_count = int(count)
                    break

            if exposed_count > 0:
                return {
                    "status": "exposed",
                    "message": f"Password found {exposed_count:,} times in breaches!",
                    "risk": "HIGH"
                }
            else:
                return {
                    "status": "safe",
                    "message": "Password not found in known breaches",
                    "risk": "LOW"
                }

        except requests.exceptions.RequestException as e:
            return {"status": "error", "message": str(e)}
