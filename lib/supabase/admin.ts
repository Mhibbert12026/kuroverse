import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";

export function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

export function isServiceRoleConfigured(): boolean {
  return Boolean(getServiceRoleKey() && process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function createAdminClient() {
  const key = getServiceRoleKey();
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }
  return createClient(getSupabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSeedUserId(): string | null {
  return process.env.KUROVERSE_SEED_USER_ID ?? null;
}

export function getAdminEmails(): string[] {
  const raw = process.env.KUROVERSE_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getCronSecret(): string | null {
  return process.env.CRON_SECRET ?? null;
}
