# KuroVerse Supabase Authentication

Email magic link only — no OAuth or password sign-in.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Copy **Project URL** and **anon public** key into `.env.local` (see `.env.local.example`).

```bash
cp .env.local.example .env.local
```

## 2. Run the profiles migration

In the Supabase **SQL Editor**, run:

`supabase/migrations/001_profiles.sql`

This creates `public.profiles`, RLS policies, and an `on_auth_user_created` trigger for automatic profile rows.

## 3. Enable email auth

**Authentication → Providers**

| Provider | Notes |
|----------|--------|
| **Email** | Enable Email provider. For local dev you can disable “Confirm email” so magic links sign users in immediately. |

Disable Google, Discord, and other OAuth providers if they are not needed.

## 4. Redirect URLs

**Authentication → URL Configuration**

Add:

- Site URL: `http://localhost:3000` (production: your domain)
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/confirm`
  - Production equivalents

Magic links from `signInWithOtp` redirect to `/auth/callback` for PKCE session exchange.

## 5. Start the app

```bash
npm run dev
```

Use **Log in** / **Join Free** in the nav to open the auth modal, enter your email, and open the link from your inbox.

## Architecture

| Path | Role |
|------|------|
| `middleware.ts` | Refreshes session cookies (persistent sessions) |
| `app/auth/callback/route.ts` | Magic link PKCE code exchange → redirect home |
| `app/auth/confirm/route.ts` | Legacy token_hash OTP verification (optional template) |
| `app/providers/AuthProvider.tsx` | Client session, modal state, post-sign-in redirect |
| `app/components/auth/AuthModal.tsx` | Email-only modal via `signInWithOtp` |
| `lib/auth/session.ts` | Server user/profile helpers |
| `supabase/migrations/001_profiles.sql` | Profile table + trigger |
