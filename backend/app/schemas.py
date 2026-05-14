from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field

TaskStatusType = Literal["todo", "in_progress", "done"]


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    status: TaskStatusType = "todo"
    due_at: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatusType] = None
    due_at: Optional[datetime] = None


class TaskListItem(BaseModel):
    id: int
    title: str
    status: str
    due_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TaskDetail(TaskListItem):
    description: Optional[str]
