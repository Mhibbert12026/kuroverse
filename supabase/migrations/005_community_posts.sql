-- KuroVerse community posts, likes, comments, and images

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  community_slug text not null,
  category text not null check (category in ('discussion', 'episode', 'theory', 'manga', 'trending')),
  title text not null,
  body text not null,
  has_spoilers boolean not null default false,
  spoiler_scope text,
  episode_label text,
  image_url text,
  like_count integer not null default 0 check (like_count >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_posts_slug_created_idx
  on public.community_posts (community_slug, created_at desc);

create index if not exists community_posts_user_idx
  on public.community_posts (user_id);

alter table public.community_posts enable row level security;

create policy "Community posts are viewable by everyone"
  on public.community_posts for select
  using (true);

create policy "Users can create community posts"
  on public.community_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on public.community_posts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.community_posts for delete
  using (auth.uid() = user_id);

create table if not exists public.community_post_likes (
  user_id uuid not null references auth.users (id) on delete cascade,
  post_id uuid not null references public.community_posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create index if not exists community_post_likes_post_idx
  on public.community_post_likes (post_id);

alter table public.community_post_likes enable row level security;

create policy "Post likes are viewable by everyone"
  on public.community_post_likes for select
  using (true);

create policy "Users can like posts"
  on public.community_post_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their likes"
  on public.community_post_likes for delete
  using (auth.uid() = user_id);

create table if not exists public.community_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists community_post_comments_post_idx
  on public.community_post_comments (post_id, created_at asc);

alter table public.community_post_comments enable row level security;

create policy "Post comments are viewable by everyone"
  on public.community_post_comments for select
  using (true);

create policy "Users can add comments"
  on public.community_post_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.community_post_comments for delete
  using (auth.uid() = user_id);

-- Keep denormalized counts in sync
create or replace function public.community_post_like_count_delta()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts
    set like_count = like_count + 1
    where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.community_posts
    set like_count = greatest(like_count - 1, 0)
    where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists community_post_likes_count on public.community_post_likes;
create trigger community_post_likes_count
  after insert or delete on public.community_post_likes
  for each row execute function public.community_post_like_count_delta();

create or replace function public.community_post_comment_count_delta()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts
    set comment_count = comment_count + 1
    where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.community_posts
    set comment_count = greatest(comment_count - 1, 0)
    where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists community_post_comments_count on public.community_post_comments;
create trigger community_post_comments_count
  after insert or delete on public.community_post_comments
  for each row execute function public.community_post_comment_count_delta();

create or replace function public.set_community_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists community_posts_updated_at on public.community_posts;
create trigger community_posts_updated_at
  before update on public.community_posts
  for each row execute function public.set_community_posts_updated_at();

-- Post images (public bucket)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Post images are publicly accessible" on storage.objects;
create policy "Post images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "Users can upload post images" on storage.objects;
create policy "Users can upload post images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their post images" on storage.objects;
create policy "Users can update their post images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their post images" on storage.objects;
create policy "Users can delete their post images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
