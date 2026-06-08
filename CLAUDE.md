@AGENTS.md

# Job Therapy — Project Guide

## What this app is

A digital self-assessment tool inspired by _Job Therapy_ by Tessa West. Users take structured quizzes to surface workplace misalignment signals, and can log results daily to track patterns over time. The goal is honest self-reflection, not gamification.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack) — read `node_modules/next/dist/docs/` before touching routing or data patterns
- **React**: 19 — use Server Components by default; add `"use client"` only when needed
- **Language**: TypeScript (strict)
- **Database**: Supabase (Postgres) via `@supabase/supabase-js` + `@supabase/ssr` — async API, no ORM
- **Auth**: Supabase Auth with the Discord provider; data ownership enforced by Row Level Security (RLS)
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

## Database & Auth

- **Hosted Postgres on Supabase** — no local DB file. Connection + keys come from env (see `.env.example`); copy it to `.env.local`.
- **Keys**: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are browser-safe (gated by RLS). `SUPABASE_SECRET_KEY` is server-only and **bypasses RLS** — never expose it or prefix it with `NEXT_PUBLIC_`.
- **Migrations**: Postgres SQL files in `supabase/migrations/`. Apply via the Supabase dashboard SQL Editor, or `supabase db push` once the CLI is set up. (Legacy SQLite files under `db/migrations/` are dead — do not use; they're SQLite dialect and won't run on Postgres.)
- **RLS is mandatory**: every table holding user data must have RLS enabled with owner-scoped policies (`auth.uid() = user_id`) before it ships. A table without RLS is readable by anyone with the publishable key.
- **No ORM** — write raw SQL in migrations; query through the Supabase client in `lib/db/` modules.
- **Clients**: use the server client (reads the auth cookie) in Server Components / server actions / route handlers; use the browser client only in `"use client"` code. The secret-key client is for trusted server-side admin work only.
- **Ownership**: derive the user from the session server-side (`supabase.auth.getUser()`), never trust a client-supplied `user_id`. RLS is the backstop, not the only gate.

## File layout (intended)

```
app/                   Next.js App Router
  layout.tsx           Sets data-theme on <html>
  globals.css          Tailwind + preset imports
supabase/
  migrations/          Postgres SQL migrations (RLS policies live here)
lib/
  db/                  Supabase query modules
  supabase/            server + browser client factories
styles/
  presets/
    warm-paper.css     Default theme
components/
  ui/                  Shared primitive components
```

## Commands

Use `just` (see `justfile`):

```
just dev      # start dev server
just build    # production build
# Migrations: apply supabase/migrations/*.sql via the Supabase SQL Editor
# (or `supabase db push` once the CLI is installed)
```

## What to avoid

- Do not create a `tailwind.config.js` — Tailwind v4 is configured in CSS only
- Do not use `next/font` with `variable` prop to set CSS vars for color — fonts only
- Do not add an ORM (Prisma, Drizzle, etc.) without discussing first
- Do not create a table without enabling RLS + owner-scoped policies
- Do not expose `SUPABASE_SECRET_KEY` to the browser or prefix it with `NEXT_PUBLIC_`
- Do not use `better-sqlite3` or write SQLite-dialect SQL — the DB is Postgres now
- Do not use `className="dark:…"` — use `data-theme` selectors in CSS instead
- Do not add `console.log` debugging left in committed code
