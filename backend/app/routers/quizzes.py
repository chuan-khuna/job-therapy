"""Quiz endpoints.

Placeholder router — data access (local SQLite) is not implemented yet.
"""

from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


class Quiz(BaseModel):
    id: str
    title: str


@router.get("", response_model=list[Quiz])
async def list_quizzes() -> list[Quiz]:
    """Return all available quizzes. Stub: no quizzes yet."""
    return []
