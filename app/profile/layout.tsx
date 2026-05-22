import type { ReactNode } from "react";
import { ProtectedRouteShell } from "@/app/components/auth/ProtectedRouteShell";
import { requireUser } from "@/lib/auth/require-user";

export default async function ProfileLayout({ children }: { children: ReactNode }) {
  await requireUser("/profile");

  return <ProtectedRouteShell>{children}</ProtectedRouteShell>;
}
