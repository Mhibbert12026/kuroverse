import type { Metadata } from "next";
import { AppShell } from "@/app/components/layout/AppShell";
import { WatchlistPageView } from "@/app/components/watchlist/WatchlistPageView";
import { getUser } from "@/lib/auth/session";
import { pageTitle } from "@/lib/brand";
import { getWatchlistEntries } from "@/lib/watchlist/queries";

export const metadata: Metadata = {
  title: pageTitle("My Watchlist"),
  description: "Your saved anime on KuroVerse.",
};

export default async function WatchlistPage() {
  const user = await getUser();
  const initialEntries = user ? await getWatchlistEntries(user.id) : [];

  return (
    <AppShell ambience="profile" mainMax="narrow">
      <WatchlistPageView initialEntries={initialEntries} />
    </AppShell>
  );
}
