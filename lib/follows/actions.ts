"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type FollowActionResult =
  | { ok: true; following: boolean }
  | { ok: false; error: string };

export async function toggleFollowAction(targetUserId: string): Promise<FollowActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to follow members." };

  if (user.id === targetUserId) {
    return { ok: false, error: "You cannot follow yourself." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    return { ok: true, following: false };
  }

  const { error } = await supabase.from("follows").insert({
    follower_id: user.id,
    following_id: targetUserId,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true, following: true };
}

export async function isFollowingUserAction(targetUserId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const user = await getUser();
  if (!user || user.id === targetUserId) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", user.id)
    .eq("following_id", targetUserId)
    .maybeSingle();

  return Boolean(data);
}
