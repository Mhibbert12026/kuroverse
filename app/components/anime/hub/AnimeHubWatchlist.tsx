import { WatchlistControl } from "@/app/components/watchlist/WatchlistControl";

type AnimeHubWatchlistProps = {
  animeId: number;
  title: string;
  coverUrl?: string | null;
  compact?: boolean;
};

export function AnimeHubWatchlist({ animeId, title, coverUrl, compact = false }: AnimeHubWatchlistProps) {
  return (
    <WatchlistControl
      animeId={animeId}
      title={title}
      coverUrl={coverUrl}
      variant={compact ? "hub-compact" : "hub-panel"}
    />
  );
}
