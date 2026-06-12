import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let publicClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL.");
  }
  return url;
}

/** Public reads (anon key, RLS select policies). */
export function getSupabase(): SupabaseClient {
  if (publicClient) return publicClient;

  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  publicClient = createClient(getSupabaseUrl(), key);
  return publicClient;
}

/** Server-only writes (bypasses RLS after API validation). */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "Comment writes require SUPABASE_SERVICE_ROLE_KEY (server-only, never NEXT_PUBLIC_).",
    );
  }

  adminClient = createClient(getSupabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
