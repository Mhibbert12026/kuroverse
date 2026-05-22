import { avatarForCreator } from "@/lib/images";
import type { CommunityThread } from "@/lib/communities/types";
import { formatTimeAgo, formatViewLabel } from "./format";
import type { CommunityCommentRecord, CommunityPostRecord } from "./types";

type ProfileRow = {
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
} | null;

function authorName(profile: ProfileRow, userId: string): string {
  return profile?.display_name ?? profile?.username ?? `member_${userId.slice(0, 6)}`;
}

function authorAvatar(profile: ProfileRow, name: string): string {
  return profile?.avatar_url ?? avatarForCreator(name);
}

export function postFromRow(
  row: Record<string, unknown>,
  profile: ProfileRow,
  likedByViewer: boolean,
): CommunityPostRecord {
  const name = authorName(profile, String(row.user_id));
  return {
    id: String(row.id),
    userId: String(row.user_id),
    communitySlug: String(row.community_slug),
    category: String(row.category) as CommunityPostRecord["category"],
    title: String(row.title),
    body: String(row.body),
    hasSpoilers: Boolean(row.has_spoilers),
    spoilerScope: row.spoiler_scope != null ? String(row.spoiler_scope) : null,
    episodeLabel: row.episode_label != null ? String(row.episode_label) : null,
    imageUrl: row.image_url != null ? String(row.image_url) : null,
    likeCount: Number(row.like_count) || 0,
    commentCount: Number(row.comment_count) || 0,
    createdAt: String(row.created_at),
    authorName: name,
    authorUsername: profile?.username ?? null,
    authorAvatarUrl: authorAvatar(profile, name),
    likedByViewer,
  };
}

export function commentFromRow(
  row: Record<string, unknown>,
  profile: ProfileRow,
): CommunityCommentRecord {
  const name = authorName(profile, String(row.user_id));
  return {
    id: String(row.id),
    postId: String(row.post_id),
    userId: String(row.user_id),
    body: String(row.body),
    createdAt: String(row.created_at),
    authorName: name,
    authorUsername: profile?.username ?? null,
    authorAvatarUrl: authorAvatar(profile, name),
  };
}

export function postToThread(post: CommunityPostRecord): CommunityThread {
  const hot = post.likeCount >= 8 || post.commentCount >= 5;
  return {
    id: post.id,
    category: post.category,
    title: post.title,
    body: post.body,
    excerpt: post.body,
    author: post.authorUsername ? post.authorUsername : post.authorName,
    authorId: post.userId,
    authorUsername: post.authorUsername,
    avatarUrl: post.authorAvatarUrl ?? avatarForCreator(post.authorName),
    createdAt: post.createdAt,
    timeAgo: formatTimeAgo(post.createdAt),
    likes: post.likeCount,
    commentCount: post.commentCount,
    replies: post.commentCount,
    views: formatViewLabel(post.likeCount, post.commentCount),
    imageUrl: post.imageUrl,
    likedByUser: post.likedByViewer,
    hasSpoilers: post.hasSpoilers,
    spoilerScope: post.spoilerScope ?? undefined,
    episodeLabel: post.episodeLabel ?? undefined,
    hot,
    pinned: false,
    isLive: true,
  };
}

export function categorizeThreadsForChannels(threads: CommunityThread[]) {
  return {
    trending: threads.filter(
      (t) =>
        t.category === "trending" ||
        t.category === "discussion" ||
        Boolean(t.hot) ||
        Boolean(t.pinned),
    ),
    theories: threads.filter((t) => t.category === "theory"),
    reactions: threads.filter((t) => t.category === "episode"),
  };
}

export function groupPostsToDiscussions(posts: CommunityPostRecord[]) {
  return categorizeThreadsForChannels(posts.map(postToThread));
}
