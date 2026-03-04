from fastapi import APIRouter
from pydantic import BaseModel
from .spam_model import predict_spam

router = APIRouter()

class EmailRequest(BaseModel):
    email: str


@router.post("/check")
def check_spam(req: EmailRequest):

    result = predict_spam(req.email)

    return {
        "prediction": result
    }