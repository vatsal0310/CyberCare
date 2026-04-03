from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class GuidedPath(Base):
    __tablename__ = "paths"

    id = Column(String, primary_key=True, index=True) # e.g., 'soc_path_01'
    title = Column(String, index=True)
    description = Column(Text)
    difficulty = Column(String)
    estimated_time = Column(String)

    modules = relationship("GuidedModule", back_populates="path", cascade="all, delete-orphan")

class GuidedModule(Base):
    __tablename__ = "modules"

    id = Column(String, primary_key=True, index=True) # e.g., 'mod_nids_01'
    path_id = Column(String, ForeignKey("paths.id"))
    order = Column(Integer) 
    title = Column(String)
    prerequisite_id = Column(String, nullable=True) 

    path = relationship("GuidedPath", back_populates="modules")
    tasks = relationship("GuidedTask", back_populates="module", cascade="all, delete-orphan")

class GuidedTask(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True) # e.g., 'task_nids_01_a'
    module_id = Column(String, ForeignKey("modules.id"))
    step_number = Column(Integer) 
    action_title = Column(String)
    instruction_text = Column(Text)
    question = Column(Text, nullable=True)
    expected_flag = Column(String, nullable=True)
    explanation_text = Column(Text) 

    module = relationship("GuidedModule", back_populates="tasks")