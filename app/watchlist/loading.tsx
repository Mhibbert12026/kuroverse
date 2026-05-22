import { ProtectedPageLoading } from "@/app/components/auth/ProtectedPageLoading";

export default function WatchlistLoading() {
  return <ProtectedPageLoading label="Loading your watchlist…" />;
}
