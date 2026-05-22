import type { AnimeFavorite } from "./types";

export function favoriteFromRow(row: Record<string, unknown>): AnimeFavorite {
  return {
    id: String(row.id),
    animeId: Number(row.anime_id),
    animeTitle: String(row.anime_title),
    animeCoverUrl: row.anime_cover_url != null ? String(row.anime_cover_url) : null,
    createdAt: String(row.created_at),
  };
}
