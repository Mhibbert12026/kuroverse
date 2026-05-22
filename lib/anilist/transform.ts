import { FALLBACK_COVER } from "./constants";
import type { AniListMedia, AnimeCard, AnimeDisplayStatus } from "./types";

const ACCENT_FALLBACKS = [
  "from-violet-600/50 to-indigo-950/90",
  "from-emerald-500/45 to-teal-950/90",
  "from-amber-500/45 to-blue-950/90",
  "from-blue-500/45 to-violet-950/90",
  "from-rose-400/40 to-indigo-950/90",
  "from-red-600/45 to-stone-950/90",
  "from-fuchsia-500/40 to-purple-950/90",
  "from-cyan-500/40 to-slate-950/90",
];

export function displayTitle(media: AniListMedia): string {
  const title = media.title.english || media.title.romaji;
  return title?.trim() || "Unknown Anime";
}

export function formatRating(score: number | null): string {
  if (score == null || score === 0) return "—";
  return (score / 10).toFixed(1);
}

export function formatGenres(genres: string[]): string {
  if (!genres.length) return "Anime";
  return genres.slice(0, 3).join(" · ");
}

export function mapStatus(status: AniListMedia["status"]): AnimeDisplayStatus {
  switch (status) {
    case "RELEASING":
    case "HIATUS":
      return "Airing";
    case "NOT_YET_RELEASED":
      return "New";
    case "FINISHED":
      return "Completed";
    default:
      return "Hot";
  }
}

function formatEpisodes(media: AniListMedia): string {
  if (media.episodes != null) return `${media.episodes} episodes`;
  if (media.status === "RELEASING") return "Ongoing";
  if (media.status === "NOT_YET_RELEASED") return "Upcoming";
  return "—";
}

export function formatPopularity(popularity: number | null): string {
  if (popularity == null) return "—";
  if (popularity >= 1_000_000) return `${(popularity / 1_000_000).toFixed(1)}M fans`;
  if (popularity >= 1_000) return `${Math.round(popularity / 1_000)}K fans`;
  return `${popularity} fans`;
}

export function pickCoverUrl(media: AniListMedia): string {
  const cover = media.coverImage;
  if (!cover) return FALLBACK_COVER;
  return cover.extraLarge || cover.large || cover.medium || FALLBACK_COVER;
}

export function accentClass(index: number): string {
  return ACCENT_FALLBACKS[index % ACCENT_FALLBACKS.length];
}

export function computeMatchPercent(score: number | null): number {
  if (score == null || score === 0) return 75;
  return Math.min(99, Math.max(70, Math.round(score * 0.95)));
}

type CardOptions = {
  rank?: number;
  index?: number;
  matchPercent?: number;
};

/** Always returns a complete card — never null. */
export function toAnimeCard(media: AniListMedia, options: CardOptions = {}): AnimeCard {
  const index = options.index ?? 0;
  const ratingValue = media.averageScore;

  return {
    id: media.id,
    title: displayTitle(media),
    coverUrl: pickCoverUrl(media),
    genres: formatGenres(media.genres),
    rating: formatRating(ratingValue),
    ratingValue,
    popularityLabel: formatPopularity(media.popularity),
    popularity: media.popularity,
    status: mapStatus(media.status),
    episodesLabel: formatEpisodes(media),
    accentColor: media.coverImage?.color ?? null,
    accentClass: accentClass(index),
    rank: options.rank,
    matchPercent: options.matchPercent ?? computeMatchPercent(ratingValue),
  };
}

export function toAnimeCards(
  mediaList: AniListMedia[],
  options?: { withRank?: boolean; matchFromScore?: boolean },
): AnimeCard[] {
  return mediaList.map((media, index) =>
    toAnimeCard(media, {
      index,
      rank: options?.withRank ? index + 1 : undefined,
      matchPercent: options?.matchFromScore
        ? computeMatchPercent(media.averageScore)
        : undefined,
    }),
  );
}

/** @deprecated Use toAnimeCard */
export function toTrendingAnimeCard(media: AniListMedia, rank: number): AnimeCard {
  return toAnimeCard(media, { rank, index: rank - 1 });
}
