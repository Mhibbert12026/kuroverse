# KuroVerse watchlist (Supabase)

## Setup

Run `supabase/migrations/003_watchlist.sql` in the Supabase SQL Editor (after profiles migrations).

## Status sections

| Status | Label |
|--------|--------|
| `watching` | Watching |
| `completed` | Completed |
| `plan_to_watch` | Plan to Watch |
| `dropped` | Dropped |

Each user has at most one row per `anime_id`. Title and cover URL are stored for fast list rendering.

## App behavior

- **Add / remove / change status** via server actions (`lib/watchlist/actions.ts`)
- **Client cache** in `WatchlistProvider` for cards and detail pages
- **Legacy localStorage** lists migrate once on first signed-in load
- **Guests** tapping watchlist controls are prompted to sign in (modal)

## Routes

- `/watchlist` — protected page with all four sections
