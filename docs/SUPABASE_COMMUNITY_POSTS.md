# Community posts (Supabase)

KuroVerse community feeds store user-created posts in Supabase. Demo threads from mocks still appear when no live posts exist; live posts are listed first.

## Apply migration

Run `supabase/migrations/005_community_posts.sql` in the Supabase SQL editor (or via CLI):

```bash
supabase db push
```

This creates:

- `community_posts` — discussion, episode reaction, and theory posts
- `community_post_likes` — one like per user per post (denormalized `like_count`)
- `community_post_comments` — threaded replies (denormalized `comment_count`)
- Storage bucket `post-images` (public, 5 MB, JPEG/PNG/WebP/GIF)

## Environment

Same as auth:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`next.config.ts` already allows the Supabase storage host for `next/image` when the URL is set.

## Post types

| Category     | Channel section        |
|-------------|-------------------------|
| `discussion`| Trending discussions    |
| `theory`    | Fan theories            |
| `episode`   | Episode reactions       |

## Features

- **Compose** — title, body, optional spoiler tag + scope, episode label, image upload
- **Likes** — toggled per signed-in user
- **Comments** — loaded when expanding a live post’s comment control

Guests are prompted to sign in via the auth modal.

## RLS summary

- Posts, likes, comments: world-readable; insert/update/delete own rows
- `post-images`: upload/update/delete only under `{user_id}/…` path prefix
