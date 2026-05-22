import type { ProfileStats } from "@/lib/profile/stats";

type ProfileStatsRowProps = {
  stats: ProfileStats;
};

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="profile-stat-cell">
      <span className="profile-stat-cell__value">{value.toLocaleString()}</span>
      <span className="profile-stat-cell__label">{label}</span>
    </div>
  );
}

export function ProfileStatsRow({ stats }: ProfileStatsRowProps) {
  return (
    <div className="profile-stats-row" role="list">
      <StatCell label="Favorites" value={stats.favoriteCount} />
      <StatCell label="Watchlist" value={stats.watchlistCount} />
      <StatCell label="Fandoms" value={stats.fandomCount} />
      <StatCell label="Followers" value={stats.followerCount} />
      <StatCell label="Following" value={stats.followingCount} />
    </div>
  );
}
