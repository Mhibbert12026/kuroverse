import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type ProfileStats = {
  favoriteCount: number;
  watchlistCount: number;
  fandomCount: number;
  followerCount: number;
  followingCount: number;
};

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  if (!isSupabaseConfigured()) {
    return {
      favoriteCount: 0,
      watchlistCount: 0,
      fandomCount: 0,
      followerCount: 0,
      followingCount: 0,
    };
  }

  const supabase = await createClient();

  const [favorites, watchlist, fandoms, followers, following] = await Promise.all([
    supabase
      .from("anime_favorites")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("watchlist_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("community_subscriptions")
      .select("community_slug", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("follows")
      .select("follower_id", { count: "exact", head: true })
      .eq("following_id", userId),
    supabase
      .from("follows")
      .select("following_id", { count: "exact", head: true })
      .eq("follower_id", userId),
  ]);

  return {
    favoriteCount: favorites.count ?? 0,
    watchlistCount: watchlist.count ?? 0,
    fandomCount: fandoms.count ?? 0,
    followerCount: followers.count ?? 0,
    followingCount: following.count ?? 0,
  };
}
