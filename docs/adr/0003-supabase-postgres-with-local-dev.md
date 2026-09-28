---
status: accepted
date: 2026-09-28
---

# Move the database from local SQLite to Supabase Postgres; dev runs Supabase locally in Docker

Journal data (Mood Log Entries, Reflection results) should survive beyond one machine, so the backend's database moves from the local SQLite file to a **Supabase** Postgres project (prod). Dev uses the **Supabase CLI** (`supabase start`, Docker) for a local Postgres, so dev never touches prod data and the free-tier project quota and inactivity pause don't apply to dev. The backend picks its database from a `DATABASE_URL` env var.

The FastAPI backend still owns the data and still runs locally. Supabase is used as **plain Postgres only**: no Supabase Auth, RLS, auto REST API or client-side supabase-js. The single-user, no-auth rule is unchanged, and the prod connection string lives only in the backend's git-ignored `.env`. Deploying the backend publicly would need auth and a new ADR.

## Considered Options

- **Neon**: free branching fits dev/prod well, but the user preferred Supabase for its dashboard and for a possible future move to Supabase Auth.
- **Supabase with two cloud projects (prod + dev)**: rejected because it uses the whole free quota and the dev project gets paused when idle.
- **SQLite for dev and Postgres for prod**: rejected because dialect differences (types, timezones, constraints) would only surface in prod.
- **Supabase CLI migrations (`supabase/migrations/*.sql`)**: rejected in favour of **Alembic**, because the schema is defined by SQLModel in `backend/app/models.py` and Alembic can autogenerate from it. The Supabase CLI only provides the local Postgres.

## Consequences

- `init_db()` / `create_all` no longer manages the schema. Alembic migrations do, applied to local dev first and then to prod.
- The SQLite-only parts of `backend/app/db/client.py` (the file path, WAL and `foreign_keys` pragmas, `check_same_thread`) go away.
- Timestamps can be stored as `timestamptz`. The UTC `…Z` serialization rule in read schemas stays.
- Supabase free tier pauses a project after about a week of inactivity. The data is kept, but the project has to be restored from the dashboard.
