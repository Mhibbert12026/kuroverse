import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { avatarFromUser, displayNameFromUser, profileFromRow } from "./profile";
import type { UserProfile } from "./types";

export async function getUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return profileFromRow(data);
}

/** Ensures a profile row exists (fallback if DB trigger did not run). */
export async function ensureProfile(user: User): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const existing = await getProfile(user.id);
  if (existing) return existing;

  const supabase = await createClient();
  const payload = {
    id: user.id,
    display_name: displayNameFromUser(user),
    avatar_url: avatarFromUser(user),
    onboarding_completed: false,
  };

  const { data, error } = await supabase.from("profiles").upsert(payload).select().single();

  if (error || !data) return null;
  return profileFromRow(data);
}
