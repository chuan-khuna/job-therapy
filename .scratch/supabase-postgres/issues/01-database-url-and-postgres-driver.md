# 01: Engine reads DATABASE_URL; switch to the Postgres driver

Status: ready-for-agent
Type: task

## What

- `backend/app/db/client.py` builds the engine from `DATABASE_URL` in the environment. Load `backend/.env` using `pydantic-settings` (add it with `uv add`) and keep the settings in a small module such as `app/settings.py`.
- Add a Postgres driver with `uv add "psycopg[binary]"`. Use the URL scheme `postgresql+psycopg://`.
- Remove the SQLite-only code: `DB_PATH`, the `mkdir` call, `check_same_thread`, and the WAL/`foreign_keys` pragma listener. Postgres enforces foreign keys by default.
- Pass `pool_pre_ping=True` so connections dropped by a paused or restarted Supabase are recycled.
- Add `backend/.env.example` with `DATABASE_URL=postgresql+psycopg://postgres:postgres@127.0.0.1:54322/postgres`, which is the local Supabase default. `.env` is already git-ignored at the root.
- If `DATABASE_URL` is missing, fail fast at startup with a clear error. Don't silently fall back to SQLite.

## Acceptance

- With the local DB running (ticket 02), `just backend-dev` starts and `/health` works.
- `just backend-lint` is clean.
- The secret URL does not appear in code or logs.
