import { isWatchlistStatus } from "./constants";
import type { WatchlistEntry, WatchlistStatus } from "./types";

export function entryFromRow(row: Record<string, unknown>): WatchlistEntry {
  const status = String(row.status);
  return {
    id: String(row.id),
    animeId: Number(row.anime_id),
    animeTitle: String(row.anime_title),
    animeCoverUrl: row.anime_cover_url != null ? String(row.anime_cover_url) : null,
    status: isWatchlistStatus(status) ? status : "plan_to_watch",
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function groupEntriesByStatus(entries: WatchlistEntry[]): Record<WatchlistStatus, WatchlistEntry[]> {
  const groups: Record<WatchlistStatus, WatchlistEntry[]> = {
    watching: [],
    completed: [],
    plan_to_watch: [],
    dropped: [],
  };

  for (const entry of entries) {
    groups[entry.status].push(entry);
  }

  return groups;
}
