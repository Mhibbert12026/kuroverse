import type { ReactNode } from "react";
import { ProtectedRouteShell } from "@/app/components/auth/ProtectedRouteShell";
import { requireUser } from "@/lib/auth/require-user";

export default async function WatchlistLayout({ children }: { children: ReactNode }) {
  await requireUser("/watchlist");

  return <ProtectedRouteShell>{children}</ProtectedRouteShell>;
}
