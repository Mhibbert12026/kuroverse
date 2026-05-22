"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { LazyAnimeCard } from "@/app/components/feeds/LazyAnimeCard";
import { InfiniteScrollSentinel } from "@/app/components/feeds/InfiniteScrollSentinel";
import { FeedLoadMoreSkeletons } from "@/app/components/feeds/FeedLoadMoreSkeletons";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { usePaginatedFeed } from "@/app/hooks/usePaginatedFeed";
import { SectionHeader } from "@/app/components/SectionHeader";
import type { HomePersonalizedPage } from "@/lib/home/types";

type HomePersonalizedSectionProps = {
  initial?: HomePersonalizedPage | null;
};

export function HomePersonalizedSection({ initial }: HomePersonalizedSectionProps) {
  const { user } = useAuth();

  const { items, hasMore, loading, loadMore } = usePaginatedFeed({
    initialItems: initial?.items ?? [],
    initialHasMore: initial?.hasMore ?? true,
    fetchPath: "/api/home/recommendations",
  });

  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
  });

  if (!user && !items.length) return null;

  const label = initial?.label ?? "For you";

  return (
    <section className="home-section home-personalized" aria-labelledby="home-personalized-heading">
      <SectionHeader
        title={user ? label : "Top picks"}
        subtitle={
          user
            ? "Pulled from your favorites and watchlist — refreshed as you explore."
            : "Sign in for recommendations tuned to your taste."
        }
        action={user ? { label: "My watchlist", href: "/watchlist" } : undefined}
      />

      {items.length === 0 ? (
        <p className="home-personalized__empty">
          Heart anime across KuroVerse to train your feed.
        </p>
      ) : (
        <div className="home-personalized__grid">
          {items.map((anime, index) => (
            <LazyAnimeCard
              key={anime.id}
              index={index}
              anime={anime}
              variant="portrait"
              glow="purple"
              matchPercent={anime.matchPercent}
              className="home-personalized__card"
            />
          ))}
          {loading ? <FeedLoadMoreSkeletons variant="portrait" count={2} horizontal /> : null}
        </div>
      )}

      <InfiniteScrollSentinel sentinelRef={sentinelRef} />
    </section>
  );
}
