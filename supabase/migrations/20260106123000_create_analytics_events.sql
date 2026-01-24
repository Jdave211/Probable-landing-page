-- Analytics event logging (client -> Supabase)
-- Stores page views + conversion events for the landing page.
--
-- NOTE: This table is written to by the client via Supabase anon key.
-- We enable RLS and allow INSERT only. No public select/update/delete.

create extension if not exists "pgcrypto";

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  session_id text not null,
  event_name text not null,
  pathname text,
  referrer text,
  user_agent text,

  utm jsonb,
  params jsonb
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_name_idx on public.analytics_events (event_name);
create index if not exists analytics_events_session_id_idx on public.analytics_events (session_id);

alter table public.analytics_events enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'analytics_events'
      and policyname = 'analytics_events_insert_public'
  ) then
    create policy analytics_events_insert_public
      on public.analytics_events
      for insert
      to anon, authenticated
      with check (true);
  end if;
end $$;







