# 05: Copy existing local SQLite results to prod (optional)

Status: needs-info
Type: task
Blocked by: 04

## Question for the user

Is there data in `backend/db/job-therapy.sqlite` worth keeping? If not, close this as `wontfix`.

## If yes

Write a one-off script, for example `backend/scripts/copy_sqlite_results.py`, that reads rows from the SQLite `results` table and inserts them into `DATABASE_URL`:
- keep ids and timestamps, treating the naive datetimes as UTC
- make it idempotent (skip ids that already exist)

Run it against local first, then prod.
