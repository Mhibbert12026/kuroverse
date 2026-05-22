export const NOTIFICATION_TYPES = [
  "reply",
  "like",
  "follow",
  "community_post",
  "watchlist_update",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationActor = {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string;
  readAt: string | null;
  createdAt: string;
  metadata: Record<string, unknown>;
  actor: NotificationActor | null;
};

export type NotificationsPayload = {
  items: NotificationItem[];
  unreadCount: number;
};

export type NotificationActionResult =
  | { ok: true; unreadCount: number }
  | { ok: false; error: string };
