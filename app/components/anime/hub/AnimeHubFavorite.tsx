import { FavoriteControl } from "@/app/components/favorites/FavoriteControl";

type AnimeHubFavoriteProps = {
  animeId: number;
  title: string;
  coverUrl?: string | null;
};

export function AnimeHubFavorite({ animeId, title, coverUrl }: AnimeHubFavoriteProps) {
  return (
    <div className="rounded-2xl border border-white/8 glass-panel-deep p-5">
      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
        Favorite
      </h3>
      <p className="mt-2 text-sm text-white/45">
        Showcase {title} on your KuroVerse profile for other fans to see.
      </p>
      <div className="mt-4">
        <FavoriteControl animeId={animeId} title={title} coverUrl={coverUrl} variant="card" />
      </div>
    </div>
  );
}
