"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getUser } from "@/lib/auth/session";
import { isUsernameAvailable } from "./queries";
import { normalizeUsername, validateUsername } from "./username";

export type ProfileActionResult = {
  ok: boolean;
  error?: string;
};

function cleanText(value: FormDataEntryValue | null, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLen);
}

export async function completeOnboardingAction(formData: FormData): Promise<ProfileActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const usernameError = validateUsername(username);
  if (usernameError) return { ok: false, error: usernameError };

  const available = await isUsernameAvailable(username, user.id);
  if (!available) return { ok: false, error: "That username is already taken." };

  const display_name = cleanText(formData.get("display_name"), 48);
  const bio = cleanText(formData.get("bio"), 280);
  const favorite_anime = cleanText(formData.get("favorite_anime"), 120);
  const avatar_url = cleanText(formData.get("avatar_url"), 2048);

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      display_name: display_name ?? displayNameFallback(user.email),
      bio,
      favorite_anime,
      avatar_url,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/u/${username}`);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateProfileAction(formData: FormData): Promise<ProfileActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const display_name = cleanText(formData.get("display_name"), 48);
  const bio = cleanText(formData.get("bio"), 280);
  const favorite_anime = cleanText(formData.get("favorite_anime"), 120);
  const avatar_url = cleanText(formData.get("avatar_url"), 2048);

  const supabase = await createClient();
  const { data: existing } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name,
      bio,
      favorite_anime,
      ...(avatar_url !== null ? { avatar_url } : {}),
    })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };

  if (existing?.username) {
    revalidatePath(`/u/${existing.username}`);
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

function displayNameFallback(email: string | undefined): string {
  return email?.split("@")[0] ?? "Member";
}
