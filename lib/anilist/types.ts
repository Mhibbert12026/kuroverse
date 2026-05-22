/** AniList GraphQL API types (subset used by this app). */

export type MediaStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export type MediaSort =
  | "TRENDING_DESC"
  | "POPULARITY_DESC"
  | "SCORE_DESC";

export type AniListMediaTitle = {
  romaji: string | null;
  english: string | null;
};

export type AniListCoverImage = {
  extraLarge: string | null;
  large: string | null;
  medium: string | null;
  color: string | null;
};

export type AniListMedia = {
  id: number;
  title: AniListMediaTitle;
  coverImage: AniListCoverImage | null;
  genres: string[];
  averageScore: number | null;
  episodes: number | null;
  status: MediaStatus | null;
  popularity: number | null;
};

export type AniListPageResponse = {
  Page: {
    media: AniListMedia[] | null;
  } | null;
};

export type AniListGraphQLResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

export type AnimeDisplayStatus = "Airing" | "Hot" | "New" | "Completed";

/** Unified anime card used across all homepage sections. */
export type AnimeCard = {
  id: number;
  title: string;
  coverUrl: string;
  genres: string;
  rating: string;
  ratingValue: number | null;
  popularityLabel: string;
  popularity: number | null;
  status: AnimeDisplayStatus;
  episodesLabel: string;
  accentColor: string | null;
  accentClass: string;
  rank?: number;
  matchPercent?: number;
};

export type FeaturedCommunityCard = AnimeCard & {
  slug: string;
  description: string;
  accent: "orange" | "cyan" | "emerald" | "gold" | "purple";
  members: string;
  online: number;
};

export type TrendingClipCard = {
  id: string;
  anime: AnimeCard;
  creator: string;
  displayTitle: string;
  views: string;
  likes: string;
  tag: string;
};

export type HomepageAnimeData = {
  hero: AnimeCard;
  trending: AnimeCard[];
  recommendations: AnimeCard[];
  clips: TrendingClipCard[];
  featuredCommunities: FeaturedCommunityCard[];
  error: string | null;
};

export type TrendingBundle = {
  hero: AnimeCard;
  trending: AnimeCard[];
  clips: TrendingClipCard[];
  error: string | null;
};

export type RecommendationsBundle = {
  recommendations: AnimeCard[];
  error: string | null;
};

export type FeaturedBundle = {
  featuredCommunities: FeaturedCommunityCard[];
  error: string | null;
};

/** @deprecated Use AnimeCard */
export type TrendingAnimeCard = AnimeCard;
