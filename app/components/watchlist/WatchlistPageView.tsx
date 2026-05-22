"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AnimeImage } from "@/app/components/AnimeImage";
import { InfiniteScrollSentinel } from "@/app/components/feeds/InfiniteScrollSentinel";
import { useProgressiveList } from "@/app/hooks/useProgressiveList";
import { FALLBACK_COVER } from "@/lib/anilist/constants";
import { WATCHLIST_STATUSES, WATCHLIST_STATUS_LABELS } from "@/lib/watchlist/constants";
import { groupEntriesByStatus } from "@/lib/watchlist/row";
import type { WatchlistEntry } from "@/lib/watchlist/types";
import { useWatchlist } from "@/app/providers/WatchlistProvider";
import { WatchlistStatusMenu } from "./WatchlistStatusMenu";

type WatchlistPageViewProps = {
  initialEntries: WatchlistEntry[];
};

export function WatchlistPageView({ initialEntries }: WatchlistPageViewProps) {
  const { entries, loading, busyAnimeId, setWatchlistStatus, removeFromWatchlist } = useWatchlist();

  const displayEntries = entries.length > 0 ? entries : initialEntries;
  const grouped = useMemo(() => groupEntriesByStatus(displayEntries), [displayEntries]);
  const orderedEntries = useMemo(
    () => WATCHLIST_STATUSES.flatMap((status) => grouped[status]),
    [grouped],
  );
  const { visibleItems, sentinelRef, hasMore } = useProgressiveList({
    items: orderedEntries,
    pageSize: 10,
    enabled: orderedEntries.length > 10,
  });
  const visibleIds = useMemo(() => new Set(visibleItems.map((e) => e.id)), [visibleItems]);
  const total = displayEntries.length;

  if (loading && total === 0) {
    return (
      <div className="watchlist-page__empty" aria-busy>
        <span className="auth-modal__spinner" aria-hidden />
        <p className="auth-protected-loading__text">Loading your watchlist…</p>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <header className="watchlist-page__header">
        <p className="watchlist-page__eyebrow">Your queue</p>
        <h1 className="watchlist-page__title">My Watchlist</h1>
        <p className="watchlist-page__subtitle">
          {total} {total === 1 ? "series" : "series"} synced to your KuroVerse account.
        </p>
      </header>

      {total === 0 ? (
        <div className="watchlist-page__empty">
          <p className="watchlist-page__empty-title">Nothing saved yet</p>
          <p className="watchlist-page__empty-text">
            Browse trending anime and add shows to <strong>Watching</strong>,{" "}
            <strong>Plan to Watch</strong>, and more.
          </p>
          <Link href="/#trending-anime" className="watchlist-page__cta">
            Explore trending
          </Link>
        </div>
      ) : (
        <div className="watchlist-sections">
          {WATCHLIST_STATUSES.map((status) => {
            const sectionEntries = grouped[status].filter((entry) => visibleIds.has(entry.id));
            if (!sectionEntries.length) return null;

            return (
              <section key={status} className="watchlist-section" aria-labelledby={`watchlist-${status}`}>
                <div className="watchlist-section__head">
                  <h2 id={`watchlist-${status}`} className="watchlist-section__title">
                    {WATCHLIST_STATUS_LABELS[status]}
                  </h2>
                  <span className="watchlist-section__count">{sectionEntries.length}</span>
                </div>

                <ul className="watchlist-section__list">
                  {sectionEntries.map((entry) => (
                    <li key={entry.id} className="watchlist-entry feed-lazy-item feed-lazy-item--visible">
                      <Link href={`/anime/${entry.animeId}`} className="watchlist-entry__cover-link">
                        <AnimeImage
                          src={entry.animeCoverUrl ?? FALLBACK_COVER}
                          alt=""
                          width={56}
                          height={80}
                          className="watchlist-entry__cover"
                          loading="lazy"
                        />
                      </Link>
                      <div className="watchlist-entry__body">
                        <Link href={`/anime/${entry.animeId}`} className="watchlist-entry__title">
                          {entry.animeTitle}
                        </Link>
                        <p className="watchlist-entry__meta">#{entry.animeId}</p>
                        <WatchlistStatusMenu
                          currentStatus={entry.status}
                          onSelect={(next) => void setWatchlistStatus(entry.animeId, next)}
                          onRemove={() => void removeFromWatchlist(entry.animeId)}
                          disabled={busyAnimeId === entry.animeId}
                          align="left"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          {hasMore ? <InfiniteScrollSentinel sentinelRef={sentinelRef} /> : null}
        </div>
      )}
    </div>
  );
}
