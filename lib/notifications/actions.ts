"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getUnreadNotificationCount } from "./queries";
import type { NotificationActionResult } from "./types";

async function unreadForCurrentUser(): Promise<number> {
  const user = await getUser();
  if (!user) return 0;
  return getUnreadNotificationCount(user.id);
}

export async function markNotificationsReadAction(
  ids?: string[],
): Promise<NotificationActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const user = await getUser();
  if (!user) return { ok: false, error: "Sign in to manage notifications." };

  const supabase = await createClient();
  const now = new Date().toISOString();

  let query = supabase
    .from("notifications")
    .update({ read_at: now })
    .eq("recipient_id", user.id)
    .is("read_at", null);

  if (ids?.length) {
    query = query.in("id", ids);
  }

  const { error } = await query;
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true, unreadCount: await unreadForCurrentUser() };
}

export async function markAllNotificationsReadAction(): Promise<NotificationActionResult> {
  return markNotificationsReadAction();
}
