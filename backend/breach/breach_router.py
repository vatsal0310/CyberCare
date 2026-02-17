from fastapi import APIRouter
from pydantic import BaseModel

from breach.email_breach_checker import EmailBreachChecker
from breach.password_breach_checker import PasswordBreachChecker

router = APIRouter()

email_checker = EmailBreachChecker()
password_checker = PasswordBreachChecker()


# ================= EMAIL CHECK =================

class EmailRequest(BaseModel):
    email: str


@router.post("/check-email")
def check_email(req: EmailRequest):
    result = email_checker.check_email(req.email)
    return result


# ================= PASSWORD BREACH CHECK =================

class PasswordBreachRequest(BaseModel):
    password: str


@router.post("/check-password")
def check_password(req: PasswordBreachRequest):
    result = password_checker.check_password(req.password)
    return result
