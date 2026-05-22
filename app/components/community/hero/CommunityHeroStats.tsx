type CommunityHeroStatsProps = {
  memberLabel: string;
  onlineCount: number;
};

export function CommunityHeroStats({ memberLabel, onlineCount }: CommunityHeroStatsProps) {
  return (
    <div className="community-hero-stats flex flex-wrap items-stretch gap-3 sm:gap-4">
      <div className="community-hero-stat">
        <p className="community-hero-stat__value font-display text-2xl font-bold text-white sm:text-3xl">
          {memberLabel}
        </p>
        <p className="community-hero-stat__label">Members</p>
      </div>
      <div className="community-hero-stat__divider hidden h-auto w-px self-stretch sm:block" aria-hidden />
      <div className="community-hero-stat community-hero-stat--live">
        <p className="community-hero-stat__value flex items-center gap-2 font-display text-2xl font-bold text-emerald-400 sm:text-3xl">
          <span className="community-hero-stat__pulse" aria-hidden />
          {onlineCount.toLocaleString()}
        </p>
        <p className="community-hero-stat__label">Online now</p>
      </div>
    </div>
  );
}
