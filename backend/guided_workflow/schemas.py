from pydantic import BaseModel
from typing import List, Optional

class TaskResponse(BaseModel):
    id: str
    step_number: int
    action_title: str
    instruction_text: str
    question: Optional[str] = None
    expected_flag: Optional[str] = None
    explanation_text: str

    class Config:
        from_attributes = True

class ModuleResponse(BaseModel):
    id: str
    order: int
    title: str
    prerequisite_id: Optional[str] = None
    tasks: List[TaskResponse] = []

    class Config:
        from_attributes = True

class PathResponse(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    estimated_time: str
    modules: List[ModuleResponse] = []

    class Config:
        from_attributes = True