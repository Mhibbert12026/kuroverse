"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isCommunitySlug } from "./registry";

/** Subscribe the signed-in user to new-post alerts for a community. */
export async function subscribeToCommunityAction(communitySlug: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !isCommunitySlug(communitySlug)) return false;

  const user = await getUser();
  if (!user) return false;

  const supabase = await createClient();
  const { error } = await supabase.from("community_subscriptions").upsert(
    { user_id: user.id, community_slug: communitySlug },
    { onConflict: "user_id,community_slug" },
  );

  return !error;
}
