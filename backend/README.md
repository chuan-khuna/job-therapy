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

## Layout

```
app/
  main.py            # creates the FastAPI app and includes routers — no business logic
  routers/
    health.py        # GET /health   -> {"status": "ok"}
    quizzes.py       # GET /quizzes  -> [] (placeholder)
    results.py       # GET /results, POST /results (placeholders)
```

Each router is an `APIRouter` with its own `prefix` + `tags`, wired into the app
via `app.include_router(...)` in `app/main.py`. Add new resources as additional
routers under `app/routers/` and include them there.
