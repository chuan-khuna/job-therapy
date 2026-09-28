# 02: Local Supabase (Docker) as the dev database

Status: ready-for-agent
Type: task
Blocked by: 01

## What

- Run `supabase init` at the repo root. This creates `supabase/config.toml`. Commit the config and git-ignore Supabase's local temp and branch folders.
- Disable services we don't use (studio can stay, since it's handy for browsing data) so startup is lighter: auth, storage, realtime, edge functions, and so on, as far as `config.toml` allows.
- Add `justfile` recipes:
  - `db-start`: `supabase start`
  - `db-stop`: `supabase stop`
  - `db-status`: `supabase status`, which prints the local DB URL
- The CLI is not installed on this machine yet. Document the install (for example `scoop install supabase`, or run it through `bunx supabase`) and pick one to use consistently in the recipes. Docker Desktop is already installed.

## Acceptance

- `just db-start` brings up Postgres on `127.0.0.1:54322`.
- The `DATABASE_URL` from `.env.example` connects to it.
