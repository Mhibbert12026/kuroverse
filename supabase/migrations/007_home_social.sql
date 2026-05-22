-- Home social: public watching-now snapshot + realtime publication

create or replace function public.get_watching_now(p_limit int default 12)
returns table (
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  anime_id integer,
  anime_title text,
  anime_cover_url text,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.username,
    p.display_name,
    p.avatar_url,
    w.anime_id,
    w.anime_title,
    w.anime_cover_url,
    w.updated_at
  from public.watchlist_entries w
  inner join public.profiles p on p.id = w.user_id
  where w.status = 'watching'
    and p.onboarding_completed = true
    and p.username is not null
  order by w.updated_at desc
  limit greatest(1, least(p_limit, 24));
$$;

grant execute on function public.get_watching_now(int) to anon, authenticated;

-- Enable Supabase Realtime for live homepage
do $$
begin
  alter publication supabase_realtime add table public.community_posts;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.community_post_comments;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.community_post_likes;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.community_subscriptions;
exception
  when duplicate_object then null;
end $$;
