import { cache } from "react";
import { avatarForCreator } from "@/lib/images";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { postFromRow, commentFromRow } from "@/lib/community-posts/row";
import {
  communityAccentFromSlug,
  communityHref,
  communityTitleFromSlug,
  timeAgo,
} from "./format";
import { getMockActivityPage, getMockLiveSnapshot } from "./mock";
import type {
  HomeActivityItem,
  HomeActivityPage,
  HomeLiveSnapshot,
  RecentCommunityJoin,
  WatchingNowMember,
} from "./types";

const ACTIVITY_PAGE_SIZE = 10;

type ProfileMini = {
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

async function profileMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userIds: string[],
): Promise<Map<string, ProfileMini>> {
  if (!userIds.length) return new Map();

  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url")
    .in("id", userIds);

  return new Map(
    (data ?? []).map((p) => [
      String(p.id),
      {
        display_name: p.display_name != null ? String(p.display_name) : null,
        username: p.username != null ? String(p.username) : null,
        avatar_url: p.avatar_url != null ? String(p.avatar_url) : null,
      },
    ]),
  );
}

function actorFromProfile(
  userId: string,
  profile: ProfileMini | undefined,
): HomeActivityItem["actor"] {
  const name =
    profile?.display_name ?? profile?.username ?? `member_${userId.slice(0, 6)}`;
  return {
    id: userId,
    name,
    username: profile?.username ?? null,
    avatarUrl: profile?.avatar_url ?? avatarForCreator(name),
  };
}

function postToActivity(
  post: ReturnType<typeof postFromRow>,
): HomeActivityItem {
  const slug = post.communitySlug;
  return {
    id: `post-${post.id}`,
    kind: "post",
    createdAt: post.createdAt,
    timeAgo: timeAgo(post.createdAt),
    communitySlug: slug,
    communityTitle: communityTitleFromSlug(slug),
    title: post.title,
    body: post.body.slice(0, 200),
    href: communityHref(slug, post.id),
    actor: {
      id: post.userId,
      name: post.authorName,
      username: post.authorUsername,
      avatarUrl: post.authorAvatarUrl,
    },
    postId: post.id,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    hot: post.likeCount >= 8 || post.commentCount >= 5,
  };
}

export async function getHomeActivityPage(page = 1): Promise<HomeActivityPage> {
  if (!isSupabaseConfigured()) return getMockActivityPage(page);

  const supabase = await createClient();
  const fetchSize = ACTIVITY_PAGE_SIZE * 2;

  const [postsRes, commentsRes, likesRes] = await Promise.all([
    supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, fetchSize - 1),
    supabase
      .from("community_post_comments")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, fetchSize - 1),
    supabase
      .from("community_post_likes")
      .select("user_id, post_id, created_at")
      .order("created_at", { ascending: false })
      .range(0, Math.floor(fetchSize / 2) - 1),
  ]);

  const posts = postsRes.data ?? [];
  const comments = commentsRes.data ?? [];
  const likes = likesRes.data ?? [];

  const userIds = [
    ...new Set([
      ...posts.map((p) => String(p.user_id)),
      ...comments.map((c) => String(c.user_id)),
      ...likes.map((l) => String(l.user_id)),
    ]),
  ];

  const profiles = await profileMap(supabase, userIds);

  const postIds = [...new Set([...posts.map((p) => String(p.id)), ...likes.map((l) => String(l.post_id))])];
  const { data: likedPosts } = postIds.length
    ? await supabase
        .from("community_posts")
        .select("id, title, community_slug, user_id")
        .in("id", postIds)
    : { data: [] };

  const postMeta = new Map(
    (likedPosts ?? []).map((p) => [
      String(p.id),
      {
        title: String(p.title),
        communitySlug: String(p.community_slug),
        authorId: String(p.user_id),
      },
    ]),
  );

  const merged: HomeActivityItem[] = [];

  for (const row of posts) {
    const userId = String(row.user_id);
    merged.push(
      postToActivity(
        postFromRow(row as Record<string, unknown>, profiles.get(userId) ?? null, false),
      ),
    );
  }

  const commentPostIds = [...new Set(comments.map((c) => String(c.post_id)))];
  const { data: commentPosts } = commentPostIds.length
    ? await supabase
        .from("community_posts")
        .select("id, title, community_slug")
        .in("id", commentPostIds)
    : { data: [] };

  const commentPostMeta = new Map(
    (commentPosts ?? []).map((p) => [
      String(p.id),
      { title: String(p.title), communitySlug: String(p.community_slug) },
    ]),
  );

  for (const row of comments) {
    const userId = String(row.user_id);
    const comment = commentFromRow(row as Record<string, unknown>, profiles.get(userId) ?? null);
    const postId = comment.postId;
    const postRow = commentPostMeta.get(postId);
    const slug = postRow?.communitySlug ?? "naruto";
    merged.push({
      id: `comment-${comment.id}`,
      kind: "comment",
      createdAt: comment.createdAt,
      timeAgo: timeAgo(comment.createdAt),
      communitySlug: slug,
      communityTitle: communityTitleFromSlug(slug),
      title: postRow ? `Replied in “${postRow.title.slice(0, 60)}”` : "New reply",
      body: comment.body.slice(0, 200),
      href: communityHref(slug, postId),
      postId,
      actor: {
        id: comment.userId,
        name: comment.authorName,
        username: comment.authorUsername,
        avatarUrl: comment.authorAvatarUrl,
      },
    });
  }

  for (const row of likes) {
    const userId = String(row.user_id);
    const postId = String(row.post_id);
    const meta = postMeta.get(postId);
    if (!meta || meta.authorId === userId) continue;

    const slug = meta.communitySlug;
    merged.push({
      id: `like-${userId}-${postId}-${String(row.created_at)}`,
      kind: "like",
      createdAt: String(row.created_at),
      timeAgo: timeAgo(String(row.created_at)),
      communitySlug: slug,
      communityTitle: communityTitleFromSlug(slug),
      title: "Liked a discussion",
      body: meta.title.slice(0, 120),
      href: communityHref(slug, postId),
      postId,
      actor: actorFromProfile(userId, profiles.get(userId)),
    });
  }

  merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const start = (page - 1) * ACTIVITY_PAGE_SIZE;
  const slice = merged.slice(start, start + ACTIVITY_PAGE_SIZE);

  return {
    items: slice,
    page,
    hasMore: merged.length > start + ACTIVITY_PAGE_SIZE,
  };
}

export async function getWatchingNow(limit = 10): Promise<WatchingNowMember[]> {
  if (!isSupabaseConfigured()) return getMockLiveSnapshot().watchingNow;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_watching_now", { p_limit: limit });

  if (error || !data) return [];

  return (data as Record<string, unknown>[]).map((row) => ({
    userId: String(row.user_id),
    username: row.username != null ? String(row.username) : null,
    displayName: String(row.display_name ?? row.username ?? "Fan"),
    avatarUrl: row.avatar_url != null ? String(row.avatar_url) : null,
    animeId: Number(row.anime_id),
    animeTitle: String(row.anime_title),
    animeCoverUrl: row.anime_cover_url != null ? String(row.anime_cover_url) : null,
    updatedAt: String(row.updated_at),
  }));
}

export async function getRecentCommunityJoins(limit = 8): Promise<RecentCommunityJoin[]> {
  if (!isSupabaseConfigured()) return getMockLiveSnapshot().recentJoins;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_subscriptions")
    .select("user_id, community_slug, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const userIds = [...new Set(data.map((r) => String(r.user_id)))];
  const profiles = await profileMap(supabase, userIds);

  return data.map((row) => {
    const userId = String(row.user_id);
    const slug = String(row.community_slug);
    const profile = profiles.get(userId);
    const name =
      profile?.display_name ?? profile?.username ?? `member_${userId.slice(0, 6)}`;

    return {
      userId,
      username: profile?.username ?? null,
      displayName: name,
      avatarUrl: profile?.avatar_url ?? avatarForCreator(name),
      communitySlug: slug,
      communityTitle: communityTitleFromSlug(slug),
      accent: communityAccentFromSlug(slug),
      joinedAt: String(row.created_at),
    };
  });
}

export async function getTrendingDiscussions(limit = 6): Promise<HomeActivityItem[]> {
  if (!isSupabaseConfigured()) return getMockLiveSnapshot().trendingDiscussions;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .order("like_count", { ascending: false })
    .order("comment_count", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const userIds = [...new Set(data.map((p) => String(p.user_id)))];
  const profiles = await profileMap(supabase, userIds);

  return data.map((row) =>
    postToActivity(
      postFromRow(
        row as Record<string, unknown>,
        profiles.get(String(row.user_id)) ?? null,
        false,
      ),
    ),
  );
}

export const getHomeLiveSnapshot = cache(async (): Promise<HomeLiveSnapshot> => {
  if (!isSupabaseConfigured()) return getMockLiveSnapshot();

  const supabase = await createClient();
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const [watchingNow, recentJoins, trendingDiscussions, postsHour] = await Promise.all([
    getWatchingNow(10),
    getRecentCommunityJoins(8),
    getTrendingDiscussions(6),
    supabase
      .from("community_posts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", hourAgo),
  ]);

  const uniqueCommunities = new Set(
    (recentJoins ?? []).map((j) => j.communitySlug),
  ).size;

  return {
    onlinePulse: Math.max(watchingNow.length * 120, 400) + (postsHour.count ?? 0) * 8,
    activeCommunities: uniqueCommunities || 5,
    postsLastHour: postsHour.count ?? 0,
    watchingNow,
    recentJoins,
    trendingDiscussions,
  };
});
