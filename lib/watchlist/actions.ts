"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { DEFAULT_WATCHLIST_STATUS, isWatchlistStatus } from "./constants";
import { entryFromRow } from "./row";
import type { WatchlistActionResult, WatchlistStatus } from "./types";

function cleanTitle(value: string): string {
  return value.trim().slice(0, 200) || "Unknown Anime";
}

function cleanCoverUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  return value.trim().slice(0, 2048);
}

export async function addToWatchlistAction(
  animeId: number,
  animeTitle: string,
  animeCoverUrl: string | null,
  status: WatchlistStatus = DEFAULT_WATCHLIST_STATUS,
): Promise<WatchlistActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to save to your watchlist." };

  if (!Number.isFinite(animeId) || animeId <= 0) {
    return { ok: false, error: "Invalid anime." };
  }

  const resolvedStatus = isWatchlistStatus(status) ? status : DEFAULT_WATCHLIST_STATUS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlist_entries")
    .upsert(
      {
        user_id: user.id,
        anime_id: animeId,
        anime_title: cleanTitle(animeTitle),
        anime_cover_url: cleanCoverUrl(animeCoverUrl),
        status: resolvedStatus,
      },
      { onConflict: "user_id,anime_id" },
    )
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/watchlist");
  return { ok: true, entry: entryFromRow(data) };
}

export async function removeFromWatchlistAction(animeId: number): Promise<WatchlistActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to manage your watchlist." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("watchlist_entries")
    .delete()
    .eq("user_id", user.id)
    .eq("anime_id", animeId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/watchlist");
  return { ok: true };
}

export async function updateWatchlistStatusAction(
  animeId: number,
  status: WatchlistStatus,
): Promise<WatchlistActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  if (!isWatchlistStatus(status)) {
    return { ok: false, error: "Invalid watchlist status." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to manage your watchlist." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlist_entries")
    .update({ status })
    .eq("user_id", user.id)
    .eq("anime_id", animeId)
    .select()
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Watchlist entry not found." };

  revalidatePath("/watchlist");
  return { ok: true, entry: entryFromRow(data) };
}
