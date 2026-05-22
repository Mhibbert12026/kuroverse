import { avatarForCreator } from "@/lib/images";
import { CLIP_FEED_META } from "@/lib/anilist/constants";
import type { CommunityRegistryEntry } from "./registry";
import type { CommunityClip } from "./types";

function hashSeed(slug: string, salt: string): number {
  let h = 0;
  const s = slug + salt;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${s.toString().padStart(2, "0")}` : `0:${s.toString().padStart(2, "0")}`;
}

const DURATIONS_SEC = [18, 32, 45, 58, 72, 89, 104, 128, 156, 184];

const CLIP_TITLES = [
  "insane fight choreography edit",
  "emotional OST sync AMV",
  "funniest moments compilation",
  "4K sakuga breakdown",
  "opening recreated in HD",
] as const;

/** Build trending clip placeholders for a community page. */
export function buildCommunityClips(
  entry: CommunityRegistryEntry,
  coverUrl: string,
): CommunityClip[] {
  return CLIP_FEED_META.map((meta, i) => {
    const seed = hashSeed(entry.slug, `clip-${i}`);
    const durationSeconds = DURATIONS_SEC[i] ?? 60;
    const titleSuffix = CLIP_TITLES[i % CLIP_TITLES.length];
    return {
      id: `${entry.slug}-clip-${i}`,
      title: `${entry.title} — ${titleSuffix}`,
      creator: meta.creator,
      avatarUrl: avatarForCreator(meta.creator),
      coverUrl,
      duration: formatDuration(durationSeconds),
      durationSeconds,
      views: meta.views,
      likes: meta.likes,
      comments: 40 + (seed % 280),
      shares: `${(seed % 90) + 10}K`,
      tag: meta.tag,
      rank: i + 1,
    };
  });
}
