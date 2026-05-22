import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { entryFromRow } from "./row";
import type { WatchlistEntry } from "./types";

export async function getWatchlistEntries(userId: string): Promise<WatchlistEntry[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlist_entries")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => entryFromRow(row));
}
