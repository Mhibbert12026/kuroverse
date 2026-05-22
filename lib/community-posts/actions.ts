"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isCommunitySlug } from "@/lib/communities/registry";
import {
  MAX_COMMENT_BODY,
  MAX_POST_BODY,
  MAX_POST_TITLE,
} from "./constants";
import { getPostComments } from "./queries";
import type { CommunityCommentRecord, ComposablePostCategory, PostActionResult } from "./types";

function cleanText(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function isComposableCategory(value: string): value is ComposablePostCategory {
  return value === "discussion" || value === "episode" || value === "theory";
}

export async function createCommunityPostAction(
  formData: FormData,
): Promise<PostActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to post in communities." };

  const communitySlug = String(formData.get("community_slug") ?? "");
  if (!isCommunitySlug(communitySlug)) {
    return { ok: false, error: "Invalid community." };
  }

  const category = String(formData.get("category") ?? "");
  if (!isComposableCategory(category)) {
    return { ok: false, error: "Pick a post type." };
  }

  const title = cleanText(String(formData.get("title") ?? ""), MAX_POST_TITLE);
  const body = cleanText(String(formData.get("body") ?? ""), MAX_POST_BODY);

  if (!title) return { ok: false, error: "Add a title for your post." };
  if (body.length < 8) return { ok: false, error: "Write at least a few words in your post." };

  const hasSpoilers = formData.get("has_spoilers") === "true";
  const spoilerScope = hasSpoilers
    ? cleanText(String(formData.get("spoiler_scope") ?? ""), 80) || null
    : null;
  const episodeLabel =
    category === "episode"
      ? cleanText(String(formData.get("episode_label") ?? ""), 48) || null
      : null;
  const imageUrl = cleanText(String(formData.get("image_url") ?? ""), 2048) || null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      user_id: user.id,
      community_slug: communitySlug,
      category,
      title,
      body,
      has_spoilers: hasSpoilers,
      spoiler_scope: spoilerScope,
      episode_label: episodeLabel,
      image_url: imageUrl,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/communities/${communitySlug}`);
  return { ok: true, postId: String(data.id) };
}

export async function togglePostLikeAction(postId: string): Promise<PostActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to like posts." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("community_post_likes")
    .select("post_id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("community_post_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", postId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("community_post_likes").insert({
      user_id: user.id,
      post_id: postId,
    });
    if (error) return { ok: false, error: error.message };
  }

  const { data: post } = await supabase
    .from("community_posts")
    .select("community_slug")
    .eq("id", postId)
    .maybeSingle();

  if (post?.community_slug) {
    revalidatePath(`/communities/${post.community_slug}`);
  }

  return { ok: true };
}

export async function addPostCommentAction(
  postId: string,
  body: string,
): Promise<PostActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to comment." };

  const trimmed = cleanText(body, MAX_COMMENT_BODY);
  if (trimmed.length < 1) return { ok: false, error: "Comment cannot be empty." };

  const supabase = await createClient();
  const { error } = await supabase.from("community_post_comments").insert({
    post_id: postId,
    user_id: user.id,
    body: trimmed,
  });

  if (error) return { ok: false, error: error.message };

  const { data: post } = await supabase
    .from("community_posts")
    .select("community_slug")
    .eq("id", postId)
    .maybeSingle();

  if (post?.community_slug) {
    revalidatePath(`/communities/${post.community_slug}`);
  }

  return { ok: true };
}

export async function fetchPostCommentsAction(
  postId: string,
): Promise<CommunityCommentRecord[]> {
  if (!isSupabaseConfigured()) return [];
  return getPostComments(postId);
}
