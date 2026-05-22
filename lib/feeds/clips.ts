import { cache } from "react";
import { CLIP_FEED_META } from "@/lib/anilist/constants";
import { fetchAnimeMediaList } from "@/lib/anilist/client";
import { toAnimeCards } from "@/lib/anilist/transform";
import type { TrendingClipCard } from "@/lib/anilist/types";
import { CLIPS_FEED_PAGE_SIZE } from "./constants";

export type ClipsFeedPage = {
  items: TrendingClipCard[];
  page: number;
  hasMore: boolean;
};

function buildClipsFromAnime(
  animeList: ReturnType<typeof toAnimeCards>,
  page: number,
  perPage: number,
): TrendingClipCard[] {
  return animeList.map((anime, index) => {
    const globalIndex = (page - 1) * perPage + index;
    const meta = CLIP_FEED_META[globalIndex % CLIP_FEED_META.length];
    return {
      id: `clip-${anime.id}-${globalIndex}`,
      anime,
      creator: meta.creator,
      displayTitle: `${anime.title} ${meta.suffix}`,
      views: meta.views,
      likes: meta.likes,
      tag: meta.tag,
    };
  });
}

export const getHomeClipsFeedPage = cache(
  async (
    page = 1,
    perPage = CLIPS_FEED_PAGE_SIZE,
  ): Promise<ClipsFeedPage> => {
    try {
      const media = await fetchAnimeMediaList({
        page,
        perPage,
        sort: "TRENDING_DESC",
      });
      const animeList = toAnimeCards(media);

      return {
        items: buildClipsFromAnime(animeList, page, perPage),
        page,
        hasMore: media.length >= perPage,
      };
    } catch {
      return { items: [], page, hasMore: false };
    }
  },
);
