# 06: Update project docs for Postgres

Status: ready-for-agent
Type: task

## What

Update `CLAUDE.md` (Stack, Backend conventions, File layout, Commands, What to avoid) and `backend/README.md`:
- Supabase Postgres via `DATABASE_URL`
- local Supabase in Docker for dev
- Alembic migrations, and no more `create_all`
- remove the SQLite-specific wording: the file path, WAL, and "SQLite stores datetimes naively"
- keep the rules for UUIDv7 PKs, UTC timestamps, and no auth
- point to ADR-0003
