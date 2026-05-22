import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { favoriteFromRow } from "./row";
import type { AnimeFavorite } from "./types";

const PROFILE_FAVORITES_LIMIT = 24;

export async function getFavoritesForUser(
  userId: string,
  limit = PROFILE_FAVORITES_LIMIT,
): Promise<AnimeFavorite[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("anime_favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map((row) => favoriteFromRow(row));
}
