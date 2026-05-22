export type CommunityAccent = "orange" | "cyan" | "emerald" | "gold" | "purple";

export type CommunityThreadCategory =
  | "discussion"
  | "theory"
  | "episode"
  | "manga"
  | "trending";

export type CommunityThread = {
  id: string;
  category: CommunityThreadCategory;
  title: string;
  author: string;
  avatarUrl: string;
  timeAgo: string;
  excerpt: string;
  /** Full post body (Supabase posts). */
  body?: string;
  replies: number;
  commentCount?: number;
  likes: number;
  views: string;
  pinned?: boolean;
  hot?: boolean;
  /** Thread contains spoiler content — show warning badge. */
  hasSpoilers?: boolean;
  /** Spoiler scope label, e.g. "Episode 12" or "Manga Ch. 250+". */
  spoilerScope?: string;
  /** Episode label for reaction threads. */
  episodeLabel?: string;
  imageUrl?: string | null;
  likedByUser?: boolean;
  authorId?: string;
  /** Public @handle when available (live Supabase posts). */
  authorUsername?: string | null;
  createdAt?: string;
  /** Live post from Supabase vs demo mock thread. */
  isLive?: boolean;
};

export type CommunityClip = {
  id: string;
  title: string;
  creator: string;
  avatarUrl: string;
  coverUrl: string;
  /** Display duration e.g. "0:42" */
  duration: string;
  durationSeconds: number;
  views: string;
  likes: string;
  comments: number;
  shares: string;
  tag: string;
  rank?: number;
};

export type CommunityStats = {
  online: number;
  members: string;
  postsToday: number;
  trendingTopics: string[];
  topContributors: { name: string; avatarUrl: string; posts: number }[];
};

import type { CommunitySidebarData } from "./sidebar.types";

export type { CommunitySidebarData } from "./sidebar.types";

export type CommunityPageData = {
  slug: string;
  anilistId: number;
  title: string;
  description: string;
  accent: CommunityAccent;
  members: string;
  online: number;
  bannerUrl: string | null;
  coverUrl: string;
  accentColor: string | null;
  threads: CommunityThread[];
  clips: CommunityClip[];
  stats: CommunityStats;
  sidebar: CommunitySidebarData;
  /** Grouped threads for channel-style sections on the page. */
  discussions: {
    trending: CommunityThread[];
    theories: CommunityThread[];
    reactions: CommunityThread[];
  };
};
