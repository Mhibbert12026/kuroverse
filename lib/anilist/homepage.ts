import { cache } from "react";
import {
  CLIP_FEED_META,
  FALLBACK_COVER,
  FEATURED_FANDOM_IDS,
  FEATURED_FANDOM_META,
} from "./constants";
import { fetchAnimeByIds, fetchAnimeMediaList } from "./client";
import { toAnimeCard, toAnimeCards } from "./transform";
import type {
  AnimeCard,
  FeaturedBundle,
  FeaturedCommunityCard,
  HomepageAnimeData,
  RecommendationsBundle,
  TrendingBundle,
  TrendingClipCard,
} from "./types";

function formatFandomTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function createPlaceholderCard(id: number, slug: string, index: number): AnimeCard {
  return {
    id,
    title: formatFandomTitle(slug),
    coverUrl: FALLBACK_COVER,
    genres: "Anime",
    rating: "—",
    ratingValue: null,
    popularityLabel: "—",
    popularity: null,
    status: "Hot",
    episodesLabel: "—",
    accentColor: null,
    accentClass: "from-violet-600/50 to-indigo-950/90",
    rank: index + 1,
    matchPercent: 80,
  };
}

function buildFeaturedCommunities(
  mediaList: Awaited<ReturnType<typeof fetchAnimeByIds>>,
): FeaturedCommunityCard[] {
  return FEATURED_FANDOM_IDS.map((id, index) => {
    const media = mediaList.find((m) => m.id === id);
    const meta = FEATURED_FANDOM_META[id];
    const anime = media
      ? toAnimeCard(media, { index })
      : createPlaceholderCard(id, meta.slug, index);

    return {
      ...anime,
      slug: meta.slug,
      description: meta.description,
      accent: meta.accent,
      members: meta.members,
      online: meta.online,
      title:
        anime.title === "Unknown Anime" ? formatFandomTitle(meta.slug) : anime.title,
    };
  });
}

function buildClips(trending: AnimeCard[]): TrendingClipCard[] {
  if (!trending.length) return [];

  const cards: TrendingClipCard[] = [];
  for (let index = 0; index < CLIP_FEED_META.length; index++) {
    const meta = CLIP_FEED_META[index];
    const anime = trending[index] ?? trending[0];
    cards.push({
      id: `clip-${anime.id}-${index}`,
      anime,
      creator: meta.creator,
      displayTitle: `${anime.title} ${meta.suffix}`,
      views: meta.views,
      likes: meta.likes,
      tag: meta.tag,
    });
  }
  return cards;
}

function ensureHero(trending: AnimeCard[]): AnimeCard {
  if (trending[0]) return { ...trending[0], rank: 1 };
  return createPlaceholderCard(0, "featured", 0);
}

/** Trending + hero + clips (single AniList trending request). */
export const getTrendingBundle = cache(async (): Promise<TrendingBundle> => {
  try {
    const trendingMedia = await fetchAnimeMediaList({ perPage: 12, sort: "TRENDING_DESC" });
    const trending = toAnimeCards(trendingMedia, { withRank: true });
    return {
      hero: ensureHero(trending),
      trending,
      clips: buildClips(trending),
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load trending anime";
    const placeholder = createPlaceholderCard(0, "featured", 0);
    return {
      hero: placeholder,
      trending: [],
      clips: [],
      error: message,
    };
  }
});

/** Top-rated recommendations (separate AniList request). */
export const getRecommendationsBundle = cache(async (): Promise<RecommendationsBundle> => {
  try {
    const [trendingMedia, popularMedia] = await Promise.all([
      fetchAnimeMediaList({ perPage: 12, sort: "TRENDING_DESC" }),
      fetchAnimeMediaList({ perPage: 6, sort: "SCORE_DESC" }),
    ]);
    const popularIds = new Set(trendingMedia.map((m) => m.id));
    const recommendationMedia = popularMedia.filter((m) => !popularIds.has(m.id)).slice(0, 4);
    const recommendations = toAnimeCards(
      recommendationMedia.length >= 4 ? recommendationMedia : popularMedia.slice(0, 4),
      { matchFromScore: true },
    );
    return { recommendations, error: null };
  } catch (error) {
    return {
      recommendations: [],
      error:
        error instanceof Error ? error.message : "Unable to load recommendations",
    };
  }
});

/** Legendary fandom covers by AniList media ID. */
export const getFeaturedBundle = cache(async (): Promise<FeaturedBundle> => {
  try {
    const featuredMedia = await fetchAnimeByIds([...FEATURED_FANDOM_IDS]);
    return {
      featuredCommunities: buildFeaturedCommunities(featuredMedia),
      error: null,
    };
  } catch (error) {
    return {
      featuredCommunities: buildFeaturedCommunities([]),
      error:
        error instanceof Error ? error.message : "Unable to load community artwork",
    };
  }
});

/** Full homepage payload (used when a single fetch is preferred). */
export const getHomepageAnimeData = cache(async (): Promise<HomepageAnimeData> => {
  const [trendingBundle, recommendationsBundle, featuredBundle] = await Promise.all([
    getTrendingBundle(),
    getRecommendationsBundle(),
    getFeaturedBundle(),
  ]);

  const error =
    trendingBundle.error ?? recommendationsBundle.error ?? featuredBundle.error ?? null;

  return {
    hero: trendingBundle.hero,
    trending: trendingBundle.trending,
    clips: trendingBundle.clips,
    recommendations: recommendationsBundle.recommendations,
    featuredCommunities: featuredBundle.featuredCommunities,
    error,
  };
});
