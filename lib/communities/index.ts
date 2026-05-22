import { cache } from "react";
import { getAnimeDetail } from "@/lib/anilist/detail";
import { getCommunityPosts } from "@/lib/community-posts/queries";
import { categorizeThreadsForChannels, postToThread } from "@/lib/community-posts/row";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  buildCommunityClips,
  buildCommunitySidebar,
  buildCommunityStats,
  buildCommunityThreads,
  FALLBACK_COVER,
} from "./mock";
import {
  COMMUNITY_REGISTRY,
  COMMUNITY_SLUGS,
  getRegistryEntry,
  isCommunitySlug,
  type CommunitySlug,
} from "./registry";
import type { CommunityPageData } from "./types";

export {
  COMMUNITY_SLUGS,
  FEATURED_COMMUNITY_SLUGS,
  isCommunitySlug,
  getRegistryEntry,
  getAllCommunities,
  MOCK_COMMUNITIES,
  MOCK_COMMUNITIES_BY_SLUG,
  type CommunitySlug,
  type FeaturedCommunitySlug,
  type AnimeCommunity,
} from "./registry";
export { getCommunitySlugForAnime } from "./resolve-community";
export type { CommunityPageData, CommunityThread, CommunityClip, CommunitySidebarData } from "./types";
export { getThreadCategoryStyle } from "./mock";
export { buildDiscussionThreads } from "./discussion.mock";
export { buildCommunityClips } from "./clips.mock";

export const getCommunityPage = cache(
  async (slug: string): Promise<CommunityPageData | null> => {
    if (!isCommunitySlug(slug)) return null;

    const entry = getRegistryEntry(slug);

    let coverUrl = entry.coverImage || FALLBACK_COVER;
    let bannerUrl: string | null = entry.bannerImage;
    let title = entry.title;
    let accentColor: string | null = null;

    try {
      const anime = await getAnimeDetail(entry.anilistId);
      if (anime) {
        coverUrl = anime.coverUrl || coverUrl;
        bannerUrl = anime.bannerUrl || bannerUrl;
        title = anime.title;
        accentColor = anime.accentColor;
      }
    } catch {
      /* AniList enriches mock banners when available */
    }

    const allSlugs = COMMUNITY_SLUGS.map((s) => {
      const e = COMMUNITY_REGISTRY[s];
      return {
        slug: s,
        name: e.title,
        members: e.members,
        online: e.online,
        accent: e.accent,
        coverUrl: e.coverImage,
      };
    });

    const mockThreads = buildCommunityThreads(entry);
    const livePosts = isSupabaseConfigured()
      ? await getCommunityPosts(entry.slug)
      : [];
    const liveThreads = livePosts.map(postToThread);
    const threads = [...liveThreads, ...mockThreads];
    const discussions = categorizeThreadsForChannels(threads);

    return {
      slug: entry.slug,
      anilistId: entry.anilistId,
      title,
      description: entry.description,
      accent: entry.accent,
      members: entry.members,
      online: entry.online,
      bannerUrl,
      coverUrl,
      accentColor,
      threads,
      discussions,
      clips: buildCommunityClips(entry, coverUrl),
      stats: buildCommunityStats(entry),
      sidebar: buildCommunitySidebar(entry, allSlugs, {
        anilistId: entry.anilistId,
        title,
        coverUrl,
        accent: entry.accent,
      }),
    };
  },
);
