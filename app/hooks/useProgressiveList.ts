"use client";

import { useCallback, useEffect, useState } from "react";
import { useInfiniteScroll } from "./useInfiniteScroll";

type UseProgressiveListOptions<T> = {
  items: T[];
  pageSize?: number;
  enabled?: boolean;
};

export function useProgressiveList<T>({
  items,
  pageSize = 12,
  enabled = true,
}: UseProgressiveListOptions<T>) {
  const [visibleCount, setVisibleCount] = useState(() =>
    enabled ? Math.min(pageSize, items.length) : items.length,
  );

  useEffect(() => {
    if (!enabled) {
      setVisibleCount(items.length);
      return;
    }
    setVisibleCount((count) => Math.min(Math.max(count, pageSize), items.length));
  }, [enabled, items.length, pageSize]);

  const hasMore = enabled && visibleCount < items.length;
  const loading = false;

  const loadMore = useCallback(() => {
    setVisibleCount((count) => Math.min(count + pageSize, items.length));
  }, [items.length, pageSize]);

  const sentinelRef = useInfiniteScroll({
    enabled,
    hasMore,
    loading,
    onLoadMore: loadMore,
    rootMargin: "200px 0px",
  });

  const visibleItems = items.slice(0, visibleCount);

  return { visibleItems, hasMore, loading, sentinelRef, visibleCount };
}
