# 04: Create the prod Supabase project and apply migrations

Status: ready-for-human
Type: task
Blocked by: 03

## What (needs the user's Supabase account)

1. Create a Supabase project, for example `job-therapy`, in the region nearest to you, such as Singapore. Save the DB password in a password manager.
2. Copy the **Session pooler** connection string. The direct connection is IPv6-only on the free tier. Change the scheme to `postgresql+psycopg://`.
3. Keep it out of git. For example, store it in `backend/.env.production`, or switch `backend/.env` when you run against prod.
4. Run `DATABASE_URL=<prod> just backend-migrate`.

## Notes

- A run against prod should be a deliberate act. Keep local as the default `.env`.
- Free tier pauses after about 7 days without activity. Restore the project from the dashboard when that happens.
