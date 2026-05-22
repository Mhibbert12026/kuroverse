import type { CommunityThreadCategory } from "@/lib/communities/types";

export type ThreadCategoryMeta = {
  label: string;
  chipClass: string;
  icon: string;
};

export const THREAD_CATEGORY_META: Record<CommunityThreadCategory, ThreadCategoryMeta> = {
  discussion: {
    label: "Discussion",
    chipClass: "feed-chip feed-chip--discussion",
    icon: "💬",
  },
  theory: {
    label: "Fan Theory",
    chipClass: "feed-chip feed-chip--theory",
    icon: "🧠",
  },
  episode: {
    label: "Episode",
    chipClass: "feed-chip feed-chip--episode",
    icon: "📺",
  },
  manga: {
    label: "Manga",
    chipClass: "feed-chip feed-chip--manga",
    icon: "📖",
  },
  trending: {
    label: "Trending",
    chipClass: "feed-chip feed-chip--trending",
    icon: "🔥",
  },
};

export function getThreadCategoryMeta(category: CommunityThreadCategory): ThreadCategoryMeta {
  return THREAD_CATEGORY_META[category];
}

export const FEED_FILTER_OPTIONS: { id: CommunityThreadCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "trending", label: "Trending" },
  { id: "episode", label: "Episodes" },
  { id: "theory", label: "Theories" },
  { id: "manga", label: "Manga" },
  { id: "discussion", label: "General" },
];
