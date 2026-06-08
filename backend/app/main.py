"""FastAPI application entrypoint.

Creates the app and wires in routers. No business logic lives here.
Run with: ``uvicorn app.main:app --reload``.
"""

from fastapi import FastAPI

from app.routers import health, quizzes, results

app = FastAPI(
    title="Job Therapy API",
    description="Backend for the Job Therapy self-assessment tool.",
    version="0.1.0",
)

app.include_router(health.router)
app.include_router(quizzes.router)
app.include_router(results.router)
