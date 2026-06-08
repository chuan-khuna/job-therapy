"""Daily stress quiz — "บททดสอบความเครียดประจำวัน".

Serves the full quiz definition (the structured fields plus their option
catalogs) so the frontend renders the form from a backend-owned source of
truth. A "result" is the set of nine answered fields; counting/validation
of how many are filled stays in the client.
"""

from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter(prefix="/quizzes/daily-stress", tags=["quizzes"])

QUIZ_ID = "quiz-002-daily-stress-test"
QUIZ_TITLE = "บททดสอบความเครียดประจำวัน"

LOCATIONS: list[str] = [
    "บ้าน",
    "ที่ทำงาน",
    "ระหว่างที่พักผ่อน/สนุกสนาน",
    "ทำธุระ",
    "ระหว่างเดินทาง",
    "อื่นๆ",
]

COMPANIONS: list[str] = [
    "คนเดียว",
    "คนแปลกหน้า",
    "เพื่อนร่วมงาน",
    "เพื่อน",
    "ลูกๆ",
    "คนรัก",
    "สมาชิกในครอบครัวคนอื่นๆ",
    "สัตว์เลี้ยง",
]

FREQUENCIES: list[str] = [
    "เกิดขึ้นครั้งแรก",
    "เกิดขึ้นแล้วหนึ่งครั้ง",
    "เกิดขึ้นมาก่อนหน้านี้สองสามครั้ง",
    "เกิดขึ้นเป็นประจำ",
    "เกิดขึ้นตลอดเวลา",
]

# 5-point bipolar Likert: negative -> positive.
FEELINGS: list[str] = [
    "เป็นลบมาก",
    "ค่อนข้างลบ",
    "กลางๆ",
    "ค่อนข้างบวก",
    "เป็นบวกมาก",
]

# Morning feeling allows an extra "it didn't happen" option.
MORNING_FEELINGS: list[str] = [*FEELINGS, "มันไม่เกิดขึ้น"]

# Number of fields the form collects (for progress / save gating on the client).
FIELD_COUNT = 9


class DailyStressQuiz(BaseModel):
    """Full definition for the daily stress quiz."""

    id: str
    title: str
    locations: list[str]
    companions: list[str]
    frequencies: list[str]
    feelings: list[str]
    morning_feelings: list[str]
    field_count: int


DEFINITION = DailyStressQuiz(
    id=QUIZ_ID,
    title=QUIZ_TITLE,
    locations=LOCATIONS,
    companions=COMPANIONS,
    frequencies=FREQUENCIES,
    feelings=FEELINGS,
    morning_feelings=MORNING_FEELINGS,
    field_count=FIELD_COUNT,
)


@router.get("", response_model=DailyStressQuiz)
async def get_definition() -> DailyStressQuiz:
    """Return the full daily stress quiz definition."""
    return DEFINITION
