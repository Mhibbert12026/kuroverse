export default function DiscoverLoading() {
  return (
    <div className="discover-shell discover-shell--loading">
      <div className="discover-feed__loading discover-feed__loading--full">
        <span className="discover-feed__spinner" aria-hidden />
        <span>Loading discovery feed…</span>
      </div>
    </div>
  );
}
