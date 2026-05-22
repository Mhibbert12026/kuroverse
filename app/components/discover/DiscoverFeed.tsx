"use client";

import { useEffect, useRef, useState } from "react";
import type { DiscoverClipItem } from "@/lib/discover/types";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { usePaginatedFeed } from "@/app/hooks/usePaginatedFeed";
import { DiscoverSlideSkeleton } from "./DiscoverSlideSkeleton";
import { LazyDiscoverClipSlide } from "./LazyDiscoverClipSlide";
import { DiscoverFeedChrome } from "./DiscoverFeedChrome";

type DiscoverFeedProps = {
  initialClips: DiscoverClipItem[];
  initialHasMore: boolean;
};

export function DiscoverFeed({ initialClips, initialHasMore }: DiscoverFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { items: clips, hasMore, loading, loadMore } = usePaginatedFeed({
    initialItems: initialClips,
    initialHasMore,
    fetchPath: "/api/discover",
  });

  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    root: scrollRef,
    rootMargin: "200px 0px",
  });

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(index)) setActiveIndex(index);
          }
        });
      },
      { root, threshold: 0.55 },
    );

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [clips.length]);

  return (
    <div className="discover-shell">
      <DiscoverFeedChrome />

      <div ref={scrollRef} className="discover-feed" role="feed" aria-label="Anime discovery clips">
        {clips.map((clip, index) => (
          <div
            key={clip.id}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            data-index={index}
            className="discover-feed__snap"
          >
            <LazyDiscoverClipSlide
              clip={clip}
              isActive={index === activeIndex}
              rootRef={scrollRef}
            />
          </div>
        ))}

        {loading ? <DiscoverSlideSkeleton /> : null}

        <div ref={sentinelRef} className="discover-feed__sentinel" aria-hidden />

        {!hasMore && clips.length > 0 ? (
          <div className="discover-feed__end">
            <p>You&apos;re all caught up</p>
            <a href="/" className="hub-btn hub-btn--secondary text-xs">
              Back to home
            </a>
          </div>
        ) : null}

        {clips.length === 0 && !loading ? (
          <div className="discover-feed__empty">
            <p>Clips unavailable right now.</p>
            <a href="/" className="hub-btn hub-btn--primary text-xs">
              Explore home
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
