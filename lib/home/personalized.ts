import { cache } from "react";
import { fetchAnimeByIds, fetchAnimeMediaList } from "@/lib/anilist/client";
import { toAnimeCards } from "@/lib/anilist/transform";
import { getFavoritesForUser } from "@/lib/favorites/queries";
import { getWatchlistEntries } from "@/lib/watchlist/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getRecommendationsFeedPage } from "@/lib/feeds/recommendations";
import type { HomePersonalizedPage } from "./types";

const PAGE_SIZE = 6;

export const getPersonalizedRecommendations = cache(
  async (userId: string, page = 1): Promise<HomePersonalizedPage> => {
    if (!isSupabaseConfigured()) {
      const fallback = await getRecommendationsFeedPage(page, PAGE_SIZE);
      return {
        items: fallback.items,
        page: fallback.page,
        hasMore: fallback.hasMore,
        label: "For you",
      };
    }

    const [favorites, watchlist] = await Promise.all([
      getFavoritesForUser(userId, 12),
      getWatchlistEntries(userId),
    ]);

    const seedIds = [
      ...favorites.map((f) => f.animeId),
      ...watchlist.slice(0, 6).map((w) => w.animeId),
    ];
    const uniqueIds = [...new Set(seedIds)].slice(0, 8);

    if (uniqueIds.length === 0) {
      const fallback = await getRecommendationsFeedPage(page, PAGE_SIZE);
      return {
        items: fallback.items,
        page: fallback.page,
        hasMore: fallback.hasMore,
        label: "Trending for you",
      };
    }

    try {
      const [seedMedia, trendingMedia] = await Promise.all([
        fetchAnimeByIds(uniqueIds),
        fetchAnimeMediaList({
          page,
          perPage: PAGE_SIZE + uniqueIds.length,
          sort: "TRENDING_DESC",
        }),
      ]);

      const seedSet = new Set(uniqueIds);
      const extra = trendingMedia.filter((m) => !seedSet.has(m.id));
      const combined = [...seedMedia, ...extra].slice(0, PAGE_SIZE + (page - 1) * PAGE_SIZE);
      const start = (page - 1) * PAGE_SIZE;
      const slice = combined.slice(start, start + PAGE_SIZE);

      const label =
        favorites.length > 0
          ? "Based on your favorites & watchlist"
          : "Based on your watchlist";

      return {
        items: toAnimeCards(slice, { matchFromScore: true }),
        page,
        hasMore: combined.length > start + PAGE_SIZE,
        label,
      };
    } catch {
      const fallback = await getRecommendationsFeedPage(page, PAGE_SIZE);
      return {
        items: fallback.items,
        page: fallback.page,
        hasMore: fallback.hasMore,
        label: "For you",
      };
    }
  },
);
