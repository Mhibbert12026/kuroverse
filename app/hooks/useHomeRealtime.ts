"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { HomeActivityItem, HomeLiveSnapshot } from "@/lib/home/types";

type UseHomeRealtimeOptions = {
  onActivityPrepended?: (items: HomeActivityItem[]) => void;
  onLiveUpdate?: (snapshot: HomeLiveSnapshot) => void;
  enabled?: boolean;
};

export function useHomeRealtime({
  onActivityPrepended,
  onLiveUpdate,
  enabled = true,
}: UseHomeRealtimeOptions) {
  const [connected, setConnected] = useState(false);
  const [lastEventAt, setLastEventAt] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshLive = useCallback(async () => {
    try {
      const res = await fetch("/api/home/live", { cache: "no-store" });
      if (!res.ok) return;
      const snapshot = (await res.json()) as HomeLiveSnapshot;
      onLiveUpdate?.(snapshot);
    } catch {
      /* ignore */
    }
  }, [onLiveUpdate]);

  const refreshActivityHead = useCallback(async () => {
    try {
      const res = await fetch("/api/home/activity?page=1", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { items: HomeActivityItem[] };
      onActivityPrepended?.(data.items.slice(0, 5));
    } catch {
      /* ignore */
    }
  }, [onActivityPrepended]);

  const bump = useCallback(() => {
    setLastEventAt(new Date().toISOString());
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void refreshLive();
      void refreshActivityHead();
    }, 450);
  }, [refreshLive, refreshActivityHead]);

  useEffect(() => {
    if (!enabled || !isSupabaseConfigured()) return;

    const supabase = createClient();
    const channel = supabase
      .channel("home-live-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_posts" },
        () => bump(),
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_post_comments" },
        () => bump(),
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_post_likes" },
        () => bump(),
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_subscriptions" },
        () => bump(),
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      void supabase.removeChannel(channel);
    };
  }, [enabled, bump]);

  return { connected, lastEventAt, refreshLive, refreshActivityHead };
}
