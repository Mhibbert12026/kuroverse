import Link from "next/link";
import { TopNav } from "@/app/components/TopNav";

export default function AnimeNotFound() {
  return (
    <div className="film-grain relative min-h-screen bg-background">
      <TopNav />
      <main className="page-enter flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-orange">
          404
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-white">Anime not found</h1>
        <p className="mt-2 max-w-md text-sm text-white/50">
          This title may have been removed from AniList or the link is invalid.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-gradient-to-r from-accent-orange to-accent-pink px-8 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
