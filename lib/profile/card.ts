import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { profileFromRow } from "@/lib/auth/profile";
import { normalizeUsername } from "./username";
import { getProfileStats } from "./stats";

export type ProfileCardData = {
  id: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  favoriteAnime: string | null;
  memberSince: string;
  stats: {
    favoriteCount: number;
    watchlistCount: number;
    fandomCount: number;
    followerCount: number;
  };
  profileHref: string;
};

export async function getProfileCardByUsername(
  username: string,
): Promise<ProfileCardData | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const normalized = normalizeUsername(username);
  if (!normalized) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", normalized)
    .maybeSingle();

  if (error || !data) return null;
  const profile = profileFromRow(data);
  if (!profile.onboarding_completed || !profile.username) return null;

  return buildCard(profile);
}

export async function getProfileCardByUserId(userId: string): Promise<ProfileCardData | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (error || !data) return null;
  const profile = profileFromRow(data);
  if (!profile.onboarding_completed || !profile.username) return null;

  return buildCard(profile);
}

async function buildCard(
  profile: ReturnType<typeof profileFromRow>,
): Promise<ProfileCardData> {
  const stats = await getProfileStats(profile.id);

  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name ?? profile.username ?? "Member",
    avatarUrl: profile.avatar_url,
    bio: profile.bio,
    favoriteAnime: profile.favorite_anime,
    memberSince: profile.created_at,
    stats: {
      favoriteCount: stats.favoriteCount,
      watchlistCount: stats.watchlistCount,
      fandomCount: stats.fandomCount,
      followerCount: stats.followerCount,
    },
    profileHref: profile.username ? `/u/${profile.username}` : "/",
  };
}
