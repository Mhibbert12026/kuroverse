import type { User } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { authRequiredRedirect } from "./protected";

/** Server-only guard for protected layouts and pages. */
export async function requireUser(fallbackPath?: string): Promise<User> {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const user = await getUser();
  if (user) return user;

  const headerStore = await headers();
  const pathname =
    fallbackPath ?? headerStore.get("x-pathname") ?? headerStore.get("x-url") ?? "/watchlist";

  redirect(authRequiredRedirect(pathname));
}
