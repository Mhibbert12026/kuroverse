import { getRegistryEntry, isCommunitySlug } from "@/lib/communities/registry";
import { FEATURED_FANDOM_META } from "@/lib/anilist/constants";
import type { AniListMedia } from "@/lib/anilist/types";
import type { SeedContext } from "./types";

function hashSeed(...parts: (string | number)[]): number {
  const s = parts.join(":");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function slugForAnimeId(animeId: number): string {
  const meta = FEATURED_FANDOM_META[animeId as keyof typeof FEATURED_FANDOM_META];
  if (meta) return meta.slug;
  return "jujutsu-kaisen";
}

export function communityTitle(slug: string): string {
  if (isCommunitySlug(slug)) return getRegistryEntry(slug).title;
  return slug.replace(/-/g, " ");
}

export function buildSeedContext(media: AniListMedia, communitySlug?: string): SeedContext {
  const slug = communitySlug ?? slugForAnimeId(media.id);
  const title =
    media.title?.english || media.title?.romaji || "this series";
  const genres =
    media.genres?.slice(0, 3).join(" · ") || "anime";
  const episodes = media.episodes ?? 24;
  const seed = hashSeed(media.id, new Date().toISOString().slice(0, 10));
  const episode = 1 + (seed % Math.min(episodes, 24));

  return {
    animeTitle: title,
    animeId: media.id,
    communitySlug: slug,
    communityTitle: communityTitle(slug),
    genres,
    episode,
    episodeMax: episodes,
    rating: media.averageScore ? `${media.averageScore}%` : "—",
    status: media.status?.replace(/_/g, " ").toLowerCase() ?? "airing",
  };
}

export function contextVars(ctx: SeedContext, extra?: Record<string, string>): Record<string, string> {
  return {
    anime: ctx.animeTitle,
    community: ctx.communityTitle,
    genres: ctx.genres,
    episode: String(ctx.episode),
    rating: ctx.rating,
    status: ctx.status,
    ...extra,
  };
}
