"""FastAPI application entrypoint.

Creates the app and wires in routers. No business logic lives here.
Run with: ``uvicorn app.main:app --reload``.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from scalar_fastapi import get_scalar_api_reference

from app.db import init_db
from app.routers import (
    health,
    quizzes,
    results,
    stereotype_quiz,
    tessa_daily_stress_quiz,
)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Create database tables on startup."""
    init_db()
    yield


app = FastAPI(
    title="Job Therapy API",
    description="Backend for the Job Therapy self-assessment tool.",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(health.router)
app.include_router(quizzes.router)
app.include_router(stereotype_quiz.router)
app.include_router(tessa_daily_stress_quiz.router)
app.include_router(results.router)


@app.get("/scalar", include_in_schema=False)
async def scalar_reference():
    """Serve the Scalar API reference UI."""
    return get_scalar_api_reference(openapi_url=app.openapi_url, title=app.title)
