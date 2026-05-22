"use client";

import {
  AnimeCardLandscapeSkeleton,
  AnimeCardPortraitSkeleton,
  AnimeClipRowSkeleton,
} from "@/app/components/anime/AnimeSkeletons";

type FeedLoadMoreSkeletonsProps = {
  variant: "portrait" | "landscape" | "clip-row";
  count?: number;
  horizontal?: boolean;
};

export function FeedLoadMoreSkeletons({
  variant,
  count = 2,
  horizontal = false,
}: FeedLoadMoreSkeletonsProps) {
  const items = Array.from({ length: count });

  if (variant === "portrait") {
    return (
      <div
        className={`feed-load-more ${horizontal ? "feed-load-more--horizontal" : ""}`}
        aria-busy="true"
        aria-label="Loading more anime"
      >
        {items.map((_, index) => (
          <AnimeCardPortraitSkeleton key={index} index={index} />
        ))}
      </div>
    );
  }

  if (variant === "landscape") {
    return (
      <div className="feed-load-more feed-load-more--grid" aria-busy="true" aria-label="Loading more recommendations">
        {items.map((_, index) => (
          <AnimeCardLandscapeSkeleton key={index} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="feed-load-more feed-load-more--stack" aria-busy="true" aria-label="Loading more clips">
      {items.map((_, index) => (
        <AnimeClipRowSkeleton key={index} index={index} />
      ))}
    </div>
  );
}
