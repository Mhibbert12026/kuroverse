import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/app/components/layout/AppShell";
import { AnimeDetailView } from "@/app/components/anime/AnimeDetailView";
import { getAnimeHub } from "@/lib/anilist/hub";
import { pageTitle } from "@/lib/brand";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const animeId = Number(id);
  if (!Number.isFinite(animeId)) {
    return { title: pageTitle("Anime Not Found") };
  }

  const hub = await getAnimeHub(animeId);
  if (!hub) {
    return { title: pageTitle("Anime Not Found") };
  }

  return {
    title: `${hub.anime.title} Fandom Hub`,
    description: hub.anime.synopsis.slice(0, 160),
  };
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const animeId = Number(id);

  if (!Number.isFinite(animeId) || animeId <= 0) {
    notFound();
  }

  const hub = await getAnimeHub(animeId);

  if (!hub) {
    notFound();
  }

  return (
    <AppShell mainMax="full" mainClassName="!px-0 !pt-0">
      <AnimeDetailView hub={hub} />
    </AppShell>
  );
}
