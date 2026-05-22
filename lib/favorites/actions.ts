"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { favoriteFromRow } from "./row";
import type { FavoriteActionResult } from "./types";

const MAX_FAVORITES = 48;

function cleanTitle(value: string): string {
  return value.trim().slice(0, 200) || "Unknown Anime";
}

function cleanCoverUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  return value.trim().slice(0, 2048);
}

export async function addFavoriteAction(
  animeId: number,
  animeTitle: string,
  animeCoverUrl: string | null,
): Promise<FavoriteActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to favorite anime." };

  if (!Number.isFinite(animeId) || animeId <= 0) {
    return { ok: false, error: "Invalid anime." };
  }

  const supabase = await createClient();

  const { count } = await supabase
    .from("anime_favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= MAX_FAVORITES) {
    return { ok: false, error: `You can save up to ${MAX_FAVORITES} favorites.` };
  }

  const { data, error } = await supabase
    .from("anime_favorites")
    .upsert(
      {
        user_id: user.id,
        anime_id: animeId,
        anime_title: cleanTitle(animeTitle),
        anime_cover_url: cleanCoverUrl(animeCoverUrl),
      },
      { onConflict: "user_id,anime_id" },
    )
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.username) {
    revalidatePath(`/u/${profile.username}`);
  }

  return { ok: true, favorite: favoriteFromRow(data) };
}

export async function removeFavoriteAction(animeId: number): Promise<FavoriteActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to manage favorites." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("anime_favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("anime_id", animeId);

  if (error) return { ok: false, error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.username) {
    revalidatePath(`/u/${profile.username}`);
  }

  return { ok: true };
}
