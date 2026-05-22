import { cache } from "react";
import { fetchAnimeMediaList } from "@/lib/anilist/client";
import { toAnimeCards } from "@/lib/anilist/transform";
import type { AnimeCard } from "@/lib/anilist/types";
import { TRENDING_FEED_PAGE_SIZE } from "./constants";

export type AnimeFeedPage = {
  items: AnimeCard[];
  page: number;
  hasMore: boolean;
};

export const getTrendingFeedPage = cache(
  async (
    page = 1,
    perPage = TRENDING_FEED_PAGE_SIZE,
  ): Promise<AnimeFeedPage> => {
    try {
      const media = await fetchAnimeMediaList({
        page,
        perPage,
        sort: "TRENDING_DESC",
      });
      const startRank = (page - 1) * perPage + 1;
      const items = toAnimeCards(media, { withRank: true }).map((card, index) => ({
        ...card,
        rank: startRank + index,
      }));

      return {
        items,
        page,
        hasMore: media.length >= perPage,
      };
    } catch {
      return { items: [], page, hasMore: false };
    }
  },
);
