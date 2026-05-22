"use client";

import { useRef } from "react";
import type { TrendingClipCard } from "@/lib/anilist";
import { avatarForCreator } from "@/lib/images";
import { AnimeImage } from "./AnimeImage";
import { AnimeCardLink } from "./anime/AnimeCardLink";
import { AnimeInteractiveCard } from "./anime/AnimeInteractiveCard";
import { FeedLoadMoreSkeletons } from "./feeds/FeedLoadMoreSkeletons";
import { InfiniteScrollSentinel } from "./feeds/InfiniteScrollSentinel";
import { AnimeMetaRow, AnimeStatusBadge } from "./anime/AnimeBadges";
import { AnimeSectionNotice } from "./anime/AnimeSectionNotice";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { usePaginatedFeed } from "@/app/hooks/usePaginatedFeed";
import { useLazyVisible } from "@/app/hooks/useLazyVisible";
import { AnimeClipRowSkeleton } from "./anime/AnimeSkeletons";
import { SectionHeader } from "./SectionHeader";

type TrendingFeedProps = {
  initialClips: TrendingClipCard[];
  initialHasMore: boolean;
};

function LazyClipRow({
  clip,
  index,
  rootRef,
}: {
  clip: TrendingClipCard;
  index: number;
  rootRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { ref, visible } = useLazyVisible<HTMLElement>({ rootRef, once: true });

  if (!visible) {
    return (
      <article ref={ref} className="feed-lazy-item shrink-0">
        <AnimeClipRowSkeleton index={index} />
      </article>
    );
  }

  return (
    <article
      ref={ref}
      className={`feed-lazy-item feed-lazy-item--visible anime-card-premium anime-card-glow-orange group relative flex shrink-0 gap-4 overflow-hidden rounded-2xl border border-white/8 bg-surface-card`}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="anime-card-gradient-orb pointer-events-none" aria-hidden />
      <div className="relative h-[200px] w-[120px] shrink-0 sm:h-[240px] sm:w-[140px]">
        <span className="absolute left-2 top-2 z-20 rounded-lg bg-black/70 px-2 py-1 font-display text-xs font-bold text-white ring-1 ring-accent-orange/30 backdrop-blur-sm">
          #{index + 1}
        </span>
        <AnimeInteractiveCard
          anime={clip.anime}
          variant="thumb"
          glow="orange"
          embedded
          className="h-full rounded-none"
          sizes="140px"
        />
      </div>

      <div className="relative z-[2] flex min-w-0 flex-1 flex-col justify-between py-4 pr-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-accent-orange/40">
              <AnimeImage
                src={avatarForCreator(clip.creator)}
                alt={clip.creator}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="truncate text-sm font-medium text-white/90">@{clip.creator}</span>
            <AnimeStatusBadge status={clip.anime.status} />
          </div>
          <AnimeCardLink
            animeId={clip.anime.id}
            className="line-clamp-2 font-medium leading-snug text-white transition-colors duration-300 hover:text-accent-orange"
          >
            {clip.displayTitle}
          </AnimeCardLink>
          <div className="anime-card-title-meta mt-2">
            <AnimeMetaRow
              genres={clip.anime.genres}
              rating={clip.anime.rating}
              popularityLabel={clip.anime.popularityLabel}
              episodesLabel={clip.anime.episodesLabel}
            />
          </div>
          <span className="mt-2 inline-block rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-2 py-0.5 text-[10px] font-medium text-accent-cyan">
            {clip.tag}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-white/45">
          <span>{clip.views} views</span>
          <span className="text-accent-pink">{clip.likes} likes</span>
        </div>
      </div>

      <div className="anime-card-cinematic pointer-events-none rounded-2xl" aria-hidden />
    </article>
  );
}

export function TrendingFeed({ initialClips, initialHasMore }: TrendingFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { items, hasMore, loading, loadMore } = usePaginatedFeed({
    initialItems: initialClips,
    initialHasMore,
    fetchPath: "/api/feeds/clips",
  });

  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    root: scrollRef,
    rootMargin: "120px 0px",
  });

  return (
    <section className="flex flex-col gap-5">
      <SectionHeader
        title="Trending Clips"
        subtitle="Fan edits paired with live AniList covers"
        action={{ label: "View all", href: "/discover" }}
      />

      {items.length === 0 ? (
        <AnimeSectionNotice
          message="Trending clips are unavailable right now."
          variant="empty"
        />
      ) : (
        <div
          ref={scrollRef}
          className="feed-scroll feed-scroll-vertical flex max-h-[520px] flex-col gap-4 overflow-y-auto pr-1 sm:max-h-[640px] lg:max-h-[720px]"
        >
          {items.map((clip, index) => (
            <LazyClipRow
              key={clip.id}
              clip={clip}
              index={index}
              rootRef={scrollRef}
            />
          ))}

          {loading ? <FeedLoadMoreSkeletons variant="clip-row" count={2} /> : null}
          <InfiniteScrollSentinel sentinelRef={sentinelRef} />
        </div>
      )}
    </section>
  );
}
