"use client";

import { useEffect, useRef } from "react";

type UseInfiniteScrollOptions = {
  enabled?: boolean;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  /** Scroll container; defaults to viewport when omitted. */
  root?: React.RefObject<Element | null>;
  rootMargin?: string;
  threshold?: number;
};

export function useInfiniteScroll({
  enabled = true,
  hasMore,
  loading,
  onLoadMore,
  root,
  rootMargin = "240px 0px",
  threshold = 0,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!enabled || !hasMore || loading) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMoreRef.current();
        }
      },
      {
        root: root?.current ?? null,
        rootMargin,
        threshold,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, hasMore, loading, root, rootMargin, threshold]);

  return sentinelRef;
}
