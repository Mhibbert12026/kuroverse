import Link from "next/link";
import { AnimeImage } from "@/app/components/AnimeImage";
import type { SidebarAnimeRanking } from "@/lib/communities/sidebar.types";
import { SidebarWidget } from "./SidebarWidget";

type PopularAnimeRankingsWidgetProps = {
  rankings: SidebarAnimeRanking[];
};

function TrendIcon({ trend }: { trend: SidebarAnimeRanking["trend"] }) {
  if (trend === "up") {
    return (
      <svg className="sidebar-ranking__trend sidebar-ranking__trend--up h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
        <path d="M6 2L10 8H2L6 2Z" />
      </svg>
    );
  }
  if (trend === "down") {
    return (
      <svg className="sidebar-ranking__trend sidebar-ranking__trend--down h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
        <path d="M6 10L2 4H10L6 10Z" />
      </svg>
    );
  }
  return <span className="sidebar-ranking__trend sidebar-ranking__trend--same">—</span>;
}

export function PopularAnimeRankingsWidget({ rankings }: PopularAnimeRankingsWidgetProps) {
  return (
    <SidebarWidget
      title="Popular Anime"
      subtitle="Community rankings"
      fullWidth
      icon={
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      }
    >
      <ol className="sidebar-rankings">
        {rankings.map((item) => (
          <li key={item.slug}>
            <Link href={`/communities/${item.slug}`} className="sidebar-ranking">
              <span className="sidebar-ranking__position" data-rank={item.rank}>
                {item.rank}
              </span>
              <div className="sidebar-ranking__thumb">
                <AnimeImage src={item.coverUrl} alt={item.title} fill className="object-cover" sizes="40px" />
              </div>
              <div className="sidebar-ranking__meta min-w-0">
                <p className="sidebar-ranking__title">{item.title}</p>
                <p className="sidebar-ranking__score">
                  <span className="sidebar-ranking__score-value">{item.score}</span>
                  <span className="text-white/30">/10</span>
                </p>
              </div>
              <div className="sidebar-ranking__delta">
                <TrendIcon trend={item.trend} />
                <span className={`sidebar-ranking__delta-text sidebar-ranking__delta-text--${item.trend}`}>
                  {item.delta}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </SidebarWidget>
  );
}
