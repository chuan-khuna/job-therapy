"""Quiz index endpoint.

Lists the available quizzes. Each quiz's full definition is served by its own
module (``stereotype_quiz``, ``tessa_daily_stress_quiz``); this router just
exposes the catalog of ``{id, title}`` summaries.
"""

from pydantic import BaseModel
from fastapi import APIRouter

from app.routers import stereotype_quiz, tessa_daily_stress_quiz

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


class QuizSummary(BaseModel):
    """A quiz as it appears in the catalog."""

    id: str
    title: str


SUMMARIES: list[QuizSummary] = [
    QuizSummary(id=stereotype_quiz.QUIZ_ID, title=stereotype_quiz.QUIZ_TITLE),
    QuizSummary(
        id=tessa_daily_stress_quiz.QUIZ_ID, title=tessa_daily_stress_quiz.QUIZ_TITLE
    ),
]


@router.get("", response_model=list[QuizSummary])
async def list_quizzes() -> list[QuizSummary]:
    """Return all available quizzes."""
    return SUMMARIES
