import type { SidebarUpcomingEpisode } from "@/lib/communities/sidebar.types";
import { SidebarWidget } from "./SidebarWidget";

type UpcomingEpisodesWidgetProps = {
  episodes: SidebarUpcomingEpisode[];
};

export function UpcomingEpisodesWidget({ episodes }: UpcomingEpisodesWidgetProps) {
  return (
    <SidebarWidget
      title="Upcoming"
      subtitle="Episodes & community events"
      icon={
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      }
    >
      <ul className="sidebar-episodes">
        {episodes.map((ep, i) => (
          <li key={ep.id}>
            <div className={`sidebar-episode ${ep.urgent ? "sidebar-episode--urgent" : ""}`}>
              <span className="sidebar-episode__rail" aria-hidden>
                <span className={`sidebar-episode__dot ${i === 0 ? "sidebar-episode__dot--active" : ""}`} />
                {i < episodes.length - 1 ? <span className="sidebar-episode__line" /> : null}
              </span>
              <div className="sidebar-episode__content min-w-0">
                <p className="sidebar-episode__title">{ep.title}</p>
                <p className="sidebar-episode__subtitle">{ep.subtitle}</p>
              </div>
              <span className="sidebar-episode__eta">{ep.eta}</span>
            </div>
          </li>
        ))}
      </ul>
    </SidebarWidget>
  );
}
