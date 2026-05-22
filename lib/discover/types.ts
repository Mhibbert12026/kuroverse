import type { CommunityAccent } from "@/lib/communities/types";

export type DiscoverCommunityTag = {
  slug: string;
  name: string;
  accent: CommunityAccent;
  tag: string;
};

export type DiscoverClipItem = {
  id: string;
  animeId: number;
  animeTitle: string;
  coverUrl: string;
  displayTitle: string;
  creator: string;
  creatorAvatarUrl: string;
  views: string;
  likes: string;
  comments: number;
  shares: string;
  duration: string;
  durationSeconds: number;
  clipTag: string;
  animeTags: string[];
  community: DiscoverCommunityTag | null;
  accentColor: string | null;
  rating: string;
  status: string;
};

export type DiscoverFeedPage = {
  clips: DiscoverClipItem[];
  page: number;
  hasMore: boolean;
};
