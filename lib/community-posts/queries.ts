import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isCommunitySlug } from "@/lib/communities/registry";
import { commentFromRow, postFromRow } from "./row";
import type { CommunityCommentRecord, CommunityPostRecord } from "./types";

export async function getCommunityPosts(
  communitySlug: string,
  limit = 50,
): Promise<CommunityPostRecord[]> {
  if (!isSupabaseConfigured() || !isCommunitySlug(communitySlug)) return [];

  const supabase = await createClient();
  const viewer = await getUser();

  const { data: posts, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("community_slug", communitySlug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !posts?.length) return [];

  const userIds = [...new Set(posts.map((p) => String(p.user_id)))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url")
    .in("id", userIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [
      String(p.id),
      {
        display_name: p.display_name != null ? String(p.display_name) : null,
        username: p.username != null ? String(p.username) : null,
        avatar_url: p.avatar_url != null ? String(p.avatar_url) : null,
      },
    ]),
  );

  const postIds = posts.map((p) => String(p.id));
  let likedSet = new Set<string>();

  if (viewer) {
    const { data: likes } = await supabase
      .from("community_post_likes")
      .select("post_id")
      .eq("user_id", viewer.id)
      .in("post_id", postIds);

    likedSet = new Set((likes ?? []).map((l) => String(l.post_id)));
  }

  return posts.map((row) => {
    const userId = String(row.user_id);
    return postFromRow(
      row as Record<string, unknown>,
      profileMap.get(userId) ?? null,
      likedSet.has(String(row.id)),
    );
  });
}

export async function getPostComments(postId: string): Promise<CommunityCommentRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_post_comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error || !data) return [];

  const userIds = [...new Set(data.map((c) => String(c.user_id)))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url")
    .in("id", userIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [
      String(p.id),
      {
        display_name: p.display_name != null ? String(p.display_name) : null,
        username: p.username != null ? String(p.username) : null,
        avatar_url: p.avatar_url != null ? String(p.avatar_url) : null,
      },
    ]),
  );

  return data.map((row) => {
    const userId = String(row.user_id);
    return commentFromRow(row as Record<string, unknown>, profileMap.get(userId) ?? null);
  });
}
