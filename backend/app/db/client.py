"""SQLite connection plumbing.

Opens (and lazily creates) the local SQLite database that lives inside the
backend at ``backend/db/job-therapy.sqlite``. The path is resolved relative to
the backend root so it works regardless of the process's working directory.

Mirrors the wider project's SQLite conventions: WAL journaling and
``foreign_keys = ON``. Raw SQL only — no ORM. Tables are not created here.
"""

import sqlite3
from collections.abc import Iterator
from pathlib import Path

# ``client.py`` lives at ``backend/app/db/client.py`` — three parents up is the
# backend root, which keeps the path stable no matter where the server is run.
BACKEND_ROOT = Path(__file__).resolve().parents[2]
DB_PATH = BACKEND_ROOT / "db" / "job-therapy.sqlite"


def connect() -> sqlite3.Connection:
    """Open a new SQLite connection to the backend database.

    Creates the file (and the ``db/`` directory) if missing, and applies the
    project's standard pragmas. Rows are returned as ``sqlite3.Row`` for
    name-based access.
    """
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def get_db() -> Iterator[sqlite3.Connection]:
    """FastAPI dependency yielding a SQLite connection.

    Use with ``Depends(get_db)`` in routers. The connection is closed once the
    request finishes.
    """
    conn = connect()
    try:
        yield conn
    finally:
        conn.close()
