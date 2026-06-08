@AGENTS.md

# Job Therapy — Project Guide

## What this app is

A digital self-assessment tool inspired by _Job Therapy_ by Tessa West. Users take structured quizzes to surface workplace misalignment signals, and can log results daily to track patterns over time. The goal is honest self-reflection, not gamification.

## Repository layout

This is a two-service monorepo. Project-wide files (`.docs/`, `DESIGN.md`, this guide, the `justfile`) live at the root; each service owns its own dependencies and tooling.

```
backend/    Python FastAPI service — owns the SQLite database (see backend/README.md)
frontend/   Next.js 16 app — the UI; talks to the backend over HTTP
.docs/      Project documents (ADR, PRD, RFC, doc)
justfile    Task runner — recipes run in the right service via [working-directory]
```

- **backend/** and **frontend/** are independent: install, lint, and run them separately (the `justfile` wraps each).
- The **backend owns the data**. The frontend fetches from the backend API rather than reading the database directly.

## Agent roles & delegation

This project defines specialized subagents in `.claude/agents/`. The main Claude session acts as the **orchestrator**: it plans the work and routes implementation to the right subagent rather than doing everything inline.

| Subagent | Owns |
| --- | --- |
| `backend-developer` | Python/FastAPI/SQLModel changes under `backend/` — endpoints, models, data access, business logic |
| `frontend-developer` | Next.js/React/Tailwind changes under `frontend/` — components, routes, pages, styling, data fetching |
| `tester-and-security-guard` | Read-only correctness **and** security review across both services |
| `doc-writer` | Project documents under `.docs/` |

**Delegation policy (MUST follow):**

1. **Route implementation by area.** Non-trivial backend coding goes to `backend-developer`; non-trivial frontend coding goes to `frontend-developer`. The orchestrator may still handle small, cross-cutting, or purely investigative tasks directly — but a substantive feature or change in one service should be delegated to that service's agent.
2. **Mandatory review gate.** **When `backend-developer` or `frontend-developer` reports a task finished, the orchestrator MUST hand the resulting diff to `tester-and-security-guard` for a code-quality and security review before the task is considered done and before committing.** Pass the changed `file:line` ranges and a short description of the change.
3. **Act on the review.** Route any Critical/High findings back to the implementing agent to fix, then re-review. Only surface the task as complete once the review is clean (or the remaining findings are explicitly accepted by the user).
4. A change touching both services triggers a review covering both; `tester-and-security-guard` already spans the full stack.

Note: this gate is a convention the orchestrator follows by reading this file — it is not machine-enforced, so do not skip it.

## Stack

### Backend (`backend/`)

- **Language**: Python (>= 3.14)
- **Project/dependency manager**: [uv](https://docs.astral.sh/uv/) — `uv add`, `uv sync`, `uv run …`; never call `pip` or hand-edit `uv.lock`
- **Framework**: FastAPI (async) + Uvicorn; Pydantic models for request/response schemas
- **Database**: SQLite (local file) via **SQLModel** (SQLAlchemy + Pydantic). Primary keys are **UUIDv7** from the stdlib `uuid.uuid7` (time-ordered)
- **Lint/format**: ruff (config in `backend/ruff.toml`)

### Frontend (`frontend/`)

- **Framework**: Next.js 16 (App Router, Turbopack) — read `frontend/node_modules/next/dist/docs/` before touching routing or data patterns
- **React**: 19 — use Server Components by default; add `"use client"` only when needed
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 — no `tailwind.config.js`; configuration lives in CSS via `@theme`
- **Package manager**: bun (preferred); npm is acceptable
- **Auth**: none — single-user, local-first; results are not scoped to a user

## Backend conventions (`backend/`)

- **Run from `backend/`** (the `justfile` does this for you): `uv run uvicorn app.main:app --reload`. Interactive docs at `/docs` (Swagger) and `/scalar` (Scalar API reference). The raw OpenAPI schema is at `/openapi.json` — the frontend can fetch this to discover/generate types against the API contract.
- **App shape**: `app/main.py` creates the FastAPI app and only wires routers (`app.include_router(...)`) — no business logic. Each resource is an `APIRouter` with its own `prefix` + `tags` under `app/routers/`.
- **Schemas**: define Pydantic models for inputs and outputs; validate/coerce all incoming data — never trust client input. Prefer `async def` handlers; raise `HTTPException` on error paths.
- **Database access (SQLModel)**: get a session via `Depends(get_session)` from `app/db/client.py`. The engine opens `backend/db/job-therapy.sqlite` (path resolved relative to the backend root) and applies `journal_mode = WAL` + `foreign_keys = ON` on every connection. Tables are created at startup by `init_db()` (called from the app lifespan) — there is no separate migration runner yet.
- **Models**: define table models as `SQLModel` subclasses with `table=True` in `app/models.py`. Every table's primary key is a **UUIDv7** — `id: UUID = Field(default_factory=uuid7, primary_key=True)` (`from uuid import uuid7`, stdlib on Python 3.14+). Use UUIDv7, not v4: it's time-ordered, so rows sort by creation and index locality stays good. JSON-shaped columns use `sa_column=Column(JSON)`.
- **Timestamps**: every table model has both `created_at` and `updated_at` (UTC-aware `datetime`). Set `created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))` once at insert. `updated_at` defaults the same way and must be bumped to `datetime.now(UTC)` on every write — do this in the update handler (there is no DB trigger). SQLite stores datetimes naively, so serialize them as explicit UTC ISO 8601 (`…Z`) in read schemas via a `field_serializer`, so clients don't misread them as local time.
- **Queries**: use the ORM (`session.exec(select(...))`, `session.add`, `session.commit`). SQLModel parameterizes for you — never f-string user input into a `text()` query. Keep request/response **read** schemas as plain Pydantic models in the router, separate from table models.
- **No auth / no per-user scoping**: single-user local app — rows are not owned by a user and there is no login. Do not add a `user_id` column or auth flow without discussing first.
- **No leftover `print()` debugging** in committed code.

## Frontend conventions (`frontend/`)

### Theming

- Apply themes via `data-theme="<name>"` on `<html>` — never via `.dark` / `.light` class
- Default theme: `warm-paper` (defined in `frontend/styles/presets/warm-paper.css`)
- Each theme preset lives in `frontend/styles/presets/<name>.css` and is imported into `frontend/app/globals.css`
- Tokens are CSS custom properties scoped to `[data-theme="<name>"]` selectors
- See `DESIGN.md` for the visual language and `DESIGN.html` for a rendered reference

### Imports

- Use the `@/` path alias for project modules — `@/components/ui/TimePicker`, never relative traversal like `../../components/ui/TimePicker`. The alias is rooted at `frontend/`.
- Same-directory imports (`./quiz-def`) are fine

### CSS

- Import order in `frontend/app/globals.css`: `@import 'tailwindcss'` → preset imports → utility overrides
- Use Tailwind utilities for layout and spacing
- Use CSS variables (`var(--color-surface)` etc.) for theme-sensitive values
- No inline `style=` props for colors — always route through a CSS variable

## File layout (intended)

```
backend/
  app/
    main.py            Creates the FastAPI app, includes routers, init_db() on startup
    models.py          SQLModel table models (UUIDv7 PKs)
    routers/           One APIRouter per resource (health, quizzes, results, …)
    db/
      client.py        SQLModel engine + get_session() dependency (WAL, foreign_keys ON)
  db/
    job-therapy.sqlite Local SQLite database (git-ignored)
  pyproject.toml       uv project + dependencies
  ruff.toml            Lint/format config
frontend/
  app/                 Next.js App Router
    layout.tsx         Sets data-theme on <html>
    globals.css        Tailwind + preset imports
  components/
    ui/                Shared primitive components
  lib/                 Frontend modules (API client, helpers)
  styles/
    presets/
      warm-paper.css   Default theme
  package.json         bun project + dependencies
.docs/                 Project documents (see below)
DESIGN.md / DESIGN.html
justfile
```

## Project documentation

Project documents (design records, specs, proposals) live under `.docs/`, organized by category:

```
.docs/
  <category>/
    yyyy-mm-dd-topic.md      # or .html
```

- **Path format**: `.docs/<category>/<yyyy-mm-dd>-<topic>.{md,html}`
- **Category** is the kind of document — e.g. `adr` (architecture decision record), `prd` (product requirements), `rfc` (request for comments), `doc` (general documentation — explaining how things/logic in this project work). Add new categories as needed.
- **Date prefix** is the date the document was authored (`yyyy-mm-dd`), so files sort chronologically within a category.
- **Topic** is a short kebab-case slug.
- Examples: `.docs/adr/2026-06-08-frontend-backend-split.md`, `.docs/prd/2026-06-08-daily-logging.md`
- When a document is requested as **HTML**, follow `DESIGN.md` (and `DESIGN.html`) for the visual language — use the `warm-paper` theme tokens, not ad-hoc styles.
  - **Code blocks**: highlight with [Shiki](https://shiki.style) using the `catppuccin-mocha` theme.
  - **Diagrams**: use [Mermaid](https://mermaid.js.org) for flowcharts, sequence diagrams, etc.

## Commands

Use `just` (see `justfile`). Recipes run inside the right service via `[working-directory]`, so run them from the repo root:

```
# Frontend (frontend/)
just frontend-dev      # start the frontend dev server
just frontend-build    # production build
just frontend-start    # start the production server
just frontend-lint     # eslint
just frontend-format   # prettier
just frontend-install  # bun install

# Backend (backend/)
just backend-dev       # start the FastAPI dev server (uvicorn --reload) on :8000
just backend-install   # uv sync
just backend-lint      # ruff check
just backend-format    # ruff format
```

## What to avoid

### Backend

- Do not use integer/autoincrement or UUIDv4 primary keys — PKs are UUIDv7 (`uuid.uuid7`)
- Do not f-string user input into raw `text()` SQL — go through SQLModel/SQLAlchemy, which parameterizes
- Do not call `pip` directly or hand-edit `uv.lock` — manage deps through `uv`
- Do not add a `user_id` column, auth, or per-user scoping without discussing first — this is a single-user local app
- Do not leave `print()` debugging in committed code

### Frontend

- Do not create a `tailwind.config.js` — Tailwind v4 is configured in CSS only
- Do not use `next/font` with `variable` prop to set CSS vars for color — fonts only
- Do not add an ORM or read the database directly — fetch from the backend API
- Do not use `className="dark:…"` — use `data-theme` selectors in CSS instead
- Do not leave `console.log` debugging in committed code
