"""Database engine + session plumbing (SQLModel / SQLAlchemy).

Opens the local SQLite database inside the backend at
``backend/db/job-therapy.sqlite``. The path is resolved relative to the backend
root so it works regardless of the process's working directory.

Mirrors the project's SQLite conventions: WAL journaling and
``foreign_keys = ON``, applied to every new connection.
"""

from collections.abc import Iterator
from pathlib import Path

from sqlalchemy import event
from sqlmodel import Session, SQLModel, create_engine

# ``client.py`` lives at ``backend/app/db/client.py`` — three parents up is the
# backend root, which keeps the path stable no matter where the server is run.
BACKEND_ROOT = Path(__file__).resolve().parents[2]
DB_PATH = BACKEND_ROOT / "db" / "job-therapy.sqlite"
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(
    f"sqlite:///{DB_PATH}",
    # FastAPI may touch a session from a worker thread; SQLite needs this off.
    connect_args={"check_same_thread": False},
)


@event.listens_for(engine, "connect")
def _set_sqlite_pragmas(dbapi_connection, _connection_record) -> None:
    """Apply the project's standard pragmas to every new SQLite connection."""
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode = WAL")
    cursor.execute("PRAGMA foreign_keys = ON")
    cursor.close()


def init_db() -> None:
    """Create tables for all registered SQLModel models. Idempotent."""
    # Import models so they register on SQLModel.metadata before create_all.
    from app import models  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    """FastAPI dependency yielding a SQLModel session.

    Use with ``Depends(get_session)`` in routers. The session is closed once the
    request finishes.
    """
    with Session(engine) as session:
        yield session
