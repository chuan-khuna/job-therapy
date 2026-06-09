"""Result endpoints — log and read reflection results.

Persistence is SQLModel over the local SQLite database (see ``app.db``).
"""

from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, field_serializer
from sqlmodel import Session, select

from app.db import get_session
from app.models import Result

router = APIRouter(prefix="/results", tags=["results"])


class ResultCreate(BaseModel):
    """Request body for logging a result."""

    reflection_id: str
    date: str
    answers: dict[str, object]
    matched_types: list[str]


class ResultUpdate(BaseModel):
    """Request body for editing a logged result's answers."""

    answers: dict[str, object]


class ResultRead(BaseModel):
    """Response shape for a logged result."""

    id: UUID
    reflection_id: str
    date: str
    answers: dict[str, object]
    matched_types: list[str]
    created_at: datetime
    updated_at: datetime

    @field_serializer("created_at", "updated_at")
    def _serialize_utc(self, value: datetime) -> str:
        # SQLite stores datetimes naively; our writes are UTC. Emit an explicit
        # UTC ISO 8601 string ("…Z") so clients don't misread it as local time.
        if value.tzinfo is None:
            value = value.replace(tzinfo=UTC)
        return value.astimezone(UTC).isoformat().replace("+00:00", "Z")


@router.get("", response_model=list[ResultRead])
def list_results(
    session: Session = Depends(get_session),
    reflection_id: str | None = Query(default=None, description="Filter to one reflection."),
    limit: int | None = Query(default=None, ge=1, description="Cap the row count."),
) -> list[Result]:
    """Return logged results, newest first. Optionally filter by reflection and cap the count."""
    statement = select(Result).order_by(Result.created_at.desc())  # type: ignore[attr-defined]
    if reflection_id is not None:
        statement = statement.where(Result.reflection_id == reflection_id)
    if limit is not None:
        statement = statement.limit(limit)
    return list(session.exec(statement).all())


@router.post("", response_model=ResultRead, status_code=status.HTTP_201_CREATED)
def create_result(payload: ResultCreate, session: Session = Depends(get_session)) -> Result:
    """Persist a new result. The id is a server-generated UUIDv7."""
    result = Result(**payload.model_dump())
    session.add(result)
    session.commit()
    session.refresh(result)
    return result


@router.patch("/{result_id}", response_model=ResultRead)
def update_result(result_id: UUID, payload: ResultUpdate, session: Session = Depends(get_session)) -> Result:
    """Replace a result's answers. 404 if it does not exist."""
    result = session.get(Result, result_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
    result.answers = payload.answers
    result.updated_at = datetime.now(UTC)
    session.add(result)
    session.commit()
    session.refresh(result)
    return result


@router.delete("/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_result(result_id: UUID, session: Session = Depends(get_session)) -> None:
    """Delete a result. 404 if it does not exist."""
    result = session.get(Result, result_id)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
    session.delete(result)
    session.commit()
