"""Reflection index endpoint.

Lists the available reflections. Each reflection's full definition is served by its own
module (``stereotype_reflection``, ``tessa_daily_stress_reflection``); this router just
exposes the catalog of ``{id, title}`` summaries.
"""

from pydantic import BaseModel
from fastapi import APIRouter

from app.routers import stereotype_reflection, tessa_daily_stress_reflection

router = APIRouter(prefix="/reflections", tags=["reflections"])


class ReflectionSummary(BaseModel):
    """A reflection as it appears in the catalog."""

    id: str
    title: str


SUMMARIES: list[ReflectionSummary] = [
    ReflectionSummary(
        id=stereotype_reflection.REFLECTION_ID,
        title=stereotype_reflection.REFLECTION_TITLE,
    ),
    ReflectionSummary(
        id=tessa_daily_stress_reflection.REFLECTION_ID,
        title=tessa_daily_stress_reflection.REFLECTION_TITLE,
    ),
]


@router.get("", response_model=list[ReflectionSummary])
async def list_reflections() -> list[ReflectionSummary]:
    """Return all available reflections."""
    return SUMMARIES
