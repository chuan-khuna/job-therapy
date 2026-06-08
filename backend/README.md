# Job Therapy — Backend

FastAPI service for the Job Therapy self-assessment tool. Managed with
[uv](https://docs.astral.sh/uv/). Data layer is local SQLite (added later — no ORM).

## Install

```sh
uv sync
```

## Run (dev)

```sh
uv run uvicorn app.main:app --reload
```

The API is then served at http://127.0.0.1:8000 (interactive docs at `/docs`).

## Directory structure

```
backend/
  app/                   # the FastAPI application package
    __init__.py
    main.py              # creates the FastAPI app and includes routers — no business logic
    db/                  # data layer (raw SQLite, no ORM)
      __init__.py        # re-exports DB_PATH, connect, get_db
      client.py          # stdlib sqlite3 connection plumbing (WAL, foreign_keys ON)
    routers/             # one module per resource, each an APIRouter
      __init__.py
      health.py          # GET /health   -> {"status": "ok"}
      quizzes.py         # APIRouter(prefix="/quizzes") -> GET /quizzes
      results.py         # APIRouter(prefix="/results")  -> GET + POST /results
  db/                    # holds the actual SQLite file (contents git-ignored)
    .gitkeep             # keeps the folder in git
    job-therapy.sqlite   # local SQLite db (git-ignored; created at runtime)
  pyproject.toml         # project metadata + dependencies (managed via uv)
  uv.lock                # locked dependency versions
  ruff.toml              # lint/format config
  README.md
  .python-version        # pinned Python version
```

### The `app/` package

`main.py` only assembles the application: it constructs the `FastAPI` instance
and wires in routers via `app.include_router(...)` — no business logic lives
there.

Routers live in `app/routers/`, one module per resource. Each is an `APIRouter`
with its own `prefix` + `tags`. Add new resources as additional router modules
and include them in `main.py`.

The data layer lives in `app/db/`.

### The database

There are two distinct `db` locations:

- **`app/db/client.py`** is the connection *plumbing*. It uses the standard
  library `sqlite3` (no ORM) and applies the project's standard pragmas —
  `journal_mode = WAL` and `foreign_keys = ON`. The database path
  (`DB_PATH`) is resolved relative to the backend root, so it points at the same
  file regardless of the process's working directory (launch-location
  independent). It exposes `connect()` (open a new connection with `sqlite3.Row`
  rows) and `get_db()` (a FastAPI dependency yielding a connection for use with
  `Depends(get_db)`, closed when the request finishes). These are re-exported
  from `app/db/__init__.py`.

- **`backend/db/`** holds the actual database *file*,
  `job-therapy.sqlite`, created at runtime. Its contents are git-ignored —
  only `.gitkeep` is tracked to keep the folder in the repo — and the WAL/SHM
  sidecars (`*.sqlite-wal`, `*.sqlite-shm`) are ignored too.
