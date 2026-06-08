# Job Therapy — Backend

FastAPI service for the Job Therapy self-assessment tool. Managed with
[uv](https://docs.astral.sh/uv/). Data layer is local SQLite via
[SQLModel](https://sqlmodel.tiangolo.com/); primary keys are UUIDv7.

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
    main.py              # creates the FastAPI app, includes routers, init_db() on startup
    models.py            # SQLModel table models (UUIDv7 primary keys)
    db/                  # data layer (SQLModel over SQLite)
      __init__.py        # re-exports DB_PATH, engine, get_session, init_db
      client.py          # SQLModel engine + session plumbing (WAL, foreign_keys ON)
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

- **`app/db/client.py`** is the engine *plumbing*. It builds a SQLModel
  (SQLAlchemy) `engine` and applies the project's standard pragmas —
  `journal_mode = WAL` and `foreign_keys = ON` — to every connection. The
  database path (`DB_PATH`) is resolved relative to the backend root, so it
  points at the same file regardless of the process's working directory
  (launch-location independent). It exposes `engine`, `get_session()` (a FastAPI
  dependency yielding a `Session` for use with `Depends(get_session)`, closed
  when the request finishes), and `init_db()` (creates tables from the SQLModel
  models — called from the app lifespan on startup). These are re-exported from
  `app/db/__init__.py`. Table models live in `app/models.py`, with **UUIDv7**
  primary keys via the stdlib `uuid.uuid7`.

- **`backend/db/`** holds the actual database *file*,
  `job-therapy.sqlite`, created at runtime. Its contents are git-ignored —
  only `.gitkeep` is tracked to keep the folder in the repo — and the WAL/SHM
  sidecars (`*.sqlite-wal`, `*.sqlite-shm`) are ignored too.
