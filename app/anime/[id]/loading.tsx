import { TopNav } from "@/app/components/TopNav";
import { AnimeDetailSkeleton } from "@/app/components/anime/AnimeDetailSkeleton";

export default function AnimeDetailLoading() {
  return (
    <div className="film-grain relative min-h-screen bg-background">
      <TopNav />
      <main className="page-enter pt-16">
        <AnimeDetailSkeleton />
      </main>
    </div>
  );
}
