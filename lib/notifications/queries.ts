import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { notificationFromRow } from "./row";
import type { NotificationsPayload } from "./types";

const NOTIFICATION_SELECT = `
  id,
  type,
  title,
  body,
  href,
  read_at,
  created_at,
  metadata,
  actor:profiles!notifications_actor_id_fkey (
    id,
    username,
    display_name,
    avatar_url
  )
`;

export async function getNotificationsForUser(
  userId: string,
  limit = 40,
): Promise<NotificationsPayload> {
  if (!isSupabaseConfigured()) {
    return { items: [], unreadCount: 0 };
  }

  const supabase = await createClient();

  const [{ data: rows, error }, { count, error: countError }] = await Promise.all([
    supabase
      .from("notifications")
      .select(NOTIFICATION_SELECT)
      .eq("recipient_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("recipient_id", userId)
      .is("read_at", null),
  ]);

  if (error || countError) {
    return { items: [], unreadCount: 0 };
  }

  const items = (rows ?? [])
    .map((row) => notificationFromRow(row))
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return {
    items,
    unreadCount: count ?? 0,
  };
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .is("read_at", null);

  if (error) return 0;
  return count ?? 0;
}
