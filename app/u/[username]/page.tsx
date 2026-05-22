import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/app/components/layout/AppShell";
import { ProfilePageView } from "@/app/components/profile/ProfilePageView";
import { getUser } from "@/lib/auth/session";
import { pageTitle } from "@/lib/brand";
import { getFavoritesForUser } from "@/lib/favorites/queries";
import { getJoinedFandomsForUser } from "@/lib/profile/fandoms";
import { getProfileByUsername } from "@/lib/profile/queries";
import { getProfileStats } from "@/lib/profile/stats";
import { getWatchlistEntries } from "@/lib/watchlist/queries";

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) {
    return { title: pageTitle("Profile Not Found") };
  }
  const name = profile.display_name ?? profile.username ?? "Member";
  return {
    title: `${name} (@${profile.username})`,
    description: profile.bio ?? `KuroVerse profile for @${profile.username}`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const currentUser = await getUser();
  const isOwner = currentUser?.id === profile.id;

  const [favorites, fandoms, watchlistPreview, stats] = await Promise.all([
    getFavoritesForUser(profile.id),
    getJoinedFandomsForUser(profile.id),
    getWatchlistEntries(profile.id),
    getProfileStats(profile.id),
  ]);

  return (
    <AppShell ambience="profile" mainMax="narrow" mainClassName="profile-page-main lg:max-w-4xl">
      <ProfilePageView
        profile={profile}
        isOwner={isOwner}
        favorites={favorites}
        fandoms={fandoms}
        watchlistPreview={watchlistPreview}
        stats={stats}
      />
    </AppShell>
  );
}
