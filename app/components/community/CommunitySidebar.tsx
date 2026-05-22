import type { CommunitySidebarData } from "@/lib/communities/sidebar.types";
import {
  PopularAnimeRankingsWidget,
  RelatedAnimeWidget,
  RelatedCommunitiesWidget,
  SidebarPremiumCta,
  TopContributorsWidget,
  TrendingTagsWidget,
  UpcomingEpisodesWidget,
} from "./sidebar";

type CommunitySidebarProps = {
  sidebar: CommunitySidebarData;
};

export function CommunitySidebar({ sidebar }: CommunitySidebarProps) {
  return (
    <aside className="community-sidebar" aria-label="Community sidebar">
      <div className="community-sidebar__grid">
        <RelatedAnimeWidget anime={sidebar.relatedAnime} />
        <RelatedCommunitiesWidget communities={sidebar.related} />
        <TrendingTagsWidget tags={sidebar.trendingTags} />
        <UpcomingEpisodesWidget episodes={sidebar.upcomingEpisodes} />
        <TopContributorsWidget contributors={sidebar.topContributors} />
        <PopularAnimeRankingsWidget rankings={sidebar.popularRankings} />
        <SidebarPremiumCta />
      </div>
    </aside>
  );
}
