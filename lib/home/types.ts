import type { AnimeCard } from "@/lib/anilist/types";
import type { CommunityAccent } from "@/lib/communities/types";

export type HomeActivityKind = "post" | "comment" | "like" | "reaction";

export type HomeActivityItem = {
  id: string;
  kind: HomeActivityKind;
  createdAt: string;
  timeAgo: string;
  communitySlug: string;
  communityTitle: string;
  title: string;
  body: string;
  href: string;
  actor: {
    id: string;
    name: string;
    username: string | null;
    avatarUrl: string | null;
  };
  postId?: string;
  likeCount?: number;
  commentCount?: number;
  hot?: boolean;
};

export type HomeActivityPage = {
  items: HomeActivityItem[];
  page: number;
  hasMore: boolean;
};

export type WatchingNowMember = {
  userId: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  animeId: number;
  animeTitle: string;
  animeCoverUrl: string | null;
  updatedAt: string;
};

export type RecentCommunityJoin = {
  userId: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  communitySlug: string;
  communityTitle: string;
  accent: CommunityAccent;
  joinedAt: string;
};

export type HomeLiveSnapshot = {
  onlinePulse: number;
  activeCommunities: number;
  postsLastHour: number;
  watchingNow: WatchingNowMember[];
  recentJoins: RecentCommunityJoin[];
  trendingDiscussions: HomeActivityItem[];
};

export type HomePersonalizedPage = {
  items: AnimeCard[];
  page: number;
  hasMore: boolean;
  label: string;
};
