import Link from "next/link";
import { TopNav } from "@/app/components/TopNav";
import { COMMUNITY_SLUGS } from "@/lib/communities";

export default function CommunityNotFound() {
  return (
    <div className="film-grain relative min-h-screen bg-background">
      <TopNav />
      <main className="page-enter flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-orange">404</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-white">Community not found</h1>
        <p className="mt-2 max-w-md text-sm text-white/50">
          This fandom hub does not exist yet. Browse our legendary communities below.
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {COMMUNITY_SLUGS.map((slug) => (
            <li key={slug}>
              <Link
                href={`/communities/${slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:border-accent-orange/40 hover:text-accent-orange"
              >
                {slug.replace(/-/g, " ")}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="mt-8 hub-btn hub-btn--primary"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
