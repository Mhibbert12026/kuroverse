-- KuroVerse anime favorites (per-user saved series)

create table if not exists public.anime_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  anime_id integer not null,
  anime_title text not null,
  anime_cover_url text,
  created_at timestamptz not null default now(),
  unique (user_id, anime_id)
);

create index if not exists anime_favorites_user_created_idx
  on public.anime_favorites (user_id, created_at desc);

alter table public.anime_favorites enable row level security;

create policy "Favorites are viewable by everyone"
  on public.anime_favorites for select
  using (true);

create policy "Users can insert their own favorites"
  on public.anime_favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.anime_favorites for delete
  using (auth.uid() = user_id);
