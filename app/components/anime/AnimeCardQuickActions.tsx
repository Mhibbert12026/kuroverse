"use client";

import Link from "next/link";
import { FavoriteControl } from "@/app/components/favorites/FavoriteControl";
import { WatchlistControl } from "@/app/components/watchlist/WatchlistControl";

type AnimeCardQuickActionsProps = {
  animeId: number;
  title: string;
  coverUrl?: string | null;
  layout?: "stacked" | "row";
  communitySlug?: string | null;
};

function stopNav(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}

export function AnimeCardQuickActions({
  animeId,
  title,
  coverUrl,
  layout = "stacked",
  communitySlug,
}: AnimeCardQuickActionsProps) {
  const layoutClass =
    layout === "row"
      ? "anime-card-actions anime-card-actions--row"
      : "anime-card-actions anime-card-actions--stack";

  const communityHref = communitySlug
    ? `/communities/${communitySlug}`
    : "/#communities";

  return (
    <div
      className={layoutClass}
      onClick={stopNav}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="anime-card-actions__primary">
        <WatchlistControl
          animeId={animeId}
          title={title}
          coverUrl={coverUrl}
          variant="card"
          className="anime-card-actions__watchlist"
          onClickCapture={stopNav}
        />

        <FavoriteControl
          animeId={animeId}
          title={title}
          coverUrl={coverUrl}
          variant="card"
          className="anime-card-actions__favorite"
          onClickCapture={stopNav}
        />
      </div>

      <div className="anime-card-actions__secondary">
        <Link
          href={communityHref}
          onClick={stopNav}
          className="anime-card-action-btn anime-card-action-btn--community"
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {communitySlug ? "Join hub" : "Communities"}
        </Link>

        <Link
          href={`/anime/${animeId}`}
          onClick={stopNav}
          className="anime-card-action-btn anime-card-action-btn--primary"
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Watch
        </Link>
      </div>
    </div>
  );
}
