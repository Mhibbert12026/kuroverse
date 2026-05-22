import { avatarForCreator } from "@/lib/images";
import { FALLBACK_COVER } from "@/lib/anilist/constants";
import type { CommunityRegistryEntry } from "./registry";
import { buildDiscussionThreads } from "./discussion.mock";
import { buildCommunityClips as buildClipsFromMock } from "./clips.mock";
import type {
  CommunityClip,
  CommunityStats,
  CommunityThread,
  CommunityThreadCategory,
} from "./types";

function hashSeed(slug: string, salt: string): number {
  let h = 0;
  const s = slug + salt;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const CATEGORY_META: Record<
  CommunityThreadCategory,
  { label: string; color: string }
> = {
  discussion: { label: "Discussion", color: "bg-white/10 text-white/70" },
  theory: { label: "Fan Theory", color: "bg-accent-purple/20 text-accent-purple" },
  episode: { label: "Episode", color: "bg-accent-cyan/20 text-accent-cyan" },
  manga: { label: "Manga", color: "bg-accent-pink/20 text-accent-pink" },
  trending: { label: "Trending", color: "bg-accent-orange/20 text-accent-orange" },
};

export function getThreadCategoryStyle(category: CommunityThreadCategory) {
  return CATEGORY_META[category];
}

const CONTRIBUTORS = [
  "ShadowMonarch",
  "MageArchive",
  "DevilHunterTV",
  "CursedEnergy",
] as const;

export function buildCommunityThreads(entry: CommunityRegistryEntry): CommunityThread[] {
  return buildDiscussionThreads(entry);
}

export function buildCommunityClips(
  entry: CommunityRegistryEntry,
  coverUrl: string,
): CommunityClip[] {
  return buildClipsFromMock(entry, coverUrl);
}

export function buildCommunityStats(entry: CommunityRegistryEntry): CommunityStats {
  const seed = hashSeed(entry.slug, "stats");
  return {
    online: entry.online,
    members: entry.members,
    postsToday: 180 + (seed % 420),
    trendingTopics: entry.trendingTopics,
    topContributors: CONTRIBUTORS.map((name, i) => ({
      name,
      avatarUrl: avatarForCreator(name),
      posts: 120 + (hashSeed(entry.slug, `contrib-${i}`) % 400),
    })),
  };
}

export { buildCommunitySidebar, getSidebarRegistryRows } from "./sidebar.mock";

export { FALLBACK_COVER };
