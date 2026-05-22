import type { AnimeCard, TrendingClipCard } from "./types";
import type { AnimeDetail } from "./detail-types";

export type HubDiscussion = {
  id: string;
  author: string;
  avatarUrl: string;
  timeAgo: string;
  body: string;
  likes: number;
  replies: number;
  pinned?: boolean;
};

export type HubReaction = {
  id: string;
  emoji: string;
  label: string;
  count: number;
};

export type HubComment = {
  id: string;
  author: string;
  avatarUrl: string;
  timeAgo: string;
  body: string;
  likes: number;
};

export type HubCommunityStats = {
  members: string;
  online: number;
  discussionsToday: number;
  clipsShared: string;
  watchlistAdds: string;
  episodeThreads: number;
  growthPercent: number;
};

export type AnimeHubData = {
  anime: AnimeDetail;
  related: AnimeCard[];
  alsoWatch: AnimeCard[];
  clips: TrendingClipCard[];
  discussions: HubDiscussion[];
  reactions: HubReaction[];
  comments: HubComment[];
  stats: HubCommunityStats;
};

export type AniListRecommendationEdge = {
  node: {
    mediaRecommendation: import("./types").AniListMedia | null;
  } | null;
};

export type AniListRecommendationsResponse = {
  Media: {
    recommendations: {
      edges: AniListRecommendationEdge[] | null;
    } | null;
  } | null;
};
