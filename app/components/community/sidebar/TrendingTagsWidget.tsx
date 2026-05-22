import type { SidebarTrendingTag } from "@/lib/communities/sidebar.types";
import { SidebarWidget } from "./SidebarWidget";

type TrendingTagsWidgetProps = {
  tags: SidebarTrendingTag[];
};

export function TrendingTagsWidget({ tags }: TrendingTagsWidgetProps) {
  return (
    <SidebarWidget
      title="Trending Tags"
      subtitle="Hot topics this week"
      icon={
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
          />
        </svg>
      }
    >
      <div className="sidebar-tags">
        {tags.map((tag) => (
          <button key={tag.label} type="button" className={`sidebar-tag ${tag.hot ? "sidebar-tag--hot" : ""}`}>
            {tag.hot ? <span className="sidebar-tag__flame" aria-hidden>🔥</span> : null}
            <span className="sidebar-tag__label">{tag.label}</span>
            <span className="sidebar-tag__count">{tag.posts}</span>
          </button>
        ))}
      </div>
    </SidebarWidget>
  );
}
