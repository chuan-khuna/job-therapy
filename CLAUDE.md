@AGENTS.md

# Job Therapy — Project Guide

## What this app is

A digital self-assessment tool inspired by _Job Therapy_ by Tessa West. Users take structured quizzes to surface workplace misalignment signals, and can log results daily to track patterns over time. The goal is honest self-reflection, not gamification.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack) — read `node_modules/next/dist/docs/` before touching routing or data patterns
- **React**: 19 — use Server Components by default; add `"use client"` only when needed
- **Language**: TypeScript (strict)
- **Database**: SQLite via `better-sqlite3` — synchronous API, local file, no ORM
- **Auth**: none — single-user, local-first; results are not scoped to a user
- **Styling**: Tailwind CSS v4 — no `tailwind.config.js`; configuration lives in CSS via `@theme`
- **Package manager**: bun (preferred); npm is acceptable

## Theming

- Apply themes via `data-theme="<name>"` on `<html>` — never via `.dark` / `.light` class
- Default theme: `warm-paper` (defined in `styles/presets/warm-paper.css`)
- Each theme preset lives in `styles/presets/<name>.css` and is imported into `app/globals.css`
- Tokens are CSS custom properties scoped to `[data-theme="<name>"]` selectors
- See `DESIGN.md` for the visual language and `DESIGN.html` for a rendered reference

## Import conventions

- Use the `@/` path alias for project modules — `@/components/ui/TimePicker`, never relative traversal like `../../components/ui/TimePicker`
- Same-directory imports (`./quiz-def`) are fine

## CSS conventions

- Import order in `app/globals.css`: `@import 'tailwindcss'` → preset imports → utility overrides
- Use Tailwind utilities for layout and spacing
- Use CSS variables (`var(--color-surface)` etc.) for theme-sensitive values
- No inline `style=` props for colors — always route through a CSS variable

## Database

- **Local SQLite file** at `db/job-therapy.sqlite` (WAL mode; git-ignored along with its `-shm`/`-wal` sidecars). No external service, no connection keys.
- **Access**: `better-sqlite3` is **synchronous** — no `await` on queries. Get the shared connection via `getDb()` from `lib/db/client.ts`; it opens the file lazily and sets `journal_mode = WAL` + `foreign_keys = ON`.
- **Query modules**: write raw SQL behind typed helpers in `lib/db/` (see `lib/db/results.ts`). JSON-shaped columns (`answers`, `matched_types`) are stored as `TEXT` and `JSON.parse`/`JSON.stringify`d at the boundary.
- **No ORM** — write raw SQL with prepared statements (`db.prepare(...).run/get/all`).
- **Migrations**: plain SQLite `.sql` files in `db/migrations/`, applied in filename order by `scripts/migrate.ts`, which tracks applied files in a `_migrations` table (idempotent — safe to re-run). Run with `bun run db:migrate` (or `just migrate`).
- **No auth / no per-user scoping**: this is a single-user local app — rows are not owned by a user and there is no login. Do not add a `user_id` column or auth flow without discussing first.

## File layout (intended)

```
app/                   Next.js App Router
  layout.tsx           Sets data-theme on <html>
  globals.css          Tailwind + preset imports
db/
  job-therapy.sqlite   Local SQLite database (git-ignored)
  migrations/          SQLite *.sql migrations, applied by scripts/migrate.ts
lib/
  db/                  SQLite query modules (client.ts, results.ts)
scripts/
  migrate.ts           Migration runner (bun run db:migrate)
styles/
  presets/
    warm-paper.css     Default theme
components/
  ui/                  Shared primitive components
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
- Examples: `.docs/adr/2026-06-08-supabase-auth.md`, `.docs/prd/2026-06-08-daily-logging.md`
- When a document is requested as **HTML**, follow `DESIGN.md` (and `DESIGN.html`) for the visual language — use the `warm-paper` theme tokens, not ad-hoc styles.
  - **Code blocks**: highlight with [Shiki](https://shiki.style) using the `catppuccin-mocha` theme.
  - **Diagrams**: use [Mermaid](https://mermaid.js.org) for flowcharts, sequence diagrams, etc.

## Commands

Use `just` (see `justfile`):

```
just dev      # start dev server
just build    # production build
just migrate  # apply pending db/migrations/*.sql (bun run db:migrate)
```

## What to avoid

- Do not create a `tailwind.config.js` — Tailwind v4 is configured in CSS only
- Do not use `next/font` with `variable` prop to set CSS vars for color — fonts only
- Do not add an ORM (Prisma, Drizzle, etc.) without discussing first
- Do not add a `user_id` column, auth, or per-user scoping without discussing first — this is a single-user local app
- Do not `await` `better-sqlite3` queries — the API is synchronous
- Do not write Postgres-dialect SQL or reach for Supabase — the DB is local SQLite
- Do not use `className="dark:…"` — use `data-theme` selectors in CSS instead
- Do not add `console.log` debugging left in committed code
