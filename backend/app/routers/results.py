"""Result endpoints — log and read quiz results.

Persistence is SQLModel over the local SQLite database (see ``app.db``).
"""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from sqlmodel import Session, select

from app.db import get_session
from app.models import Result

router = APIRouter(prefix="/results", tags=["results"])


class ResultCreate(BaseModel):
    """Request body for logging a result."""

    quiz_id: str
    answers: dict[str, object]
    matched_types: list[str]


class ResultRead(BaseModel):
    """Response shape for a logged result."""

    id: UUID
    quiz_id: str
    answers: dict[str, object]
    matched_types: list[str]
    created_at: datetime


@router.get("", response_model=list[ResultRead])
def list_results(session: Session = Depends(get_session)) -> list[Result]:
    """Return logged results, oldest first."""
    return list(session.exec(select(Result).order_by(Result.created_at)).all())


@router.post("", response_model=ResultRead, status_code=status.HTTP_201_CREATED)
def create_result(payload: ResultCreate, session: Session = Depends(get_session)) -> Result:
    """Persist a new result. The id is a server-generated UUIDv7."""
    result = Result(**payload.model_dump())
    session.add(result)
    session.commit()
    session.refresh(result)
    return result
