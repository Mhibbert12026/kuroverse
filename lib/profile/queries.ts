import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { profileFromRow } from "@/lib/auth/profile";
import type { UserProfile } from "@/lib/auth/types";
import { normalizeUsername } from "./username";

export async function getProfileByUsername(username: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const normalized = normalizeUsername(username);
  if (!normalized) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", normalized)
    .maybeSingle();

  if (error || !data) return null;
  const profile = profileFromRow(data);
  if (!profile.onboarding_completed || !profile.username) return null;
  return profile;
}

export async function isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const normalized = normalizeUsername(username);
  if (!normalized) return false;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalized)
    .maybeSingle();

  if (error) return false;
  if (!data) return true;
  if (excludeUserId && data.id === excludeUserId) return true;
  return false;
}
