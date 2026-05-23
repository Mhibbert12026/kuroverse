import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "./types";

export function profileFromRow(row: Record<string, unknown>): UserProfile {
  const username = row.username != null ? String(row.username) : null;
  return {
    id: String(row.id),
    username,
    display_name: row.display_name != null ? String(row.display_name) : null,
    avatar_url: row.avatar_url != null ? String(row.avatar_url) : null,
    bio: row.bio != null ? String(row.bio) : null,
    favorite_anime: row.favorite_anime != null ? String(row.favorite_anime) : null,
    onboarding_completed:
      row.onboarding_completed != null
        ? Boolean(row.onboarding_completed)
        : Boolean(username),
    is_moderator: row.is_moderator != null ? Boolean(row.is_moderator) : false,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function displayNameFromUser(user: User): string {
  const meta = user.user_metadata ?? {};
  const name =
    (meta.full_name as string | undefined) ??
    (meta.name as string | undefined) ??
    (meta.user_name as string | undefined) ??
    user.email?.split("@")[0];
  return name ?? "KuroVerse Member";
}

export function avatarFromUser(user: User): string | null {
  const meta = user.user_metadata ?? {};
  const url = meta.avatar_url ?? meta.picture;
  return typeof url === "string" ? url : null;
}

export function needsProfileOnboarding(profile: UserProfile | null): boolean {
  if (!profile) return false;
  return !profile.onboarding_completed || !profile.username;
}
