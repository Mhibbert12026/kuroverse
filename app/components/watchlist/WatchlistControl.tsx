"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { PLATFORM_NAME } from "@/lib/brand";
import { FALLBACK_COVER } from "@/lib/anilist/constants";
import {
  DEFAULT_WATCHLIST_STATUS,
  WATCHLIST_STATUS_LABELS,
} from "@/lib/watchlist/constants";
import type { WatchlistStatus } from "@/lib/watchlist/types";
import { useAuth } from "@/app/providers/AuthProvider";
import { useWatchlist } from "@/app/providers/WatchlistProvider";
import { WatchlistStatusMenu } from "./WatchlistStatusMenu";

export type WatchlistControlVariant = "card" | "hub-compact" | "hub-panel" | "discover";

type WatchlistControlProps = {
  animeId: number;
  title: string;
  coverUrl?: string | null;
  variant?: WatchlistControlVariant;
  className?: string;
  onClickCapture?: (e: React.MouseEvent) => void;
};

function stopNav(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}

export function WatchlistControl({
  animeId,
  title,
  coverUrl,
  variant = "card",
  className = "",
  onClickCapture,
}: WatchlistControlProps) {
  const pathname = usePathname();
  const { user, openAuth } = useAuth();
  const { getEntry, isOnWatchlist, addToWatchlist, removeFromWatchlist, setWatchlistStatus, busyAnimeId, loading } =
    useWatchlist();
  const [error, setError] = useState<string | null>(null);

  const entry = getEntry(animeId);
  const saved = isOnWatchlist(animeId);
  const busy = busyAnimeId === animeId || loading;
  const resolvedCover = coverUrl ?? FALLBACK_COVER;

  const requireAuth = useCallback(() => {
    const returnTo = pathname.startsWith("/") ? pathname : "/";
    openAuth("sign-in", returnTo);
  }, [openAuth, pathname]);

  const handleAdd = useCallback(
    async (status: WatchlistStatus = DEFAULT_WATCHLIST_STATUS) => {
      if (!user) {
        requireAuth();
        return;
      }
      setError(null);
      const ok = await addToWatchlist(animeId, title, resolvedCover, status);
      if (!ok) setError("Could not save to watchlist.");
    },
    [user, requireAuth, addToWatchlist, animeId, title, resolvedCover],
  );

  const handleStatus = useCallback(
    async (status: WatchlistStatus) => {
      if (!user) {
        requireAuth();
        return;
      }
      setError(null);
      if (saved) {
        const ok = await setWatchlistStatus(animeId, status);
        if (!ok) setError("Could not update status.");
      } else {
        await handleAdd(status);
      }
    },
    [user, requireAuth, saved, setWatchlistStatus, animeId, handleAdd],
  );

  const handleRemove = useCallback(async () => {
    if (!user) return;
    setError(null);
    const ok = await removeFromWatchlist(animeId);
    if (!ok) setError("Could not remove from watchlist.");
  }, [user, removeFromWatchlist, animeId]);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      stopNav(e);
      onClickCapture?.(e);
      if (!user) {
        requireAuth();
        return;
      }
      if (saved) {
        await handleRemove();
      } else {
        await handleAdd();
      }
    },
    [user, requireAuth, saved, handleRemove, handleAdd, onClickCapture],
  );

  if (variant === "discover") {
    return (
      <div className={className} onClick={stopNav}>
        {saved ? (
          <WatchlistStatusMenu
            currentStatus={entry?.status ?? null}
            onSelect={handleStatus}
            onRemove={handleRemove}
            disabled={busy}
            align="left"
            triggerClassName="discover-action discover-action--saved"
          />
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            disabled={busy}
            className="discover-action"
            aria-pressed={false}
          >
            <ListIcon filled={false} />
            <span>{busy ? "…" : "List"}</span>
          </button>
        )}
      </div>
    );
  }

  if (variant === "hub-compact") {
    return (
      <div className={className} onClick={stopNav}>
        {saved ? (
          <WatchlistStatusMenu
            currentStatus={entry?.status ?? null}
            onSelect={handleStatus}
            onRemove={handleRemove}
            disabled={busy}
            align="left"
            triggerClassName="hub-btn hub-btn--watchlist-active"
          />
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            disabled={busy}
            className="hub-btn hub-btn--secondary"
          >
            <ListIcon filled={false} />
            {busy ? "Saving…" : "My List"}
          </button>
        )}
      </div>
    );
  }

  if (variant === "hub-panel") {
    return (
      <div className={`rounded-2xl border border-white/8 glass-panel-deep p-5 ${className}`}>
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
          Your Watchlist
        </h3>
        <p className="mt-2 text-sm text-white/45">
          Track {title} and sync your list across {PLATFORM_NAME}.
        </p>

        {saved ? (
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-xs font-semibold text-accent-cyan/90">
              On your list · {WATCHLIST_STATUS_LABELS[entry!.status]}
            </p>
            <WatchlistStatusMenu
              currentStatus={entry?.status ?? null}
              onSelect={handleStatus}
              onRemove={handleRemove}
              disabled={busy}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleToggle}
            disabled={busy}
            className="mt-4 hub-btn hub-btn--primary w-full justify-center"
          >
            {busy ? "Saving…" : "+ Add to Watchlist"}
          </button>
        )}

        {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className={className} onClick={stopNav} onKeyDown={(e) => e.stopPropagation()}>
      {saved ? (
        <WatchlistStatusMenu
          currentStatus={entry?.status ?? null}
          onSelect={handleStatus}
          onRemove={handleRemove}
          disabled={busy}
          triggerClassName="anime-card-action-btn anime-card-action-btn--active"
        />
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          disabled={busy}
          aria-pressed={false}
          aria-label={`Add ${title} to watchlist`}
          className="anime-card-action-btn"
        >
          <ListIcon filled={false} />
          {busy ? "Saving…" : "Add to Watchlist"}
        </button>
      )}
      {error ? <p className="mt-1 text-[10px] text-red-300">{error}</p> : null}
    </div>
  );
}

function ListIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {filled ? (
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      )}
    </svg>
  );
}
