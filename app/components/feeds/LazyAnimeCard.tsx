"use client";

import type { ComponentProps, RefObject } from "react";
import {
  AnimeInteractiveCard,
  type AnimeCardVariant,
} from "@/app/components/anime/AnimeInteractiveCard";
import {
  AnimeCardCommunitySkeleton,
  AnimeCardLandscapeSkeleton,
  AnimeCardPortraitSkeleton,
} from "@/app/components/anime/AnimeSkeletons";
import { useLazyVisible } from "@/app/hooks/useLazyVisible";

type LazyAnimeCardProps = ComponentProps<typeof AnimeInteractiveCard> & {
  index?: number;
  rootRef?: RefObject<Element | null>;
};

function skeletonForVariant(variant: AnimeCardVariant, index: number) {
  switch (variant) {
    case "landscape":
      return <AnimeCardLandscapeSkeleton index={index} />;
    case "community":
      return <AnimeCardCommunitySkeleton index={index} />;
    default:
      return <AnimeCardPortraitSkeleton index={index} />;
  }
}

export function LazyAnimeCard({
  index = 0,
  rootRef,
  variant,
  className = "",
  ...props
}: LazyAnimeCardProps) {
  const { ref, visible } = useLazyVisible<HTMLDivElement>({ rootRef, once: true });

  return (
    <div
      ref={ref}
      className={`feed-lazy-item ${visible ? "feed-lazy-item--visible" : ""} ${className}`.trim()}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      {visible ? (
        <AnimeInteractiveCard variant={variant} {...props} />
      ) : (
        skeletonForVariant(variant, index)
      )}
    </div>
  );
}
