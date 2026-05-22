import type { WatchlistStatus } from "./types";

export const WATCHLIST_STATUSES: WatchlistStatus[] = [
  "watching",
  "completed",
  "plan_to_watch",
  "dropped",
];

export const WATCHLIST_STATUS_LABELS: Record<WatchlistStatus, string> = {
  watching: "Watching",
  completed: "Completed",
  plan_to_watch: "Plan to Watch",
  dropped: "Dropped",
};

export const WATCHLIST_STATUS_SHORT: Record<WatchlistStatus, string> = {
  watching: "Watching",
  completed: "Done",
  plan_to_watch: "Plan",
  dropped: "Dropped",
};

export const DEFAULT_WATCHLIST_STATUS: WatchlistStatus = "plan_to_watch";

export function isWatchlistStatus(value: string): value is WatchlistStatus {
  return WATCHLIST_STATUSES.includes(value as WatchlistStatus);
}
