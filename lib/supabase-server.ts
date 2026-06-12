import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client built from env. The publishable/anon key is
// INSERT-only on public.invitation_requests (RLS) and cannot read rows, so it
// is safe to use here. Real values come from the deploy environment — never
// committed. No session persistence: every request is a fresh anon insert.
export function getSupabaseServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase env not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
