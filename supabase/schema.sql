-- Supabase schema for the portfolio content manager.
-- Run this in Supabase Dashboard -> SQL Editor -> New query.

create table if not exists public.site_content (
  key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "site content public read" on public.site_content;
create policy "site content public read"
  on public.site_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "site content authenticated write" on public.site_content;
create policy "site content authenticated write"
  on public.site_content
  for all
  to authenticated
  using (true)
  with check (true);

grant select on public.site_content to anon;
grant select, insert, update, delete on public.site_content to authenticated;

create or replace function public.touch_site_content()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at
  before update on public.site_content
  for each row
  execute function public.touch_site_content();
