# Spec: Supabase Postgres (prod) + local Supabase in Docker (dev)

Decision record: `docs/adr/0003-supabase-postgres-with-local-dev.md`. Read it first. Don't re-decide anything settled there.

## Goal

The backend stores all data (Reflection results now, Mood Log Entries next) in Postgres:
- **dev**: local Supabase started by the Supabase CLI in Docker
- **prod**: a Supabase cloud project

The environment is chosen only by `DATABASE_URL`. The backend keeps running locally, and there is no auth.

## Out of scope

- Supabase Auth, RLS, supabase-js, and the auto REST API
- Deploying the backend
- Mood Log tables. They come after this, on top of the migration setup.

## Tickets

1. `issues/01-database-url-and-postgres-driver.md`: engine reads `DATABASE_URL`, adds the Postgres driver, and drops the SQLite plumbing
2. `issues/02-local-supabase-dev-db.md`: Supabase CLI config and `just` recipes for the local DB
3. `issues/03-alembic-migrations.md`: Alembic with a baseline migration; stop using `create_all` at startup
4. `issues/04-prod-supabase-project.md`: create the prod project and apply migrations (human)
5. `issues/05-copy-existing-sqlite-results.md`: optional one-off copy of existing local results to prod
6. `issues/06-update-project-docs.md`: update CLAUDE.md and README for Postgres

Order: 01 → 02 → 03 → 04 → 05. Ticket 06 can happen alongside 03.
