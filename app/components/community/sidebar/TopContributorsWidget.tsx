import { AnimeImage } from "@/app/components/AnimeImage";
import type { SidebarContributor } from "@/lib/communities/sidebar.types";
import { SidebarWidget } from "./SidebarWidget";

type TopContributorsWidgetProps = {
  contributors: SidebarContributor[];
};

const BADGE_LABEL: Record<NonNullable<SidebarContributor["badge"]>, string> = {
  gold: "🥇",
  silver: "🥈",
  bronze: "🥉",
};

export function TopContributorsWidget({ contributors }: TopContributorsWidgetProps) {
  return (
    <SidebarWidget
      title="Top Contributors"
      subtitle="Most active this month"
      actionLabel="Leaderboard"
      actionHref="#"
      icon={
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      }
    >
      <ol className="sidebar-contributors">
        {contributors.map((c) => (
          <li key={c.name} className="sidebar-contributor">
            <span className="sidebar-contributor__rank" data-rank={c.rank}>
              {c.badge ? BADGE_LABEL[c.badge] : c.rank}
            </span>
            <div className="sidebar-contributor__avatar">
              <AnimeImage src={c.avatarUrl} alt={c.name} fill className="object-cover" sizes="40px" />
            </div>
            <div className="sidebar-contributor__meta min-w-0">
              <p className="sidebar-contributor__name">@{c.name}</p>
              <p className="sidebar-contributor__stats">
                <span>{c.reputation}</span>
                <span className="sidebar-contributor__dot" />
                <span>{c.posts} posts</span>
              </p>
            </div>
            <button type="button" className="sidebar-contributor__follow">
              Follow
            </button>
          </li>
        ))}
      </ol>
    </SidebarWidget>
  );
}
