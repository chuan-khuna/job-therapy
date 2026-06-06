@AGENTS.md

# Job Therapy — Project Guide

## What this app is

A digital self-assessment tool inspired by _Job Therapy_ by Tessa West. Users take structured quizzes to surface workplace misalignment signals, and can log results daily to track patterns over time. The goal is honest self-reflection, not gamification.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack) — read `node_modules/next/dist/docs/` before touching routing or data patterns
- **React**: 19 — use Server Components by default; add `"use client"` only when needed
- **Language**: TypeScript (strict)
- **Database**: SQLite3 via `better-sqlite3` — synchronous API, no ORM
- **Styling**: Tailwind CSS v4 — no `tailwind.config.js`; configuration lives in CSS via `@theme`
- **Package manager**: bun (preferred); npm is acceptable

## Theming

- Apply themes via `data-theme="<name>"` on `<html>` — never via `.dark` / `.light` class
- Default theme: `warm-paper` (defined in `styles/presets/warm-paper.css`)
- Each theme preset lives in `styles/presets/<name>.css` and is imported into `app/globals.css`
- Tokens are CSS custom properties scoped to `[data-theme="<name>"]` selectors
- See `DESIGN.md` for the visual language and `DESIGN.html` for a rendered reference

## CSS conventions

- Import order in `app/globals.css`: `@import 'tailwindcss'` → preset imports → utility overrides
- Use Tailwind utilities for layout and spacing
- Use CSS variables (`var(--color-surface)` etc.) for theme-sensitive values
- No inline `style=` props for colors — always route through a CSS variable

## Database

- DB file: `db/job-therapy.sqlite` (git-ignored)
- Schema migrations: plain SQL files in `db/migrations/` numbered `001_init.sql`, `002_…`
- Run migrations manually or via `just migrate`
- No ORM — write raw SQL, keep queries in `lib/db/` modules

## File layout (intended)

```
app/                   Next.js App Router
  layout.tsx           Sets data-theme on <html>
  globals.css          Tailwind + preset imports
db/
  migrations/
  job-therapy.sqlite   (git-ignored)
lib/
  db/                  SQLite query modules
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
just migrate  # run pending SQL migrations
just build    # production build
```

## What to avoid

- Do not create a `tailwind.config.js` — Tailwind v4 is configured in CSS only
- Do not use `next/font` with `variable` prop to set CSS vars for color — fonts only
- Do not add an ORM (Prisma, Drizzle, etc.) without discussing first
- Do not use `className="dark:…"` — use `data-theme` selectors in CSS instead
- Do not add `console.log` debugging left in committed code
