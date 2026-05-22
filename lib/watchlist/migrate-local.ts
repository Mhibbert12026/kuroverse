import { WATCHLIST_STORAGE_KEY, WATCHLIST_STORAGE_KEY_LEGACY } from "@/lib/brand";
import { FALLBACK_COVER } from "@/lib/anilist/constants";
import { addToWatchlistAction } from "./actions";
import { DEFAULT_WATCHLIST_STATUS } from "./constants";

/** One-time import of legacy localStorage IDs into Supabase. */
export async function migrateLocalWatchlistToSupabase(): Promise<void> {
  if (typeof window === "undefined") return;

  let raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
  if (!raw) {
    raw = localStorage.getItem(WATCHLIST_STORAGE_KEY_LEGACY);
  }
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return;

    const ids = parsed.filter((id): id is number => typeof id === "number" && Number.isFinite(id));
    if (!ids.length) return;

    await Promise.all(
      ids.map((animeId) =>
        addToWatchlistAction(animeId, `Anime #${animeId}`, FALLBACK_COVER, DEFAULT_WATCHLIST_STATUS),
      ),
    );

    localStorage.removeItem(WATCHLIST_STORAGE_KEY);
    localStorage.removeItem(WATCHLIST_STORAGE_KEY_LEGACY);
  } catch {
    /* ignore corrupt local data */
  }
}
