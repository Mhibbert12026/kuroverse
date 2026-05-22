import type { CommunityPageData } from "@/lib/communities/types";
import { AnimeImage } from "@/app/components/AnimeImage";

type CommunityStatsProps = {
  stats: CommunityPageData["stats"];
};

export function CommunityStats({ stats }: CommunityStatsProps) {
  return (
    <section className="hub-panel">
      <h2 className="font-display text-xl font-bold text-white sm:text-2xl">Community Pulse</h2>
      <p className="mt-1 text-sm text-white/45">Live activity across the fandom</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="community-stat-card">
          <p className="font-display text-2xl font-bold text-emerald-400">
            {stats.online.toLocaleString()}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">Active now</p>
        </div>
        <div className="community-stat-card">
          <p className="font-display text-2xl font-bold text-white">{stats.members}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">Members</p>
        </div>
        <div className="community-stat-card">
          <p className="font-display text-2xl font-bold text-accent-cyan">{stats.postsToday}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">Posts today</p>
        </div>
        <div className="community-stat-card">
          <p className="font-display text-2xl font-bold text-accent-orange">
            {stats.trendingTopics.length}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">Hot topics</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">Trending topics</p>
        <div className="flex flex-wrap gap-2">
          {stats.trendingTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-accent-orange/25 bg-accent-orange/10 px-3 py-1 text-xs font-semibold text-accent-orange transition-colors hover:bg-accent-orange/20"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-white/6 pt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/40">Top contributors</p>
        <ul className="flex flex-col gap-2">
          {stats.topContributors.map((c, i) => (
            <li
              key={c.name}
              className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2 transition-colors hover:border-white/12"
            >
              <span className="font-display text-sm font-bold text-white/30">#{i + 1}</span>
              <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/10">
                <AnimeImage src={c.avatarUrl} alt={c.name} fill className="object-cover" sizes="32px" />
              </div>
              <span className="flex-1 text-sm font-semibold text-white">@{c.name}</span>
              <span className="text-xs text-white/40">{c.posts} posts</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
