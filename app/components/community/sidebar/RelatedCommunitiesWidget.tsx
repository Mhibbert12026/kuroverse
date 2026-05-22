import Link from "next/link";
import { AnimeImage } from "@/app/components/AnimeImage";
import type { SidebarRelatedCommunity } from "@/lib/communities/sidebar.types";
import { accentBadge } from "../community-styles";
import { SidebarWidget } from "./SidebarWidget";

type RelatedCommunitiesWidgetProps = {
  communities: SidebarRelatedCommunity[];
};

export function RelatedCommunitiesWidget({ communities }: RelatedCommunitiesWidgetProps) {
  return (
    <SidebarWidget
      title="Related Communities"
      subtitle="Fandoms you might join next"
      actionLabel="Explore"
      actionHref="/#communities"
      fullWidth
      icon={
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      }
    >
      <ul className="sidebar-related-list">
        {communities.map((c) => (
          <li key={c.slug}>
            <Link href={`/communities/${c.slug}`} className="sidebar-related-item">
              <div className="sidebar-related-item__thumb">
                <AnimeImage src={c.coverUrl} alt={c.name} fill className="object-cover" sizes="48px" />
                <span className={`sidebar-related-item__accent ${accentBadge[c.accent]}`} />
              </div>
              <div className="sidebar-related-item__meta min-w-0">
                <p className="sidebar-related-item__name">{c.name}</p>
                <p className="sidebar-related-item__stats">
                  <span>{c.members}</span>
                  <span className="sidebar-related-item__dot" />
                  <span className="text-accent-cyan/80">{c.online}</span>
                </p>
              </div>
              <span className="sidebar-related-item__arrow" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SidebarWidget>
  );
}
