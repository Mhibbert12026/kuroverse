"use client";

import type { AnimeCard } from "@/lib/anilist";
import { AnimeSectionNotice } from "./anime/AnimeSectionNotice";
import {
  FeedLoadMoreSkeletons,
  InfiniteScrollSentinel,
  LazyAnimeCard,
} from "./feeds";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { usePaginatedFeed } from "@/app/hooks/usePaginatedFeed";
import { SectionHeader } from "./SectionHeader";

type RecommendationCardsProps = {
  initialAnime: AnimeCard[];
  initialHasMore: boolean;
};

export function RecommendationCards({
  initialAnime,
  initialHasMore,
}: RecommendationCardsProps) {
  const { items, hasMore, loading, loadMore } = usePaginatedFeed({
    initialItems: initialAnime,
    initialHasMore,
    fetchPath: "/api/feeds/recommendations",
  });

  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
  });

  return (
    <section className="home-section flex flex-col gap-4 sm:gap-5">
      <SectionHeader
        title="For You"
        subtitle="Top-rated picks from AniList · Updated hourly"
        action={{ label: "My watchlist", href: "/watchlist" }}
      />

      {items.length === 0 ? (
        <AnimeSectionNotice
          message="Recommendations are unavailable right now."
          variant="empty"
        />
      ) : (
        <div className="recommendation-grid grid gap-3 sm:grid-cols-2 sm:gap-4">
          {items.map((item, index) => (
            <LazyAnimeCard
              key={item.id}
              index={index}
              anime={item}
              variant="landscape"
              glow="purple"
              matchPercent={item.matchPercent}
            />
          ))}

          {loading ? <FeedLoadMoreSkeletons variant="landscape" count={2} /> : null}
          <InfiniteScrollSentinel sentinelRef={sentinelRef} />
        </div>
      )}
    </section>
  );
}
