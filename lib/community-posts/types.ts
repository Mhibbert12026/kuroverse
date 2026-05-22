import type { CommunityThreadCategory } from "@/lib/communities/types";

export type PostCategory = CommunityThreadCategory;

/** Categories users can pick when composing a post. */
export type ComposablePostCategory = "discussion" | "episode" | "theory";

export type CommunityPostRecord = {
  id: string;
  userId: string;
  communitySlug: string;
  category: PostCategory;
  title: string;
  body: string;
  hasSpoilers: boolean;
  spoilerScope: string | null;
  episodeLabel: string | null;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  authorName: string;
  authorUsername: string | null;
  authorAvatarUrl: string | null;
  likedByViewer: boolean;
};

export type CommunityCommentRecord = {
  id: string;
  postId: string;
  userId: string;
  body: string;
  createdAt: string;
  authorName: string;
  authorUsername: string | null;
  authorAvatarUrl: string | null;
};

export type PostActionResult = {
  ok: boolean;
  error?: string;
  postId?: string;
};
