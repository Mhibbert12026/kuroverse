import type { AnimeHubData } from "@/lib/anilist/hub-types";
import { AnimeHubCarousel } from "./hub/AnimeHubCarousel";
import { AnimeHubCinematicBanner } from "./hub/AnimeHubCinematicBanner";
import { AnimeHubClips } from "./hub/AnimeHubClips";
import { AnimeHubDiscussion } from "./hub/AnimeHubDiscussion";
import { AnimeHubFanZone } from "./hub/AnimeHubFanZone";
import { AnimeHubHero } from "./hub/AnimeHubHero";
import { AnimeHubMetadata } from "./hub/AnimeHubMetadata";
import { AnimeHubStats } from "./hub/AnimeHubStats";
import { AnimeHubStickyJoin } from "./hub/AnimeHubStickyJoin";
import { AnimeHubTrailer } from "./hub/AnimeHubTrailer";
import { AnimeHubFavorite } from "./hub/AnimeHubFavorite";
import { AnimeHubWatchlist } from "./hub/AnimeHubWatchlist";

type AnimeDetailViewProps = {
  hub: AnimeHubData;
};

export function AnimeDetailView({ hub }: AnimeDetailViewProps) {
  const { anime, related, alsoWatch, clips, discussions, reactions, comments, stats } = hub;
  const accent = anime.accentColor ?? "#7c3aed";

  return (
    <div className="hub-page relative min-h-screen bg-background pb-28 lg:pb-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full blur-[120px] opacity-25"
          style={{ backgroundColor: accent }}
        />
        <div className="absolute -right-32 top-1/3 h-[360px] w-[360px] rounded-full bg-accent-purple/12 blur-[100px]" />
      </div>

      <AnimeHubCinematicBanner anime={anime} />
      <AnimeHubHero anime={anime} stats={stats} />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-8 sm:gap-10">
            <AnimeHubMetadata anime={anime} stats={stats} />
            <AnimeHubTrailer anime={anime} />
            <AnimeHubCarousel
              title="Related Anime"
              subtitle={`More ${anime.genres[0] ?? "series"} fans are exploring`}
              anime={related}
              glow="cyan"
              emptyMessage="Related titles will appear when genre data is available."
            />
            <AnimeHubClips clips={clips} title={anime.title} />
            <AnimeHubDiscussion discussions={discussions} title={anime.title} />
            <AnimeHubFanZone reactions={reactions} comments={comments} title={anime.title} />
            <AnimeHubCarousel
              title="People Also Watch"
              subtitle="Curated from AniList recommendations"
              anime={alsoWatch}
              glow="purple"
              emptyMessage="Recommendations are loading from AniList — check back shortly."
            />
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:pb-4 feed-scroll">
            <div className="lg:hidden">
              <AnimeHubStats stats={stats} title={anime.title} />
            </div>
            <AnimeHubWatchlist animeId={anime.id} title={anime.title} coverUrl={anime.coverUrl} />
            <AnimeHubFavorite animeId={anime.id} title={anime.title} coverUrl={anime.coverUrl} />
            <div className="hub-panel hidden border-accent-orange/25 lg:block">
              <h3 className="font-display font-bold text-white">Join the fandom</h3>
              <p className="mt-2 text-sm text-white/50">
                Live threads, clip drops, and watch parties for {anime.title}.
              </p>
              <a href="/#communities" className="hub-btn hub-btn--primary mt-4 w-full justify-center">
                Join Community
              </a>
              <a href="#hub-discussions" className="hub-btn hub-btn--secondary mt-2 w-full justify-center">
                View discussions
              </a>
            </div>
          </aside>
        </div>
      </div>

      <AnimeHubStickyJoin title={anime.title} />
    </div>
  );
}
