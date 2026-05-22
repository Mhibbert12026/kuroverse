# KuroVerse user profiles

## Database setup

Run migrations in order in the Supabase SQL Editor:

1. `supabase/migrations/001_profiles.sql`
2. `supabase/migrations/002_profile_fields_and_avatars.sql`
3. `supabase/migrations/004_anime_favorites.sql` — hearted anime grid
4. `supabase/migrations/003_watchlist.sql` — watchlist preview
5. `supabase/migrations/006_notifications.sql` — includes `follows` + `community_subscriptions` (joined fandoms)

Migration 002 adds:

- `favorite_anime` — signature series (text)
- `onboarding_completed` — gates first-login username setup
- `avatars` storage bucket with RLS (5 MB, images only)

## First login (onboarding)

After magic-link sign-in, users without a confirmed username see **Claim your profile**:

- **Required:** username (`@handle`, unique, 3–24 chars)
- **Optional:** display name, avatar upload, favorite anime, bio

Avatars upload to `avatars/{user_id}/avatar.{ext}` and the public URL is saved on `profiles.avatar_url`.

## Public profile URL

`/u/[username]` — e.g. `/u/shadow_monarch`

Only profiles with `onboarding_completed = true` and a username are visible.

## Profile sections

| Section | Source |
|--------|--------|
| Hero + stats | `profiles`, `anime_favorites`, `watchlist_entries`, `community_subscriptions`, `follows` |
| Favorite anime | `anime_favorites` (hearts on anime cards) + legacy `favorite_anime` text |
| Watchlist preview | `watchlist_entries` (latest 6) |
| Joined fandoms | `community_subscriptions` (auto-joined when posting/liking/commenting) |
| Edit profile | Owner-only collapsible form |

## Editing

Owners use **Edit profile** on `/u/[username]` to update avatar, display name, bio, and signature series.

## Profile hover cards

Hover (or tap on mobile) avatars on:

- Community discussion threads (live posts)
- Post comments
- Notification actors

Data loads from `GET /api/profile/card?username=` or `?id=`.

## Navbar

Signed-in users see their avatar with a neon ring in the top nav; the menu links to `/u/[username]`.

## Supabase checklist

- Run migrations through `006_notifications.sql`
- Confirm **Storage → avatars** bucket exists and is public
- Redirect URLs unchanged from auth setup (`docs/SUPABASE_AUTH.md`)
