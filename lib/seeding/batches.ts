import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { SeedBatch } from "./types";

export async function getRecentSeedBatches(limit = 12): Promise<SeedBatch[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("seed_batches")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: String(row.id),
    triggeredBy: row.triggered_by as SeedBatch["triggeredBy"],
    actorId: row.actor_id != null ? String(row.actor_id) : null,
    postsCreated: Number(row.posts_created) || 0,
    featuredAnimeId: row.featured_anime_id != null ? Number(row.featured_anime_id) : null,
    notes: row.notes != null ? String(row.notes) : null,
    createdAt: String(row.created_at),
  }));
}
