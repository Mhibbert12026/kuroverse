# KuroVerse anime favorites

## Setup

Run `supabase/migrations/004_anime_favorites.sql` in the Supabase SQL Editor.

## Table: `anime_favorites`

| Column | Purpose |
|--------|---------|
| `user_id` | Owner |
| `anime_id` | AniList media ID |
| `anime_title` / `anime_cover_url` | Cached for profile grid |
| Unique `(user_id, anime_id)` | One favorite row per series |

Favorites are **publicly readable** (for profile pages). Only the owner can insert or delete.

## UX

- **Heart button** on anime cards, detail hero, and sidebar panel
- **Animated** pop + glow when favoriting (respects `prefers-reduced-motion`)
- **Profile** `/u/[username]` shows a responsive favorites grid (up to 24)
- Guests are prompted to sign in via the auth modal

## Limit

48 favorites per user (server-enforced).
