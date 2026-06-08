-- =============================================================================
-- 0001_init — quiz_results on Supabase (Postgres) with owner-scoped RLS
-- =============================================================================
-- Port of db/migrations/001_init.sql from SQLite to Postgres, plus the
-- ownership column and Row Level Security policies.
--
-- Apply now: paste into Supabase dashboard → SQL Editor → Run.
-- (Or later, once the Supabase CLI is set up: `supabase db push`.)
--
-- Notes on the dialect change from the old SQLite schema:
--   INTEGER PRIMARY KEY AUTOINCREMENT  ->  bigint generated always as identity
--   TEXT holding JSON                  ->  jsonb (native, queryable)
--   datetime('now') default            ->  timestamptz default now()
--   (new) user_id                      ->  uuid referencing auth.users(id)
-- =============================================================================

create table public.quiz_results (
  id            bigint generated always as identity primary key,
  -- Supabase Auth manages auth.users; Discord logins land there automatically.
  -- on delete cascade => deleting an account removes that user's results.
  user_id       uuid        not null references auth.users (id) on delete cascade,
  quiz_id       text        not null,
  date          text        not null,                 -- YYYY-MM-DD
  answers       jsonb       not null,                 -- {"1": true, "2": false, ...}
  matched_types jsonb       not null,                 -- ["A", "C"]
  created_at    timestamptz not null default now()
);

create index idx_quiz_results_user_quiz
  on public.quiz_results (user_id, quiz_id);

-- ----------------------------------------------------------------------------
-- Row Level Security — the actual data-protection boundary.
-- With RLS enabled and these policies, the public/anon key can ONLY ever
-- read or write rows whose user_id matches the logged-in user (auth.uid()).
-- Without this block, the publishable key would expose every row to everyone.
-- ----------------------------------------------------------------------------
alter table public.quiz_results enable row level security;

create policy "read own results"
  on public.quiz_results for select
  to authenticated
  using (auth.uid() = user_id);

create policy "insert own results"
  on public.quiz_results for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "update own results"
  on public.quiz_results for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own results"
  on public.quiz_results for delete
  to authenticated
  using (auth.uid() = user_id);
