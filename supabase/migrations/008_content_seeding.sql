-- KuroVerse content seeding engine

alter table public.profiles
  add column if not exists is_moderator boolean not null default false;

-- Extend posts with seed metadata (still appear as normal community posts)
alter table public.community_posts
  add column if not exists source text not null default 'user'
    check (source in ('user', 'seed')),
  add column if not exists seed_kind text
    check (
      seed_kind is null
      or seed_kind in (
        'discussion_prompt',
        'episode_thread',
        'ai_summary',
        'hot_take',
        'trending_rec',
        'featured_drop'
      )
    ),
  add column if not exists anime_id integer,
  add column if not exists seed_batch_id uuid;

create index if not exists community_posts_seed_idx
  on public.community_posts (source, seed_kind, created_at desc)
  where source = 'seed';

-- Singleton platform config for the seeding engine
create table if not exists public.seed_config (
  id smallint primary key default 1 check (id = 1),
  enabled boolean not null default true,
  seed_user_id uuid references auth.users (id) on delete set null,
  posts_per_run integer not null default 6 check (posts_per_run between 1 and 24),
  episode_threads_per_run integer not null default 2 check (episode_threads_per_run between 0 and 8),
  hot_takes_per_run integer not null default 2 check (hot_takes_per_run between 0 and 8),
  summaries_per_run integer not null default 1 check (summaries_per_run between 0 and 4),
  trending_recs_per_run integer not null default 2 check (trending_recs_per_run between 0 and 8),
  use_ai_summaries boolean not null default false,
  schedule_hours integer not null default 6 check (schedule_hours between 1 and 168),
  last_run_at timestamptz,
  next_run_at timestamptz,
  updated_at timestamptz not null default now()
);

insert into public.seed_config (id)
values (1)
on conflict (id) do nothing;

alter table public.seed_config enable row level security;

create policy "Seed config readable by moderators"
  on public.seed_config for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_moderator = true
    )
  );

create policy "Seed config updatable by moderators"
  on public.seed_config for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_moderator = true
    )
  );

-- Batch run logs
create table if not exists public.seed_batches (
  id uuid primary key default gen_random_uuid(),
  triggered_by text not null check (triggered_by in ('cron', 'manual', 'admin')),
  actor_id uuid references auth.users (id) on delete set null,
  posts_created integer not null default 0,
  featured_anime_id integer,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.seed_batches enable row level security;

create policy "Seed batches readable by moderators"
  on public.seed_batches for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_moderator = true
    )
  );

-- Daily featured anime card for homepage + seed drops
create table if not exists public.daily_featured_anime (
  featured_date date primary key default (timezone('utc', now()))::date,
  anime_id integer not null,
  anime_title text not null,
  anime_cover_url text,
  community_slug text not null,
  tagline text not null,
  summary text not null,
  hot_take text,
  created_at timestamptz not null default now(),
  seed_batch_id uuid references public.seed_batches (id) on delete set null
);

alter table public.daily_featured_anime enable row level security;

create policy "Daily featured is public"
  on public.daily_featured_anime for select
  using (true);

create policy "Daily featured manageable by moderators"
  on public.daily_featured_anime for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_moderator = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_moderator = true
    )
  );

-- Security definer insert for automated seed posts
create or replace function public.insert_seed_community_post(
  p_user_id uuid,
  p_community_slug text,
  p_category text,
  p_title text,
  p_body text,
  p_seed_kind text,
  p_anime_id integer default null,
  p_episode_label text default null,
  p_has_spoilers boolean default false,
  p_spoiler_scope text default null,
  p_seed_batch_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if p_user_id is null then
    raise exception 'seed user id required';
  end if;

  insert into public.community_posts (
    user_id,
    community_slug,
    category,
    title,
    body,
    has_spoilers,
    spoiler_scope,
    episode_label,
    source,
    seed_kind,
    anime_id,
    seed_batch_id
  )
  values (
    p_user_id,
    p_community_slug,
    p_category,
    p_title,
    p_body,
    coalesce(p_has_spoilers, false),
    p_spoiler_scope,
    p_episode_label,
    'seed',
    p_seed_kind,
    p_anime_id,
    p_seed_batch_id
  )
  returning id into new_id;

  return new_id;
end;
$$;

grant execute on function public.insert_seed_community_post(
  uuid, text, text, text, text, text, integer, text, boolean, text, uuid
) to service_role;
