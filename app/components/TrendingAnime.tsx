"use client";

import { useRef } from "react";
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

const rankGlow = ["orange", "cyan", "gold", "violet", "violet", "orange"] as const;
const rankRing = [
  "ring-accent-orange/50",
  "ring-accent-cyan/40",
  "ring-accent-gold/40",
  "ring-violet-500/40",
  "ring-pink-400/40",
  "ring-red-500/40",
];

type TrendingAnimeSectionProps = {
  initialAnime: AnimeCard[];
  initialHasMore: boolean;
};

export function TrendingAnimeSection({
  initialAnime,
  initialHasMore,
}: TrendingAnimeSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { items, hasMore, loading, loadMore } = usePaginatedFeed({
    initialItems: initialAnime,
    initialHasMore,
    fetchPath: "/api/feeds/trending",
  });

  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    root: scrollRef,
    rootMargin: "0px 320px 0px 0px",
  });

  return (
    <section id="trending-anime" className="section-glow home-section flex flex-col gap-5 sm:gap-6">
      <SectionHeader
        title="Trending Anime"
        subtitle="Official covers & ratings · Powered by AniList"
        action={{ label: "Discover clips", href: "/discover" }}
      />

      {items.length === 0 ? (
        <AnimeSectionNotice
          message="Trending anime could not be loaded. Please refresh shortly."
          variant="empty"
        />
      ) : (
        <div
          ref={scrollRef}
          className="horizontal-scroll feed-scroll-horizontal feed-scroll-horizontal--cards -mx-[var(--kv-page-px)] flex gap-3 overflow-x-auto px-[var(--kv-page-px)] pb-4 pt-2 sm:gap-4 lg:gap-5"
        >
          {items.map((item, index) => (
            <LazyAnimeCard
              key={item.id}
              index={index}
              rootRef={scrollRef}
              anime={item}
              variant="portrait"
              glow={rankGlow[index % rankGlow.length]}
              rank={item.rank}
              className={`anime-rail-card shrink-0 ring-1 ${rankRing[index % rankRing.length]}`}
            />
          ))}

          {loading ? (
            <FeedLoadMoreSkeletons variant="portrait" count={2} horizontal />
          ) : null}

          <InfiniteScrollSentinel sentinelRef={sentinelRef} className="feed-sentinel--horizontal" />
        </div>
      )}
    </section>
  );
}
