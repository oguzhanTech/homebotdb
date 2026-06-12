-- Optional: relax insert RLS if you write comments with the anon key only.
-- HomeBotRadar API uses SUPABASE_SERVICE_ROLE_KEY for inserts instead.
-- Run this only if you are not using the service role on the server.

drop policy if exists "comments_insert_public" on public.comments;

create policy "comments_insert_public"
  on public.comments for insert
  to anon, authenticated
  with check (char_length(body) between 3 and 500);
