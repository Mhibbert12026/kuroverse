# Content seeding engine

Automated, fandom-native community content for KuroVerse hubs.

## Migration

Run `supabase/migrations/008_content_seeding.sql`:

- `profiles.is_moderator`
- `community_posts` seed columns (`source`, `seed_kind`, `anime_id`, `seed_batch_id`)
- `seed_config`, `seed_batches`, `daily_featured_anime`
- `insert_seed_community_post()` RPC (service role)

## Environment

| Variable | Purpose |
|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Insert seed posts & featured rows |
| `KUROVERSE_SEED_USER_ID` | Auth user UUID that owns seeded posts (bot/staff account) |
| `KUROVERSE_ADMIN_EMAILS` | Comma-separated emails with moderator access |
| `CRON_SECRET` | Bearer token for `/api/cron/seed` |
| `OPENAI_API_KEY` | Optional; enables AI summary flag in admin |

Grant moderator in SQL:

```sql
update public.profiles set is_moderator = true where username = 'your_handle';
```

## Content types

| `seed_kind` | Description |
|-------------|-------------|
| `discussion_prompt` | Starter threads, rewatch clubs, soundtrack posts |
| `episode_thread` | Weekly episode reaction threads |
| `ai_summary` | Fandom briefing / pulse summaries |
| `hot_take` | Spicy theory-style prompts |
| `trending_rec` | Recommendation & chart-climb posts |
| `featured_drop` | Spotlight post tied to daily featured anime |

## Scheduling

- **Vercel cron**: `vercel.json` hits `/api/cron/seed` every 6 hours (align with `schedule_hours` in admin).
- **Manual**: `/admin/seed` → **Run seed drop now**
- Respects `next_run_at` unless forced

## Admin UI

`/admin/seed` — moderators can enable/disable seeding, tune quotas, set bot user ID, and view batch history.

Seeded posts appear as normal hub threads (with `source = 'seed'` in the database for filtering).
