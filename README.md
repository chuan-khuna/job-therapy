# Job Therapy

A digital self-assessment tool for **reflecting on your work life** — take short
quizzes, log how you're feeling, and track patterns over time. The goal is honest
self-reflection, not gamification.

The first quizzes are inspired by _Job Therapy_ by Tessa West, but the app isn't
limited to that book — it's a general space for mood and work-life logging, and
more material will be added over time.

> [!IMPORTANT]
> **Run this locally.** Job Therapy has **no authentication** and does nothing to
> protect your data from other users — your entries live in a local SQLite file.
> It's designed for single-user, local use, not for deploying on a shared or
> public server.

## Architecture

A two-service monorepo:

- **`frontend/`** — Next.js 16 app (the UI you interact with)
- **`backend/`** — FastAPI service that owns the local SQLite database

The frontend talks to the backend over HTTP. See `CLAUDE.md` for conventions and
each service's own `README.md` for details.

## Getting started

You'll need [`just`](https://github.com/casey/just), [`bun`](https://bun.sh)
(frontend), and [`uv`](https://docs.astral.sh/uv/) (backend).

```sh
# 1. Install dependencies
just frontend-install        # bun install   (in frontend/)
just backend-install         # uv sync        (in backend/)

# 2. Run both services (in separate terminals)
just backend-dev             # FastAPI on http://127.0.0.1:8000  (docs at /docs)
just frontend-dev            # Next.js on http://localhost:3000
```

Run `just` on its own to list every available recipe.
