"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { useAuth } from "@/app/providers/AuthProvider";
import { addFavoriteAction, removeFavoriteAction } from "@/lib/favorites/actions";
import { favoriteFromRow } from "@/lib/favorites/row";
import type { AnimeFavorite } from "@/lib/favorites/types";

type FavoritesContextValue = {
  favorites: AnimeFavorite[];
  loading: boolean;
  busyAnimeId: number | null;
  isFavorite: (animeId: number) => boolean;
  addFavorite: (animeId: number, title: string, coverUrl: string | null) => Promise<boolean>;
  removeFavorite: (animeId: number) => Promise<boolean>;
  toggleFavorite: (animeId: number, title: string, coverUrl: string | null) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type FavoritesProviderProps = {
  children: ReactNode;
};

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { user, configured } = useAuth();
  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);
  const [favorites, setFavorites] = useState<AnimeFavorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyAnimeId, setBusyAnimeId] = useState<number | null>(null);

  const refreshFavorites = useCallback(async () => {
    if (!supabase || !user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("anime_favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setFavorites(data.map((row) => favoriteFromRow(row)));
    }
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    void refreshFavorites();
  }, [user, refreshFavorites]);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.animeId)), [favorites]);

  const isFavorite = useCallback((animeId: number) => favoriteIds.has(animeId), [favoriteIds]);

  const addFavorite = useCallback(
    async (animeId: number, title: string, coverUrl: string | null) => {
      setBusyAnimeId(animeId);
      const result = await addFavoriteAction(animeId, title, coverUrl);
      if (result.ok && result.favorite) {
        setFavorites((prev) => {
          const rest = prev.filter((f) => f.animeId !== animeId);
          return [result.favorite!, ...rest];
        });
      }
      setBusyAnimeId(null);
      return result.ok;
    },
    [],
  );

  const removeFavorite = useCallback(async (animeId: number) => {
    setBusyAnimeId(animeId);
    const result = await removeFavoriteAction(animeId);
    if (result.ok) {
      setFavorites((prev) => prev.filter((f) => f.animeId !== animeId));
    }
    setBusyAnimeId(null);
    return result.ok;
  }, []);

  const toggleFavorite = useCallback(
    async (animeId: number, title: string, coverUrl: string | null) => {
      if (favoriteIds.has(animeId)) {
        return removeFavorite(animeId);
      }
      return addFavorite(animeId, title, coverUrl);
    },
    [favoriteIds, addFavorite, removeFavorite],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      loading,
      busyAnimeId,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      refreshFavorites,
    }),
    [favorites, loading, busyAnimeId, isFavorite, addFavorite, removeFavorite, toggleFavorite, refreshFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}
