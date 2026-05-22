"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { ProtectedPageLoading } from "./ProtectedPageLoading";

type ProtectedRouteShellProps = {
  children: ReactNode;
};

export function ProtectedRouteShell({ children }: ProtectedRouteShellProps) {
  const { user, loading, configured } = useAuth();

  if (!configured) {
    return <>{children}</>;
  }

  if (loading || !user) {
    return <ProtectedPageLoading />;
  }

  return <>{children}</>;
}
