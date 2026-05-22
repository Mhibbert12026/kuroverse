"use client";

import { useCallback, useState } from "react";

type PaginatedResponse<T> = {
  items: T[];
  page: number;
  hasMore: boolean;
};

type UsePaginatedFeedOptions<T extends { id: string | number }> = {
  initialItems: T[];
  initialHasMore: boolean;
  fetchPath: string;
  getId?: (item: T) => string | number;
};

export function usePaginatedFeed<T extends { id: string | number }>({
  initialItems,
  initialHasMore,
  fetchPath,
  getId = (item) => item.id,
}: UsePaginatedFeedOptions<T>) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`${fetchPath}?page=${nextPage}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as PaginatedResponse<T>;

      setItems((prev) => {
        const seen = new Set(prev.map((item) => getId(item)));
        const fresh = data.items.filter((item) => !seen.has(getId(item)));
        return [...prev, ...fresh];
      });
      setPage(nextPage);
      setHasMore(data.hasMore);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [fetchPath, getId, hasMore, loading, page]);

  return { items, hasMore, loading, loadMore, setItems };
}
