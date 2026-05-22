-- KuroVerse watchlist (per-user anime lists with status sections)

create table if not exists public.watchlist_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  anime_id integer not null,
  anime_title text not null,
  anime_cover_url text,
  status text not null default 'plan_to_watch'
    check (status in ('watching', 'completed', 'plan_to_watch', 'dropped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, anime_id)
);

create index if not exists watchlist_entries_user_status_idx
  on public.watchlist_entries (user_id, status);

alter table public.watchlist_entries enable row level security;

create policy "Users can view their own watchlist"
  on public.watchlist_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own watchlist entries"
  on public.watchlist_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own watchlist entries"
  on public.watchlist_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own watchlist entries"
  on public.watchlist_entries for delete
  using (auth.uid() = user_id);

create or replace function public.set_watchlist_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists watchlist_entries_updated_at on public.watchlist_entries;
create trigger watchlist_entries_updated_at
  before update on public.watchlist_entries
  for each row execute function public.set_watchlist_updated_at();
