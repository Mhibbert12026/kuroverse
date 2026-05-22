export type WatchlistStatus = "watching" | "completed" | "plan_to_watch" | "dropped";

export type WatchlistEntry = {
  id: string;
  animeId: number;
  animeTitle: string;
  animeCoverUrl: string | null;
  status: WatchlistStatus;
  createdAt: string;
  updatedAt: string;
};

export type WatchlistActionResult = {
  ok: boolean;
  error?: string;
  entry?: WatchlistEntry;
};
