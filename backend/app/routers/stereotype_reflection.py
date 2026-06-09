"""Stereotype reflection — "คุณเป็นคนทำงานประเภทไหน".

Serves the full reflection definition (questions + worker-type catalog) so the
frontend can render it from a single backend-owned source of truth. The
yes/no scoring rules stay in the client; this module owns the content.
"""

from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter(prefix="/reflections/stereotype", tags=["reflections"])

REFLECTION_ID = "reflection-001-stereotype-test"
REFLECTION_TITLE = "คุณเป็นคนทำงานประเภทไหน"


class QuizType(BaseModel):
    """A worker-type outcome the reflection can match."""

    id: str
    name: str
    keys: list[int]
    note: str | None = None


class Question(BaseModel):
    """A single yes/no prompt."""

    id: int
    label: str | None = None
    text: str
    note: str | None = None


class StereotypeReflection(BaseModel):
    """Full definition for the stereotype reflection."""

    id: str
    title: str
    types: list[QuizType]
    questions: list[Question]


TYPES: list[QuizType] = [
    QuizType(
        id="A",
        name="วิกฤติตัวตน",
        keys=[1, 2],
        note="คุณอาจจะยังไม่พร้อมที่จะออกจากงาน แต่บทนี้จะยังคงเหมาะกับคุณ",
    ),
    QuizType(id="B", name="ใจห่างเหิน", keys=[1, 3, 4]),
    QuizType(id="C", name="ถูกดึงจนตึงเกิน", keys=[5, 6, 7]),
    QuizType(id="D", name="ที่สอง", keys=[8, 9]),
    QuizType(id="E", name="ดาวเด่นที่ไม่มีใครเห็น", keys=[9, 10, 11]),
]

QUESTIONS: list[Question] = [
    Question(
        id=1,
        label="วิกฤติตัวตน",
        text="คุณคิดจะลาออกไปทำงานที่แตกต่างไปจากงานที่ทำอยู่ตอนนี้หรือไม่",
    ),
    Question(
        id=2,
        text="อาชีพที่ทำในปัจจุบันเป็นส่วนสำคัญของตัวตนของคุณหรือไม่",
    ),
    Question(
        id=3,
        label="ใจห่างเหิน",
        text="คุณเคยรักงานที่ทำแต่ไม่ได้รู้สึกแบบนั้นแล้วหรือเปล่า",
    ),
    Question(
        id=4,
        text="หากตอบว่าใช่ในคำถามที่ 3 คุณอยากหางานที่คล้ายคลึงกับงานเก่าตอนที่คุณยังชอบมันหรือไม่",
        note="ตอบเฉพาะเมื่อตอบ 'ใช่' ในข้อ 3",
    ),
    Question(
        id=5,
        label="ถูกดึงจนตึงเกิน",
        text=(
            "คุณมีหลายบทบาทในที่ทำงานหรือเปล่า นั่นรวมถึงตำแหน่งงานและบทบาทหรือความรับผิดชอบอื่นๆ "
            "เช่น การเป็นสมาชิกในคณะกรรมการหรือในกลุ่มทรัพยากรพนักงาน ถ้าใช่ให้ถือว่ารวมอยู่ด้วย"
        ),
    ),
    Question(
        id=6,
        text="คุณถูกขัดจังหวะระหว่างที่พยายามจะทำงานให้เสร็จหรือเปล่า",
    ),
    Question(
        id=7,
        text="คุณเครียดกับปริมาณงานที่ไม่สามารถทำให้เสร็จในตอนท้ายของวันหรือไม่",
    ),
    Question(
        id=8,
        label="ที่สอง",
        text="ตอนนี้คุณมีงานทำแต่มีปัญหากับการเลื่อนตำแหน่งอยู่ใช่หรือไม่",
    ),
    Question(
        id=9,
        text="คุณรู้สึกว่าพนักงานในระดับเดียวกันกับคุณที่ทำงานให้กับบริษัทอื่นได้รับค่าตอบแทนดีกว่าคุณหรือไม่",
    ),
    Question(
        id=10,
        label="ดาวเด่นที่ไม่มีใครเห็น",
        text="คุณรู้สึกว่าความทุ่มเทของคุณถูกมองข้ามหรือไม่มีคุณค่าในที่ทำงานหรือเปล่า",
    ),
    Question(
        id=11,
        text=(
            "ลองนึกถึงทักษะในการทำงานบางอย่างที่คุณมี ลองถามตัวเองว่าแต่ละทักษะเป็นทักษะหายากหรือไม่ "
            "มันส่งผลต่อประสิทธิภาพในการทำงานในแง่ดีหรือเปล่า และคุณเชี่ยวชาญในทักษะเหล่านี้มากกว่าคนอื่นหรือไม่ "
            "คุณมีทักษะอย่างน้อยหนึ่งอย่างที่ตรงตามเกณฑ์ที่กล่าวมาหรือไม่"
        ),
    ),
]

DEFINITION = StereotypeReflection(
    id=REFLECTION_ID, title=REFLECTION_TITLE, types=TYPES, questions=QUESTIONS
)


@router.get("", response_model=StereotypeReflection)
async def get_definition() -> StereotypeReflection:
    """Return the full stereotype reflection definition."""
    return DEFINITION
