import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { FALLBACK_COVER } from "@/lib/anilist/constants";
import { getRegistryEntry, isCommunitySlug } from "@/lib/communities/registry";
import type { CommunityAccent } from "@/lib/communities/types";

export type JoinedFandom = {
  slug: string;
  title: string;
  coverUrl: string;
  accent: CommunityAccent;
  joinedAt: string;
};

export async function getJoinedFandomsForUser(
  userId: string,
  limit = 12,
): Promise<JoinedFandom[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_subscriptions")
    .select("community_slug, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const fandoms: JoinedFandom[] = [];

  for (const row of data) {
    const slug = String(row.community_slug);
    if (!isCommunitySlug(slug)) continue;
    const entry = getRegistryEntry(slug);
    fandoms.push({
      slug,
      title: entry.title,
      coverUrl: entry.coverImage || FALLBACK_COVER,
      accent: entry.accent,
      joinedAt: String(row.created_at),
    });
  }

  return fandoms;
}
