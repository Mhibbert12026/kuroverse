import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { FALLBACK_COVER } from "@/lib/anilist/constants";
import type { AniListMedia } from "@/lib/anilist/types";
import { buildSeedContext } from "./context";
import { FEATURED_TAGLINES } from "./templates";
import { buildAiSummary } from "./summary";
import type { DailyFeatured } from "./types";

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function rowToFeatured(row: Record<string, unknown>): DailyFeatured {
  return {
    featuredDate: String(row.featured_date),
    animeId: Number(row.anime_id),
    animeTitle: String(row.anime_title),
    animeCoverUrl: row.anime_cover_url != null ? String(row.anime_cover_url) : null,
    communitySlug: String(row.community_slug),
    tagline: String(row.tagline),
    summary: String(row.summary),
    hotTake: row.hot_take != null ? String(row.hot_take) : null,
  };
}

export async function getDailyFeatured(date?: string): Promise<DailyFeatured | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const target = date ?? todayUtc();
  const { data } = await supabase
    .from("daily_featured_anime")
    .select("*")
    .eq("featured_date", target)
    .maybeSingle();

  if (!data) return null;
  return rowToFeatured(data as Record<string, unknown>);
}

export async function upsertDailyFeatured(
  media: AniListMedia,
  batchId: string | null,
  useAiSummaries: boolean,
): Promise<DailyFeatured> {
  const ctx = buildSeedContext(media);
  const tagline = FEATURED_TAGLINES[media.id % FEATURED_TAGLINES.length].replace(
    "{{genres}}",
    ctx.genres,
  );
  const summary = await buildAiSummary(ctx, useAiSummaries);
  const hotTake = `Hot take: ${ctx.animeTitle} deserves a spot on your weekend queue.`;

  const cover =
    media.coverImage?.extraLarge ||
    media.coverImage?.large ||
    FALLBACK_COVER;

  const row = {
    featured_date: todayUtc(),
    anime_id: media.id,
    anime_title: ctx.animeTitle,
    anime_cover_url: cover,
    community_slug: ctx.communitySlug,
    tagline,
    summary: summary.body.slice(0, 500),
    hot_take: hotTake,
    seed_batch_id: batchId,
  };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("daily_featured_anime")
    .upsert(row, { onConflict: "featured_date" })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not save daily featured anime.");
  }

  return rowToFeatured(data as Record<string, unknown>);
}
