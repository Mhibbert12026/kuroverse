"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { AnimeImage } from "@/app/components/AnimeImage";
import { InfiniteScrollSentinel } from "@/app/components/feeds/InfiniteScrollSentinel";
import { useLazyVisible } from "@/app/hooks/useLazyVisible";
import { useProgressiveList } from "@/app/hooks/useProgressiveList";
import { FALLBACK_COVER } from "@/lib/anilist/constants";
import type { AnimeFavorite } from "@/lib/favorites/types";
import { SkeletonBone } from "@/app/components/anime/SkeletonBone";

type ProfileFavoritesGridProps = {
  favorites: AnimeFavorite[];
  isOwner: boolean;
  legacyFavorite?: string | null;
};

function LazyFavoriteItem({ item, index }: { item: AnimeFavorite; index: number }) {
  const { ref, visible } = useLazyVisible<HTMLLIElement>({ rootMargin: "100px 0px", once: true });

  return (
    <li
      ref={ref}
      className={`profile-favorites__item feed-lazy-item ${visible ? "feed-lazy-item--visible" : ""}`}
      style={{ animationDelay: `${Math.min(index, 11) * 45}ms` }}
    >
      {visible ? (
        <Link href={`/anime/${item.animeId}`} className="profile-favorites__link">
          <AnimeImage
            src={item.animeCoverUrl ?? FALLBACK_COVER}
            alt=""
            width={120}
            height={170}
            className="profile-favorites__cover"
            loading="lazy"
          />
          <span className="profile-favorites__overlay" aria-hidden />
          <span className="profile-favorites__name">{item.animeTitle}</span>
          <span className="profile-favorites__heart" aria-hidden>
            ♥
          </span>
        </Link>
      ) : (
        <div className="profile-favorites__skeleton" aria-hidden>
          <SkeletonBone className="h-[170px] w-full rounded-xl" delay={index * 50} />
        </div>
      )}
    </li>
  );
}

export function ProfileFavoritesGrid({ favorites, isOwner, legacyFavorite }: ProfileFavoritesGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ordered = useMemo(() => favorites, [favorites]);
  const { visibleItems, hasMore, sentinelRef } = useProgressiveList({
    items: ordered,
    pageSize: 8,
    enabled: ordered.length > 8,
  });

  const hasGrid = favorites.length > 0;

  if (!hasGrid && !legacyFavorite) {
    if (!isOwner) return null;
    return (
      <section className="profile-section profile-favorites profile-favorites--empty" aria-labelledby="profile-favorites-heading">
        <h2 id="profile-favorites-heading" className="profile-section__title">
          Favorite anime
        </h2>
        <p className="profile-favorites__empty-text">
          Tap the heart on any anime card to showcase your top series here.
        </p>
      </section>
    );
  }

  return (
    <section className="profile-section profile-favorites" aria-labelledby="profile-favorites-heading">
      <div className="profile-section__head">
        <h2 id="profile-favorites-heading" className="profile-section__title">
          Favorite anime
        </h2>
        {hasGrid ? (
          <span className="profile-section__count">{favorites.length}</span>
        ) : null}
      </div>

      {hasGrid ? (
        <div ref={scrollRef}>
          <ul className="profile-favorites__grid">
            {visibleItems.map((item, index) => (
              <LazyFavoriteItem key={item.id} item={item} index={index} />
            ))}
          </ul>
          {hasMore ? <InfiniteScrollSentinel sentinelRef={sentinelRef} /> : null}
        </div>
      ) : legacyFavorite ? (
        <div className="profile-stat-pill">
          <span className="profile-stat-pill__label">Top pick</span>
          <span className="profile-stat-pill__value">{legacyFavorite}</span>
        </div>
      ) : null}
    </section>
  );
}
