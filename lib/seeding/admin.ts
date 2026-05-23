import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/session";
import { getAdminEmails } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function isModerator(userId?: string, email?: string | null): Promise<boolean> {
  const envEmails = getAdminEmails();
  if (email && envEmails.includes(email.toLowerCase())) return true;

  if (!isSupabaseConfigured()) return envEmails.length > 0;

  const id = userId ?? (await getUser())?.id;
  if (!id) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("is_moderator")
    .eq("id", id)
    .maybeSingle();

  return Boolean(data?.is_moderator);
}

export async function requireModerator(): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in required." };

  const allowed = await isModerator(user.id, user.email);
  if (!allowed) return { ok: false, error: "Moderator access required." };

  return { ok: true, userId: user.id };
}
