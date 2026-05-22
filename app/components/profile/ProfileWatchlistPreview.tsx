import Link from "next/link";
import { AnimeImage } from "@/app/components/AnimeImage";
import { FALLBACK_COVER } from "@/lib/anilist/constants";
import type { WatchlistEntry } from "@/lib/watchlist/types";
import { WATCHLIST_STATUS_LABELS } from "@/lib/watchlist/constants";

type ProfileWatchlistPreviewProps = {
  entries: WatchlistEntry[];
  isOwner: boolean;
  username: string | null;
};

export function ProfileWatchlistPreview({
  entries,
  isOwner,
  username,
}: ProfileWatchlistPreviewProps) {
  const preview = entries.slice(0, 6);
  const watchlistHref = isOwner ? "/watchlist" : username ? `/u/${username}` : "/watchlist";

  if (preview.length === 0) {
    return (
      <section
        className="profile-section profile-watchlist-preview profile-watchlist-preview--empty"
        aria-labelledby="profile-watchlist-heading"
      >
        <h2 id="profile-watchlist-heading" className="profile-section__title">
          Watchlist
        </h2>
        <p className="profile-section__empty">
          {isOwner
            ? "Save anime from cards across KuroVerse to build your watchlist."
            : "No watchlist entries yet."}
        </p>
        {isOwner ? (
          <Link href="/watchlist" className="profile-section__cta">
            Open watchlist
          </Link>
        ) : null}
      </section>
    );
  }

  return (
    <section className="profile-section profile-watchlist-preview" aria-labelledby="profile-watchlist-heading">
      <div className="profile-section__head">
        <h2 id="profile-watchlist-heading" className="profile-section__title">
          Watchlist
        </h2>
        <Link href={isOwner ? "/watchlist" : watchlistHref} className="profile-section__link">
          {isOwner ? "Manage" : "View all"} →
        </Link>
      </div>
      <ul className="profile-watchlist-preview__grid">
        {preview.map((entry) => (
          <li key={entry.id}>
            <Link href={`/anime/${entry.animeId}`} className="profile-watchlist-card">
              <AnimeImage
                src={entry.animeCoverUrl ?? FALLBACK_COVER}
                alt=""
                width={100}
                height={140}
                className="profile-watchlist-card__cover"
              />
              <span className="profile-watchlist-card__scrim" aria-hidden />
              <span className="profile-watchlist-card__status">
                {WATCHLIST_STATUS_LABELS[entry.status]}
              </span>
              <span className="profile-watchlist-card__title">{entry.animeTitle}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
