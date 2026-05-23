import { createClient } from "@/lib/supabase/server";
import { createAdminClient, getSeedUserId, isServiceRoleConfigured } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { SeedConfig } from "./types";

const DEFAULT_CONFIG: SeedConfig = {
  enabled: true,
  seedUserId: null,
  postsPerRun: 6,
  episodeThreadsPerRun: 2,
  hotTakesPerRun: 2,
  summariesPerRun: 1,
  trendingRecsPerRun: 2,
  useAiSummaries: false,
  scheduleHours: 6,
  lastRunAt: null,
  nextRunAt: null,
};

function rowToConfig(row: Record<string, unknown>): SeedConfig {
  return {
    enabled: Boolean(row.enabled),
    seedUserId: row.seed_user_id != null ? String(row.seed_user_id) : null,
    postsPerRun: Number(row.posts_per_run) || 6,
    episodeThreadsPerRun: Number(row.episode_threads_per_run) || 2,
    hotTakesPerRun: Number(row.hot_takes_per_run) || 2,
    summariesPerRun: Number(row.summaries_per_run) || 1,
    trendingRecsPerRun: Number(row.trending_recs_per_run) || 2,
    useAiSummaries: Boolean(row.use_ai_summaries),
    scheduleHours: Number(row.schedule_hours) || 6,
    lastRunAt: row.last_run_at != null ? String(row.last_run_at) : null,
    nextRunAt: row.next_run_at != null ? String(row.next_run_at) : null,
  };
}

export async function getSeedConfig(): Promise<SeedConfig> {
  if (!isSupabaseConfigured()) {
    return { ...DEFAULT_CONFIG, seedUserId: getSeedUserId() };
  }

  const client = isServiceRoleConfigured() ? createAdminClient() : await createClient();
  const { data, error } = await client.from("seed_config").select("*").eq("id", 1).maybeSingle();

  if (error || !data) {
    return { ...DEFAULT_CONFIG, seedUserId: getSeedUserId() };
  }

  const config = rowToConfig(data as Record<string, unknown>);
  if (!config.seedUserId) {
    config.seedUserId = getSeedUserId();
  }
  return config;
}

export async function updateSeedConfig(
  patch: Partial<SeedConfig>,
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const client = createAdminClient();
  const { error } = await client
    .from("seed_config")
    .update({
      enabled: patch.enabled,
      seed_user_id: patch.seedUserId,
      posts_per_run: patch.postsPerRun,
      episode_threads_per_run: patch.episodeThreadsPerRun,
      hot_takes_per_run: patch.hotTakesPerRun,
      summaries_per_run: patch.summariesPerRun,
      trending_recs_per_run: patch.trendingRecsPerRun,
      use_ai_summaries: patch.useAiSummaries,
      schedule_hours: patch.scheduleHours,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
