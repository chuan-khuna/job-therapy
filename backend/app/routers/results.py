"""Result endpoints.

Placeholder router — data access (local SQLite) is not implemented yet.
"""

from fastapi import APIRouter, status
from pydantic import BaseModel

router = APIRouter(prefix="/results", tags=["results"])


class Result(BaseModel):
    id: str
    quiz_id: str
    answers: dict[str, object]
    matched_types: list[str]


class ResultCreate(BaseModel):
    quiz_id: str
    answers: dict[str, object]
    matched_types: list[str]


@router.get("", response_model=list[Result])
async def list_results() -> list[Result]:
    """Return logged results. Stub: no persistence yet."""
    return []


@router.post("", response_model=Result, status_code=status.HTTP_201_CREATED)
async def create_result(payload: ResultCreate) -> Result:
    """Persist a new result. Stub: echoes input with a placeholder id."""
    return Result(id="stub", **payload.model_dump())
