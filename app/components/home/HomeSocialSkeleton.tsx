export function HomeSocialSkeleton() {
  return (
    <section className="home-social-hub home-social-hub--skeleton" aria-busy aria-label="Loading live feed">
      <div className="home-social-hub__layout">
        <div className="home-social-hub__main">
          <div className="home-skeleton-pulse" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="home-skeleton-activity" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
        <aside className="home-live-sidebar home-live-sidebar--skeleton">
          <div className="home-skeleton-sidebar-block" />
          <div className="home-skeleton-sidebar-block" />
          <div className="home-skeleton-sidebar-block" />
        </aside>
      </div>
    </section>
  );
}
