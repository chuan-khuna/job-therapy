import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client. Only for "use client" code. The publishable
// key is browser-safe because RLS gates every row.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
