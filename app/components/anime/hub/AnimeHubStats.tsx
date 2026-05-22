import type { HubCommunityStats } from "@/lib/anilist/hub-types";

type AnimeHubStatsProps = {
  stats: HubCommunityStats;
  title: string;
};

const statItems = (
  stats: HubCommunityStats,
): { label: string; value: string; accent: string }[] => [
  { label: "Members", value: stats.members, accent: "text-accent-orange" },
  { label: "Online now", value: stats.online.toLocaleString(), accent: "text-emerald-400" },
  { label: "Discussions today", value: String(stats.discussionsToday), accent: "text-accent-cyan" },
  { label: "Clips shared", value: stats.clipsShared, accent: "text-accent-pink" },
  { label: "Watchlist adds", value: stats.watchlistAdds, accent: "text-accent-purple" },
  { label: "Episode threads", value: String(stats.episodeThreads), accent: "text-white" },
];

export function AnimeHubStats({ stats, title }: AnimeHubStatsProps) {
  return (
    <div className="rounded-2xl border border-white/8 glass-panel-deep p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
          Community Pulse
        </h3>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
          +{stats.growthPercent}% this week
        </span>
      </div>
      <p className="mt-1 text-xs text-white/40 line-clamp-1">{title} fandom</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {statItems(stats).map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/6 bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-white/12"
          >
            <p className={`font-display text-lg font-bold ${item.accent}`}>{item.value}</p>
            <p className="text-[10px] font-medium text-white/40">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
        <span className="text-xs font-semibold text-emerald-400">
          {stats.online.toLocaleString()} fans online
        </span>
      </div>
    </div>
  );
}
