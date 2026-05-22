# Homepage live social feed

## Migration

Run `supabase/migrations/007_home_social.sql`:

- `get_watching_now()` — public snapshot of users with `watching` watchlist status
- Adds `community_posts`, `community_post_comments`, `community_post_likes`, and `community_subscriptions` to the `supabase_realtime` publication

## APIs

| Route | Purpose |
|-------|---------|
| `GET /api/home/activity?page=` | Paginated live activity (posts, replies, likes) |
| `GET /api/home/live` | Pulse stats, watching now, recent joins, trending discussions |
| `GET /api/home/recommendations?page=` | Personalized anime when signed in; top picks otherwise |

## Realtime

The homepage subscribes to inserts on community posts, comments, likes, and subscriptions. New events debounce-refresh the activity head and live sidebar.

Without Supabase configured, mock activity data is used so the UI still demos the layout.
