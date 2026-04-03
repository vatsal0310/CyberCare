from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from . import models
from .schemas import PathResponse
from auth.database import SessionLocal

router = APIRouter(prefix="/guided-workflow", tags=["Guided Workflow"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/paths", response_model=list[PathResponse])
def get_paths(db: Session = Depends(get_db)):
    paths = db.query(models.GuidedPath).all()
    result = []
    for path in paths:
        path_data = {
            "id": path.id,
            "title": path.title,
            "description": path.description,
            "difficulty": path.difficulty,
            "estimated_time": path.estimated_time,
            "modules": [],
        }
        for module in path.modules:
            module_data = {
                "id": module.id,
                "title": module.title,
                "order": module.order,
                "prerequisite_id": module.prerequisite_id,
                "tasks": [
                    {
                        "id": t.id,
                        "step_number": t.step_number,
                        "action_title": t.action_title,
                        "instruction_text": t.instruction_text,
                        "question": t.question,
                        "expected_flag": t.expected_flag,
                        "explanation_text": t.explanation_text or "",
                    }
                    for t in module.tasks
                ],
            }
            path_data["modules"].append(module_data)
        result.append(path_data)
    return result

