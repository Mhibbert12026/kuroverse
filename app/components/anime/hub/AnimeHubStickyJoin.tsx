"use client";

type AnimeHubStickyJoinProps = {
  title: string;
};

export function AnimeHubStickyJoin({ title }: AnimeHubStickyJoinProps) {
  return (
    <div className="hub-sticky-join pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 lg:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-white/12 bg-[rgba(4,4,12,0.92)] p-3 shadow-[0_-8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold uppercase tracking-wider text-white/40">
            {title} Fandom
          </p>
          <p className="truncate text-sm font-semibold text-white">Join the community</p>
        </div>
        <a href="/#communities" className="hub-btn hub-btn--primary shrink-0 px-5 py-2.5 text-xs">
          Join
        </a>
      </div>
    </div>
  );
}
