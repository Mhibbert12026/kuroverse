import { CLIP_FEED_META } from "@/lib/anilist/constants";
import type { AniListMedia } from "@/lib/anilist/types";
import {
  displayTitle,
  formatRating,
  mapStatus,
  pickCoverUrl,
} from "@/lib/anilist/transform";
import { MOCK_COMMUNITIES } from "@/lib/communities/registry";
import { avatarForCreator } from "@/lib/images";
import type { DiscoverClipItem, DiscoverCommunityTag } from "./types";

const DURATIONS_SEC = [18, 32, 45, 58, 72, 89, 104, 128, 156, 184, 42, 67];

const CLIP_TITLES = [
  "insane fight choreography edit",
  "emotional OST sync AMV",
  "funniest moments compilation",
  "4K sakuga breakdown",
  "opening recreated in HD",
  "domain expansion supercut",
  "villain reveal reaction edit",
  "power scaling debate clip",
] as const;

function hashSeed(id: number, salt: string): number {
  let h = id;
  for (let i = 0; i < salt.length; i++) {
    h = (h * 31 + salt.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `0:${s.toString().padStart(2, "0")}`;
}

function genreTags(genres: string[]): string[] {
  return genres.slice(0, 4).map((g) => `#${g.replace(/\s+/g, "")}`);
}

function resolveCommunity(anilistId: number): DiscoverCommunityTag | null {
  const entry = MOCK_COMMUNITIES.find((c) => c.anilistId === anilistId);
  if (!entry) return null;
  return {
    slug: entry.slug,
    name: entry.title,
    accent: entry.accent,
    tag: entry.tags[0] ?? `#${entry.title.replace(/\s+/g, "")}`,
  };
}

export function buildDiscoverClips(
  mediaList: AniListMedia[],
  page: number,
  perPage: number,
): DiscoverClipItem[] {
  return mediaList.map((media, index) => {
    const globalIndex = (page - 1) * perPage + index;
    const meta = CLIP_FEED_META[globalIndex % CLIP_FEED_META.length];
    const titleSuffix = CLIP_TITLES[globalIndex % CLIP_TITLES.length];
    const seed = hashSeed(media.id, `discover-${globalIndex}`);
    const durationSeconds = DURATIONS_SEC[globalIndex % DURATIONS_SEC.length] ?? 60;
    const title = displayTitle(media);

    return {
      id: `discover-${media.id}-${globalIndex}`,
      animeId: media.id,
      animeTitle: title,
      coverUrl: pickCoverUrl(media),
      displayTitle: `${title} — ${titleSuffix}`,
      creator: meta.creator,
      creatorAvatarUrl: avatarForCreator(meta.creator),
      views: meta.views,
      likes: meta.likes,
      comments: 48 + (seed % 420),
      shares: `${(seed % 120) + 8}K`,
      duration: formatDuration(durationSeconds),
      durationSeconds,
      clipTag: meta.tag,
      animeTags: genreTags(media.genres),
      community: resolveCommunity(media.id),
      accentColor: media.coverImage?.color ?? null,
      rating: formatRating(media.averageScore),
      status: mapStatus(media.status),
    };
  });
}
