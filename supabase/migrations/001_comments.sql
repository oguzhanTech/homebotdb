-- HomeBotRadar: comments (run in Supabase SQL Editor when connecting the comment API)
-- https://supabase.com/dashboard/project/_/sql

create table if not exists public.comments (
  id text primary key,
  target_type text not null check (target_type in ('robot', 'news')),
  target_slug text not null,
  parent_id text references public.comments (id) on delete cascade,
  author_username text not null,
  author_name text not null,
  is_admin boolean not null default false,
  admin_id text,
  body text not null check (char_length(body) between 3 and 500),
  created_at timestamptz not null default now()
);

create index if not exists comments_target_idx
  on public.comments (target_type, target_slug, created_at);

create index if not exists comments_parent_idx
  on public.comments (parent_id);

alter table public.comments enable row level security;

-- Public read
create policy "comments_select_public"
  on public.comments for select
  to anon, authenticated
  using (true);

-- Public insert (top-level or one-level reply enforced in app)
create policy "comments_insert_public"
  on public.comments for insert
  to anon, authenticated
  with check (
    parent_id is null
    or exists (
      select 1 from public.comments p
      where p.id = parent_id and p.parent_id is null
    )
  );

-- No public update/delete; use service role in admin moderation later
