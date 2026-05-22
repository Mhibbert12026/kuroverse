"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { FALLBACK_COVER } from "@/lib/anilist/constants";
import { useAuth } from "@/app/providers/AuthProvider";
import { useFavorites } from "@/app/providers/FavoritesProvider";

export type FavoriteControlVariant = "card" | "hub-compact" | "icon" | "discover";

type FavoriteControlProps = {
  animeId: number;
  title: string;
  coverUrl?: string | null;
  variant?: FavoriteControlVariant;
  className?: string;
  onClickCapture?: (e: React.MouseEvent) => void;
};

function stopNav(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}

export function FavoriteControl({
  animeId,
  title,
  coverUrl,
  variant = "card",
  className = "",
  onClickCapture,
}: FavoriteControlProps) {
  const pathname = usePathname();
  const { user, openAuth } = useAuth();
  const { isFavorite, toggleFavorite, busyAnimeId, loading } = useFavorites();
  const [pop, setPop] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const favorited = isFavorite(animeId);
  const busy = busyAnimeId === animeId || loading;
  const resolvedCover = coverUrl ?? FALLBACK_COVER;

  const triggerPop = useCallback(() => {
    setPop(true);
    window.setTimeout(() => setPop(false), 520);
  }, []);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      stopNav(e);
      onClickCapture?.(e);

      if (!user) {
        openAuth("sign-in", pathname.startsWith("/") ? pathname : "/");
        return;
      }

      setError(null);
      const wasFavorited = favorited;
      const ok = await toggleFavorite(animeId, title, resolvedCover);
      if (ok && !wasFavorited) triggerPop();
      if (!ok) setError("Could not update favorite.");
    },
    [user, openAuth, pathname, favorited, toggleFavorite, animeId, title, resolvedCover, onClickCapture, triggerPop],
  );

  const stateClass = [
    favorited ? "favorite-btn--active" : "",
    pop ? "favorite-btn--pop" : "",
    busy ? "favorite-btn--busy" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (variant === "discover") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={busy}
        aria-pressed={favorited}
        aria-label={favorited ? `Remove ${title} from favorites` : `Favorite ${title}`}
        className={`discover-action ${favorited ? "discover-action--liked" : ""} ${stateClass} ${className}`.trim()}
      >
        <span className="favorite-btn__burst" aria-hidden />
        <HeartIcon filled={favorited} />
        <span>{favorited ? "Saved" : "Favorite"}</span>
      </button>
    );
  }

  if (variant === "hub-compact" || variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={busy}
        aria-pressed={favorited}
        aria-label={favorited ? `Remove ${title} from favorites` : `Favorite ${title}`}
        className={`favorite-btn favorite-btn--icon ${stateClass} ${className}`.trim()}
      >
        <span className="favorite-btn__burst" aria-hidden />
        <HeartIcon filled={favorited} />
        {variant === "hub-compact" ? (
          <span className="hidden sm:inline">{favorited ? "Favorited" : "Favorite"}</span>
        ) : null}
      </button>
    );
  }

  return (
    <div className={className} onClick={stopNav}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={busy}
        aria-pressed={favorited}
        aria-label={favorited ? `Remove ${title} from favorites` : `Favorite ${title}`}
        className={`anime-card-action-btn favorite-btn favorite-btn--card ${stateClass} ${
          favorited ? "anime-card-action-btn--favorite" : ""
        }`.trim()}
      >
        <span className="favorite-btn__burst" aria-hidden />
        <HeartIcon filled={favorited} />
        {busy ? "Saving…" : favorited ? "Favorited" : "Favorite"}
      </button>
      {error ? <p className="mt-1 text-[10px] text-red-300">{error}</p> : null}
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`favorite-btn__heart h-3.5 w-3.5 shrink-0 ${filled ? "favorite-btn__heart--filled" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 2}
      />
    </svg>
  );
}
