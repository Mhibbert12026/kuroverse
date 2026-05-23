import { revalidatePath } from "next/cache";
import { fetchAnimeMediaList } from "@/lib/anilist/client";
import { FEATURED_FANDOM_IDS } from "@/lib/anilist/constants";
import { createAdminClient, getSeedUserId, isServiceRoleConfigured } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { buildSeedContext } from "./context";
import { getSeedConfig, updateSeedConfig } from "./config";
import { upsertDailyFeatured } from "./featured";
import { generateFeaturedDrop, generateSeedPosts } from "./generate";
import { insertSeedPosts } from "./insert";
import type { SeedRunResult } from "./types";

type RunOptions = {
  triggeredBy: "cron" | "manual" | "admin";
  actorId?: string | null;
  force?: boolean;
};

export async function runSeedEngine(options: RunOptions): Promise<SeedRunResult> {
  if (!isSupabaseConfigured() || !isServiceRoleConfigured()) {
    return {
      ok: false,
      error: "Supabase service role and URL are required for seeding.",
    };
  }

  const config = await getSeedConfig();

  if (!config.enabled && !options.force) {
    return { ok: false, error: "Seeding is disabled in config." };
  }

  const seedUserId = config.seedUserId ?? getSeedUserId();
  if (!seedUserId) {
    return {
      ok: false,
      error: "Set KUROVERSE_SEED_USER_ID (bot account UUID) in environment or seed config.",
    };
  }

  const now = new Date();
  if (
    !options.force &&
    config.nextRunAt &&
    new Date(config.nextRunAt).getTime() > now.getTime()
  ) {
    return { ok: false, error: "Next scheduled run is in the future." };
  }

  const supabase = createAdminClient();
  const { data: batch, error: batchError } = await supabase
    .from("seed_batches")
    .insert({
      triggered_by: options.triggeredBy,
      actor_id: options.actorId ?? null,
      notes: "KuroVerse seed engine",
    })
    .select("id")
    .single();

  if (batchError || !batch) {
    return { ok: false, error: batchError?.message ?? "Could not create batch." };
  }

  const batchId = String(batch.id);

  try {
    const trending = await fetchAnimeMediaList({
      perPage: 12,
      sort: "TRENDING_DESC",
      revalidate: 0,
    });

    const featuredId =
      FEATURED_FANDOM_IDS[now.getUTCDate() % FEATURED_FANDOM_IDS.length];
    const featuredMedia =
      trending.find((m) => m.id === featuredId) ?? trending[0];

    if (!featuredMedia) {
      throw new Error("No AniList media for seeding.");
    }

    const contexts = trending.slice(0, 8).map((m) => buildSeedContext(m));
    const posts = await generateSeedPosts(contexts, config, batchId);

    const featured = await upsertDailyFeatured(
      featuredMedia,
      batchId,
      config.useAiSummaries,
    );
    posts.unshift(
      generateFeaturedDrop(buildSeedContext(featuredMedia), featured.tagline),
    );

    const { created, errors } = await insertSeedPosts(posts, seedUserId, batchId);

    const nextRun = new Date(now.getTime() + config.scheduleHours * 60 * 60 * 1000);

    await supabase
      .from("seed_batches")
      .update({
        posts_created: created,
        featured_anime_id: featuredMedia.id,
      })
      .eq("id", batchId);

    await supabase.from("seed_config").update({
      last_run_at: now.toISOString(),
      next_run_at: nextRun.toISOString(),
      updated_at: now.toISOString(),
    }).eq("id", 1);

    revalidatePath("/");
    revalidatePath("/admin/seed");
    for (const slug of new Set(posts.map((p) => p.communitySlug))) {
      revalidatePath(`/communities/${slug}`);
    }

    if (errors.length) {
      return {
        ok: true,
        batchId,
        postsCreated: created,
        featuredAnimeId: featuredMedia.id,
        error: errors.slice(0, 3).join("; "),
      };
    }

    return {
      ok: true,
      batchId,
      postsCreated: created,
      featuredAnimeId: featuredMedia.id,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Seed run failed.";
    await supabase.from("seed_batches").update({ notes: message }).eq("id", batchId);
    return { ok: false, error: message, batchId };
  }
}

export async function shouldRunScheduledSeed(): Promise<boolean> {
  const config = await getSeedConfig();
  if (!config.enabled) return false;
  if (!config.nextRunAt) return true;
  return new Date(config.nextRunAt).getTime() <= Date.now();
}
