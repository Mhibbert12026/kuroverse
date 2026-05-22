"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  addToWatchlistAction,
  removeFromWatchlistAction,
  updateWatchlistStatusAction,
} from "@/lib/watchlist/actions";
import { DEFAULT_WATCHLIST_STATUS } from "@/lib/watchlist/constants";
import { migrateLocalWatchlistToSupabase } from "@/lib/watchlist/migrate-local";
import { entryFromRow } from "@/lib/watchlist/row";
import type { WatchlistEntry, WatchlistStatus } from "@/lib/watchlist/types";

type WatchlistContextValue = {
  entries: WatchlistEntry[];
  loading: boolean;
  busyAnimeId: number | null;
  getEntry: (animeId: number) => WatchlistEntry | undefined;
  isOnWatchlist: (animeId: number) => boolean;
  addToWatchlist: (
    animeId: number,
    title: string,
    coverUrl: string | null,
    status?: WatchlistStatus,
  ) => Promise<boolean>;
  removeFromWatchlist: (animeId: number) => Promise<boolean>;
  setWatchlistStatus: (animeId: number, status: WatchlistStatus) => Promise<boolean>;
  refreshWatchlist: () => Promise<void>;
};

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

type WatchlistProviderProps = {
  children: ReactNode;
  initialEntries?: WatchlistEntry[];
};

export function WatchlistProvider({ children, initialEntries = [] }: WatchlistProviderProps) {
  const { user, configured } = useAuth();
  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);
  const [entries, setEntries] = useState<WatchlistEntry[]>(initialEntries);
  const [loading, setLoading] = useState(false);
  const [busyAnimeId, setBusyAnimeId] = useState<number | null>(null);
  const migratedRef = useRef(false);

  const refreshWatchlist = useCallback(async () => {
    if (!supabase || !user) {
      setEntries([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("watchlist_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setEntries(data.map((row) => entryFromRow(row)));
    }
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      migratedRef.current = false;
      return;
    }

    void (async () => {
      await refreshWatchlist();
      if (!migratedRef.current) {
        migratedRef.current = true;
        await migrateLocalWatchlistToSupabase();
        await refreshWatchlist();
      }
    })();
  }, [user, refreshWatchlist]);

  const byAnimeId = useMemo(() => {
    const map = new Map<number, WatchlistEntry>();
    for (const entry of entries) {
      map.set(entry.animeId, entry);
    }
    return map;
  }, [entries]);

  const getEntry = useCallback((animeId: number) => byAnimeId.get(animeId), [byAnimeId]);

  const isOnWatchlist = useCallback((animeId: number) => byAnimeId.has(animeId), [byAnimeId]);

  const addToWatchlist = useCallback(
    async (
      animeId: number,
      title: string,
      coverUrl: string | null,
      status: WatchlistStatus = DEFAULT_WATCHLIST_STATUS,
    ) => {
      setBusyAnimeId(animeId);
      const result = await addToWatchlistAction(animeId, title, coverUrl, status);
      if (result.ok && result.entry) {
        setEntries((prev) => {
          const rest = prev.filter((e) => e.animeId !== animeId);
          return [result.entry!, ...rest];
        });
      }
      setBusyAnimeId(null);
      return result.ok;
    },
    [],
  );

  const removeFromWatchlist = useCallback(async (animeId: number) => {
    setBusyAnimeId(animeId);
    const result = await removeFromWatchlistAction(animeId);
    if (result.ok) {
      setEntries((prev) => prev.filter((e) => e.animeId !== animeId));
    }
    setBusyAnimeId(null);
    return result.ok;
  }, []);

  const setWatchlistStatus = useCallback(async (animeId: number, status: WatchlistStatus) => {
    setBusyAnimeId(animeId);
    const result = await updateWatchlistStatusAction(animeId, status);
    if (result.ok && result.entry) {
      setEntries((prev) => prev.map((e) => (e.animeId === animeId ? result.entry! : e)));
    }
    setBusyAnimeId(null);
    return result.ok;
  }, []);

  const value = useMemo<WatchlistContextValue>(
    () => ({
      entries,
      loading,
      busyAnimeId,
      getEntry,
      isOnWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      setWatchlistStatus,
      refreshWatchlist,
    }),
    [
      entries,
      loading,
      busyAnimeId,
      getEntry,
      isOnWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      setWatchlistStatus,
      refreshWatchlist,
    ],
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }
  return ctx;
}

export function useWatchlistOptional(): WatchlistContextValue | null {
  return useContext(WatchlistContext);
}
