import { cache } from "react";
import { ANIME_DETAIL_QUERY } from "./queries";
import { FALLBACK_COVER } from "./constants";
import type {
  AniListBannerImage,
  AniListGraphQLDetailResponse,
  AniListMediaDetail,
  AniListMediaDetailResponse,
  AnimeDetail,
} from "./detail-types";
import {
  formatGenres,
  formatPopularity,
  formatRating,
  mapStatus,
} from "./transform";
import { REVALIDATE_SECONDS } from "./constants";

const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co";

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function pickBannerUrl(banner: AniListMediaDetail["bannerImage"]): string | null {
  if (!banner) return null;
  if (typeof banner === "string") return banner;
  const img = banner as AniListBannerImage;
  return img.extraLarge || img.large || null;
}

function pickBannerColor(banner: AniListMediaDetail["bannerImage"]): string | null {
  if (!banner || typeof banner === "string") return null;
  return (banner as AniListBannerImage).color ?? null;
}

function getTrailerEmbed(trailer: AniListMediaDetail["trailer"]): string | null {
  if (!trailer?.id || !trailer.site) return null;
  const id = trailer.id;
  switch (trailer.site.toLowerCase()) {
    case "youtube":
      return `https://www.youtube.com/embed/${id}?rel=0`;
    case "dailymotion":
      return `https://www.dailymotion.com/embed/video/${id}`;
    default:
      return null;
  }
}

function displayTitle(media: AniListMediaDetail): string {
  return media.title.english || media.title.romaji || "Unknown Anime";
}

function pickCoverUrlDetail(media: AniListMediaDetail): string {
  const cover = media.coverImage;
  if (!cover) return FALLBACK_COVER;
  return cover.extraLarge || cover.large || cover.medium || FALLBACK_COVER;
}

function formatEpisodesDetail(episodes: number | null, status: AniListMediaDetail["status"]): string {
  if (episodes != null) return `${episodes} episodes`;
  if (status === "RELEASING") return "Ongoing";
  if (status === "NOT_YET_RELEASED") return "Upcoming";
  return "—";
}

export function toAnimeDetail(media: AniListMediaDetail): AnimeDetail {
  const title = displayTitle(media);
  const rawDescription = media.description ?? "";

  return {
    id: media.id,
    title,
    nativeTitle: media.title.native,
    synopsis: rawDescription ? stripHtml(rawDescription) : "No synopsis available.",
    coverUrl: pickCoverUrlDetail(media),
    bannerUrl: pickBannerUrl(media.bannerImage),
    bannerColor: pickBannerColor(media.bannerImage) ?? media.coverImage?.color ?? null,
    genres: media.genres,
    genresLabel: formatGenres(media.genres),
    rating: formatRating(media.averageScore),
    ratingValue: media.averageScore,
    popularityLabel: formatPopularity(media.popularity),
    popularity: media.popularity,
    episodesLabel: formatEpisodesDetail(media.episodes, media.status),
    episodes: media.episodes,
    status: mapStatus(media.status),
    format: media.format,
    seasonYear: media.seasonYear,
    trailerEmbedUrl: getTrailerEmbed(media.trailer),
    accentColor: media.coverImage?.color ?? pickBannerColor(media.bannerImage),
  };
}

async function fetchMediaDetailRaw(id: number): Promise<AniListMediaDetail | null> {
  const response = await fetch(ANILIST_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: ANIME_DETAIL_QUERY,
      variables: { id },
    }),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`AniList request failed: ${response.status}`);
  }

  const json = (await response.json()) as AniListGraphQLDetailResponse<AniListMediaDetailResponse>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  return json.data?.Media ?? null;
}

export const getAnimeDetail = cache(async (id: number): Promise<AnimeDetail | null> => {
  if (!Number.isFinite(id) || id <= 0) return null;
  const media = await fetchMediaDetailRaw(id);
  if (!media) return null;
  return toAnimeDetail(media);
});
