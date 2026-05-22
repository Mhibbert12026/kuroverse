"use client";

import { useCallback } from "react";
import type { HomeActivityItem, HomeActivityPage } from "@/lib/home/types";
import { useHomeRealtime } from "@/app/hooks/useHomeRealtime";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import { usePaginatedFeed } from "@/app/hooks/usePaginatedFeed";
import { InfiniteScrollSentinel } from "@/app/components/feeds/InfiniteScrollSentinel";
import { HomeActivityItemCard } from "./HomeActivityItem";

type HomeActivityFeedProps = {
  initialPage: HomeActivityPage;
  onLiveUpdate?: (snapshot: import("@/lib/home/types").HomeLiveSnapshot) => void;
};

export function HomeActivityFeed({ initialPage, onLiveUpdate }: HomeActivityFeedProps) {
  const { items, hasMore, loading, loadMore, setItems } = usePaginatedFeed({
    initialItems: initialPage.items,
    initialHasMore: initialPage.hasMore,
    fetchPath: "/api/home/activity",
    getId: (item) => item.id,
  });

  const mergeHead = useCallback(
    (fresh: HomeActivityItem[]) => {
      setItems((prev) => {
        const seen = new Set(prev.map((i) => i.id));
        const novel = fresh.filter((i) => !seen.has(i.id));
        if (!novel.length) return prev;
        return [...novel, ...prev];
      });
    },
    [setItems],
  );

  const { connected } = useHomeRealtime({
    onActivityPrepended: mergeHead,
    onLiveUpdate,
  });

  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <section className="home-activity-feed" aria-labelledby="home-activity-heading">
      <header className="home-activity-feed__header">
        <div>
          <h2 id="home-activity-heading" className="home-activity-feed__title">
            Live activity
          </h2>
          <p className="home-activity-feed__subtitle">
            Posts, replies, and reactions across the fandom — updates in real time.
          </p>
        </div>
        <span
          className={`home-live-pill${connected ? " home-live-pill--on" : ""}`}
          title={connected ? "Realtime connected" : "Connecting…"}
        >
          <span className="home-live-pill__dot" aria-hidden />
          {connected ? "Live" : "Syncing"}
        </span>
      </header>

      {items.length === 0 ? (
        <p className="home-activity-feed__empty">
          No community activity yet. Join a hub and start the conversation.
        </p>
      ) : (
        <div className="home-activity-feed__list" role="feed">
          {items.map((item, index) => (
            <HomeActivityItemCard key={item.id} item={item} index={index} />
          ))}
        </div>
      )}

      {loading ? (
        <p className="home-activity-feed__loading" aria-live="polite">
          Loading more activity…
        </p>
      ) : null}

      <InfiniteScrollSentinel sentinelRef={sentinelRef} />
    </section>
  );
}
