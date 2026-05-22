import type { NotificationActor, NotificationItem, NotificationType } from "./types";
import { NOTIFICATION_TYPES } from "./types";

type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string;
  read_at: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
  actor: ProfileRow | ProfileRow[] | null;
};

function isNotificationType(value: string): value is NotificationType {
  return (NOTIFICATION_TYPES as readonly string[]).includes(value);
}

function actorFromRow(row: ProfileRow | null): NotificationActor | null {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
  };
}

export function notificationFromRow(row: NotificationRow): NotificationItem | null {
  if (!isNotificationType(row.type)) return null;

  const actorRaw = Array.isArray(row.actor) ? row.actor[0] ?? null : row.actor;

  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    href: row.href,
    readAt: row.read_at,
    createdAt: row.created_at,
    metadata: row.metadata ?? {},
    actor: actorFromRow(actorRaw),
  };
}
