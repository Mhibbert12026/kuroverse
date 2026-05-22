import type { CommunityAccent } from "./types";

/** Core community record used across the platform (mock + future API). */
export type AnimeCommunity = {
  id: string;
  slug: string;
  title: string;
  description: string;
  bannerImage: string;
  /** Square cover for cards / hero (optional; falls back to banner). */
  coverImage: string;
  memberCount: number;
  onlineCount: number;
  tags: string[];
  trendingTopics: string[];
  /** AniList media ID for live artwork enrichment. */
  anilistId: number;
  accent: CommunityAccent;
};

export function formatMemberCount(count: number): string {
  if (count >= 1_000_000) {
    const v = count / 1_000_000;
    return v >= 10 ? `${Math.round(v)}M` : `${v.toFixed(1)}M`;
  }
  if (count >= 1_000) {
    const v = count / 1_000;
    return v >= 100 ? `${Math.round(v)}K` : `${v.toFixed(1)}K`;
  }
  return count.toLocaleString();
}

export function getCommunityBySlug(
  communities: readonly AnimeCommunity[],
  slug: string,
): AnimeCommunity | undefined {
  return communities.find((c) => c.slug === slug);
}

export function getCommunityById(
  communities: readonly AnimeCommunity[],
  id: string,
): AnimeCommunity | undefined {
  return communities.find((c) => c.id === id);
}
