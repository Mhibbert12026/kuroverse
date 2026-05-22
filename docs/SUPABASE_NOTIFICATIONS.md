# Notifications (Supabase)

KuroVerse stores in-app notifications in Supabase. They are created automatically via database triggers when social actions occur.

## Apply migration

Run `supabase/migrations/006_notifications.sql` in the Supabase SQL editor (or via CLI):

```bash
supabase db push
```

This creates:

- `notifications` — per-user inbox with read state
- `follows` — user follow graph
- `community_subscriptions` — alerts for new posts in a community

## Notification types

| Type | Trigger |
|------|---------|
| `reply` | Someone comments on your community post |
| `like` | Someone likes your community post |
| `follow` | Someone follows you |
| `community_post` | New post in a community you subscribe to |
| `watchlist_update` | Someone you follow adds or changes a watchlist entry |

## Subscriptions

Users are auto-subscribed to a community when they:

- Create a post
- Like a post
- Comment on a post

Only subscribers (excluding the author) receive `community_post` notifications.

## API

- `GET /api/notifications?limit=40` — list + unread count (auth required)
- `PATCH /api/notifications` — mark read (`{ ids: [...] }` or `{ all: true }`)

## UI

The bell icon in the top nav opens a responsive panel:

- **Mobile** — bottom sheet with backdrop
- **Desktop** — dropdown anchored to the bell

Unread items show an orange dot; **Mark all read** clears the badge.

## Follow button

Profiles include a **Follow** button for other members (`ProfileFollowButton`), which writes to `follows` and triggers follow notifications.

## RLS summary

- **notifications** — recipients can select and update (mark read) their rows; inserts via security-definer triggers only
- **follows** — world-readable; users manage their own follow rows
- **community_subscriptions** — users manage their own subscriptions
