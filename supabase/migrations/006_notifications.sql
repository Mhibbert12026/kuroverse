-- KuroVerse notifications, follows, and community subscriptions

-- ─── Follows ───
create table if not exists public.follows (
  follower_id uuid not null references auth.users (id) on delete cascade,
  following_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create index if not exists follows_following_idx on public.follows (following_id);

alter table public.follows enable row level security;

create policy "Follows are viewable by everyone"
  on public.follows for select
  using (true);

create policy "Users can follow others"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.follows for delete
  using (auth.uid() = follower_id);

-- ─── Community subscriptions (new post alerts) ───
create table if not exists public.community_subscriptions (
  user_id uuid not null references auth.users (id) on delete cascade,
  community_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, community_slug)
);

create index if not exists community_subscriptions_slug_idx
  on public.community_subscriptions (community_slug);

alter table public.community_subscriptions enable row level security;

create policy "Users can view their subscriptions"
  on public.community_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can subscribe to communities"
  on public.community_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can unsubscribe"
  on public.community_subscriptions for delete
  using (auth.uid() = user_id);

-- ─── Notifications ───
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  type text not null check (
    type in ('reply', 'like', 'follow', 'community_post', 'watchlist_update')
  ),
  title text not null,
  body text not null default '',
  href text not null default '/',
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_recipient_created_idx
  on public.notifications (recipient_id, created_at desc);

create index if not exists notifications_recipient_unread_idx
  on public.notifications (recipient_id)
  where read_at is null;

alter table public.notifications enable row level security;

create policy "Users can view their notifications"
  on public.notifications for select
  using (auth.uid() = recipient_id);

create policy "Users can mark notifications read"
  on public.notifications for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

-- ─── Notification helpers (security definer) ───
create or replace function public.actor_display_name(p_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    nullif(trim(p.display_name), ''),
    nullif(trim(p.username), ''),
    'A fan'
  )
  from public.profiles p
  where p.id = p_user_id;
$$;

create or replace function public.enqueue_notification(
  p_recipient_id uuid,
  p_actor_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_href text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_recipient_id is null then
    return;
  end if;
  if p_actor_id is not null and p_recipient_id = p_actor_id then
    return;
  end if;

  insert into public.notifications (
    recipient_id,
    actor_id,
    type,
    title,
    body,
    href,
    metadata
  )
  values (
    p_recipient_id,
    p_actor_id,
    p_type,
    p_title,
    coalesce(p_body, ''),
    coalesce(nullif(p_href, ''), '/'),
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

create or replace function public.ensure_community_subscription(
  p_user_id uuid,
  p_community_slug text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id is null or p_community_slug is null or p_community_slug = '' then
    return;
  end if;

  insert into public.community_subscriptions (user_id, community_slug)
  values (p_user_id, p_community_slug)
  on conflict do nothing;
end;
$$;

-- Like → notify post author
create or replace function public.notify_post_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  post_author uuid;
  post_title text;
  post_slug text;
  actor_name text;
begin
  select cp.user_id, cp.title, cp.community_slug
  into post_author, post_title, post_slug
  from public.community_posts cp
  where cp.id = new.post_id;

  if post_author is null then
    return new;
  end if;

  actor_name := public.actor_display_name(new.user_id);

  perform public.enqueue_notification(
    post_author,
    new.user_id,
    'like',
    actor_name || ' liked your post',
    left(post_title, 120),
    '/communities/' || post_slug,
    jsonb_build_object('post_id', new.post_id, 'community_slug', post_slug)
  );

  perform public.ensure_community_subscription(new.user_id, post_slug);

  return new;
end;
$$;

drop trigger if exists community_post_likes_notify on public.community_post_likes;
create trigger community_post_likes_notify
  after insert on public.community_post_likes
  for each row execute function public.notify_post_like();

-- Comment → notify post author (reply)
create or replace function public.notify_post_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  post_author uuid;
  post_title text;
  post_slug text;
  actor_name text;
begin
  select cp.user_id, cp.title, cp.community_slug
  into post_author, post_title, post_slug
  from public.community_posts cp
  where cp.id = new.post_id;

  if post_author is null then
    return new;
  end if;

  actor_name := public.actor_display_name(new.user_id);

  perform public.enqueue_notification(
    post_author,
    new.user_id,
    'reply',
    actor_name || ' replied to your post',
    left(new.body, 160),
    '/communities/' || post_slug,
    jsonb_build_object('post_id', new.post_id, 'comment_id', new.id, 'community_slug', post_slug)
  );

  perform public.ensure_community_subscription(new.user_id, post_slug);

  return new;
end;
$$;

drop trigger if exists community_post_comments_notify on public.community_post_comments;
create trigger community_post_comments_notify
  after insert on public.community_post_comments
  for each row execute function public.notify_post_comment();

-- New post → notify community subscribers
create or replace function public.notify_new_community_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_name text;
  sub record;
begin
  perform public.ensure_community_subscription(new.user_id, new.community_slug);

  actor_name := public.actor_display_name(new.user_id);

  for sub in
    select cs.user_id
    from public.community_subscriptions cs
    where cs.community_slug = new.community_slug
      and cs.user_id <> new.user_id
  loop
    perform public.enqueue_notification(
      sub.user_id,
      new.user_id,
      'community_post',
      'New post in ' || initcap(replace(new.community_slug, '-', ' ')),
      left(new.title, 120),
      '/communities/' || new.community_slug,
      jsonb_build_object('post_id', new.id, 'community_slug', new.community_slug)
    );
  end loop;

  return new;
end;
$$;

drop trigger if exists community_posts_notify on public.community_posts;
create trigger community_posts_notify
  after insert on public.community_posts
  for each row execute function public.notify_new_community_post();

-- Follow → notify followed user
create or replace function public.notify_new_follow()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_name text;
  profile_href text;
  uname text;
begin
  actor_name := public.actor_display_name(new.follower_id);

  select p.username into uname from public.profiles p where p.id = new.follower_id;
  profile_href := coalesce('/u/' || uname, '/');

  perform public.enqueue_notification(
    new.following_id,
    new.follower_id,
    'follow',
    actor_name || ' started following you',
    'Check out their profile and watchlist.',
    profile_href,
    jsonb_build_object('follower_id', new.follower_id)
  );

  return new;
end;
$$;

drop trigger if exists follows_notify on public.follows;
create trigger follows_notify
  after insert on public.follows
  for each row execute function public.notify_new_follow();

-- Watchlist change → notify followers
create or replace function public.notify_watchlist_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_name text;
  status_label text;
  follower record;
  profile_href text;
  uname text;
  should_notify boolean := false;
begin
  if tg_op = 'INSERT' then
    should_notify := true;
  elsif tg_op = 'UPDATE' and old.status is distinct from new.status then
    should_notify := true;
  end if;

  if not should_notify then
    return coalesce(new, old);
  end if;

  actor_name := public.actor_display_name(new.user_id);

  status_label := case new.status
    when 'watching' then 'is watching'
    when 'completed' then 'completed'
    when 'plan_to_watch' then 'plans to watch'
    when 'dropped' then 'dropped'
    else 'updated'
  end;

  select p.username into uname from public.profiles p where p.id = new.user_id;
  profile_href := coalesce('/u/' || uname, '/watchlist');

  for follower in
    select f.follower_id as user_id
    from public.follows f
    where f.following_id = new.user_id
  loop
    perform public.enqueue_notification(
      follower.user_id,
      new.user_id,
      'watchlist_update',
      actor_name || ' ' || status_label || ' ' || new.anime_title,
      'See what they are into on KuroVerse.',
      profile_href,
      jsonb_build_object(
        'anime_id', new.anime_id,
        'anime_title', new.anime_title,
        'status', new.status
      )
    );
  end loop;

  return coalesce(new, old);
end;
$$;

drop trigger if exists watchlist_entries_notify on public.watchlist_entries;
create trigger watchlist_entries_notify
  after insert or update on public.watchlist_entries
  for each row execute function public.notify_watchlist_change();
