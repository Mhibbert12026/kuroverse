import { cache } from "react";
import { fetchAnimeMediaList } from "@/lib/anilist/client";
import { buildDiscoverClips } from "./build";
import type { DiscoverFeedPage } from "./types";

export const DISCOVER_PAGE_SIZE = 8;

export const getDiscoverFeedPage = cache(
  async (page = 1, perPage = DISCOVER_PAGE_SIZE): Promise<DiscoverFeedPage> => {
    try {
      const media = await fetchAnimeMediaList({
        page,
        perPage,
        sort: "TRENDING_DESC",
      });

      return {
        clips: buildDiscoverClips(media, page, perPage),
        page,
        hasMore: media.length >= perPage,
      };
    } catch {
      return { clips: [], page, hasMore: false };
    }
  },
);
