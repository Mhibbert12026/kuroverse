import { cache } from "react";
import { fetchAnimeMediaList } from "@/lib/anilist/client";
import { toAnimeCards } from "@/lib/anilist/transform";
import { RECOMMENDATIONS_FEED_PAGE_SIZE } from "./constants";
import type { AnimeFeedPage } from "./trending";

export const getRecommendationsFeedPage = cache(
  async (
    page = 1,
    perPage = RECOMMENDATIONS_FEED_PAGE_SIZE,
  ): Promise<AnimeFeedPage> => {
    try {
      const media = await fetchAnimeMediaList({
        page,
        perPage,
        sort: "SCORE_DESC",
      });

      return {
        items: toAnimeCards(media, { matchFromScore: true }),
        page,
        hasMore: media.length >= perPage,
      };
    } catch {
      return { items: [], page, hasMore: false };
    }
  },
);
