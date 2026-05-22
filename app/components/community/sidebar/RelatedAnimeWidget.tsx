import Link from "next/link";
import { AnimeImage } from "@/app/components/AnimeImage";
import type { SidebarRelatedAnime } from "@/lib/communities/sidebar.types";
import { accentBadge } from "../community-styles";
import { SidebarWidget } from "./SidebarWidget";

type RelatedAnimeWidgetProps = {
  anime: SidebarRelatedAnime;
};

export function RelatedAnimeWidget({ anime }: RelatedAnimeWidgetProps) {
  return (
    <SidebarWidget
      title="Related anime"
      subtitle="Series hub & watchlist"
      actionLabel="Open hub"
      actionHref={`/anime/${anime.anilistId}`}
      fullWidth
      icon={
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4V2m10 2V2M5 8h14M5 8v12a2 2 0 002 2h10a2 2 0 002-2V8" />
        </svg>
      }
    >
      <Link href={`/anime/${anime.anilistId}`} className="sidebar-related-anime">
        <div className="sidebar-related-anime__cover">
          <AnimeImage src={anime.coverUrl} alt={anime.title} fill className="object-cover" sizes="120px" />
          <span className={`sidebar-related-anime__badge ${accentBadge[anime.accent]}`}>
            Official hub
          </span>
        </div>
        <div className="sidebar-related-anime__meta">
          <p className="sidebar-related-anime__title">{anime.title}</p>
          {anime.genres ? <p className="sidebar-related-anime__genres">{anime.genres}</p> : null}
          <span className="sidebar-related-anime__cta">View anime page →</span>
        </div>
      </Link>
    </SidebarWidget>
  );
}
