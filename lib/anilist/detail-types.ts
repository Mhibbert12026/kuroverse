import type { AnimeDisplayStatus, MediaStatus } from "./types";

export type AniListBannerImage = {
  extraLarge: string | null;
  large: string | null;
  color: string | null;
};

export type AniListTrailer = {
  id: string | null;
  site: string | null;
};

export type AniListMediaDetail = {
  id: number;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };
  description: string | null;
  coverImage: {
    extraLarge: string | null;
    large: string | null;
    medium: string | null;
    color: string | null;
  } | null;
  bannerImage: string | AniListBannerImage | null;
  genres: string[];
  averageScore: number | null;
  episodes: number | null;
  status: MediaStatus | null;
  popularity: number | null;
  format: string | null;
  seasonYear: number | null;
  trailer: AniListTrailer | null;
};

export type AniListMediaDetailResponse = {
  Media: AniListMediaDetail | null;
};

export type AniListGraphQLDetailResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

export type AnimeDetail = {
  id: number;
  title: string;
  nativeTitle: string | null;
  synopsis: string;
  coverUrl: string;
  bannerUrl: string | null;
  bannerColor: string | null;
  genres: string[];
  genresLabel: string;
  rating: string;
  ratingValue: number | null;
  popularityLabel: string;
  popularity: number | null;
  episodesLabel: string;
  episodes: number | null;
  status: AnimeDisplayStatus;
  format: string | null;
  seasonYear: number | null;
  trailerEmbedUrl: string | null;
  accentColor: string | null;
};
