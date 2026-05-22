"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { needsProfileOnboarding, profileFromRow } from "@/lib/auth/profile";
import type { AuthView, UserProfile } from "@/lib/auth/types";
import { AuthModal } from "@/app/components/auth/AuthModal";
import { ProfileOnboardingModal } from "@/app/components/profile/ProfileOnboardingModal";
import { FavoritesProvider } from "@/app/providers/FavoritesProvider";
import { WatchlistProvider } from "@/app/providers/WatchlistProvider";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  authReady: boolean;
  configured: boolean;
  authOpen: boolean;
  authView: AuthView;
  returnTo: string | null;
  openAuth: (view?: AuthView, returnTo?: string) => void;
  closeAuth: () => void;
  clearReturnTo: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
  initialUser: User | null;
  initialProfile: UserProfile | null;
};

export function AuthProvider({ children, initialUser, initialProfile }: AuthProviderProps) {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [loading, setLoading] = useState(configured && !initialUser);
  const [authReady, setAuthReady] = useState(!configured || Boolean(initialUser));
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("sign-in");
  const [returnTo, setReturnTo] = useState<string | null>(null);

  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);

  const refreshProfile = useCallback(async () => {
    if (!supabase || !user) {
      setProfile(null);
      return;
    }

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

    if (data) {
      setProfile(profileFromRow(data));
    }
  }, [supabase, user]);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const resolveSession = async () => {
      if (!initialUser) setLoading(true);
      const {
        data: { user: sessionUser },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (sessionUser) {
        setUser(sessionUser);
        const { data } = await supabase.from("profiles").select("*").eq("id", sessionUser.id).maybeSingle();
        if (data) setProfile(profileFromRow(data));
      }

      setLoading(false);
      setAuthReady(true);
    };

    void resolveSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setAuthReady(true);
      setLoading(false);

      if (!nextUser) {
        setProfile(null);
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        let profileRow: Record<string, unknown> | null = null;
        const { data } = await supabase.from("profiles").select("*").eq("id", nextUser.id).maybeSingle();

        if (data) {
          profileRow = data;
          setProfile(profileFromRow(data));
        } else {
          await supabase.from("profiles").upsert({
            id: nextUser.id,
            display_name:
              nextUser.user_metadata?.full_name ??
              nextUser.user_metadata?.name ??
              nextUser.email?.split("@")[0] ??
              "Member",
            avatar_url: nextUser.user_metadata?.avatar_url ?? nextUser.user_metadata?.picture ?? null,
            onboarding_completed: false,
          });
          const { data: created } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", nextUser.id)
            .maybeSingle();
          if (created) {
            profileRow = created;
            setProfile(profileFromRow(created));
          }
        }

        if (event === "SIGNED_IN") {
          setAuthOpen(false);
          router.refresh();
        }
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase, initialUser, router]);

  const openAuth = useCallback((view: AuthView = "sign-in", nextPath?: string) => {
    setAuthView(view);
    if (nextPath?.startsWith("/")) {
      setReturnTo(nextPath);
    }
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
  }, []);

  const clearReturnTo = useCallback(() => {
    setReturnTo(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      authReady,
      configured,
      authOpen,
      authView,
      returnTo,
      openAuth,
      closeAuth,
      clearReturnTo,
      refreshProfile,
    }),
    [
      user,
      profile,
      loading,
      authReady,
      configured,
      authOpen,
      authView,
      returnTo,
      openAuth,
      closeAuth,
      clearReturnTo,
      refreshProfile,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      <WatchlistProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </WatchlistProvider>
      {configured ? (
        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
      ) : null}
      {configured && user && needsProfileOnboarding(profile) ? <ProfileOnboardingModal /> : null}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
