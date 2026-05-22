import type { CommunityAccent } from "./types";

export type SidebarRelatedCommunity = {
  slug: string;
  name: string;
  members: string;
  online: string;
  accent: CommunityAccent;
  coverUrl: string;
};

export type SidebarTrendingTag = {
  label: string;
  posts: string;
  hot?: boolean;
};

export type SidebarContributor = {
  rank: number;
  name: string;
  avatarUrl: string;
  reputation: string;
  posts: number;
  badge?: "gold" | "silver" | "bronze";
};

export type SidebarUpcomingEpisode = {
  id: string;
  title: string;
  subtitle: string;
  eta: string;
  urgent?: boolean;
};

export type SidebarAnimeRanking = {
  rank: number;
  title: string;
  slug: string;
  coverUrl: string;
  score: string;
  delta: string;
  trend: "up" | "down" | "same";
};

export type SidebarRelatedAnime = {
  anilistId: number;
  title: string;
  coverUrl: string;
  accent: CommunityAccent;
  genres?: string;
};

export type CommunitySidebarData = {
  relatedAnime: SidebarRelatedAnime;
  related: SidebarRelatedCommunity[];
  trendingTags: SidebarTrendingTag[];
  topContributors: SidebarContributor[];
  upcomingEpisodes: SidebarUpcomingEpisode[];
  popularRankings: SidebarAnimeRanking[];
};
