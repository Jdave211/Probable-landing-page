-- Create demo_requests table for "Schedule a Demo" submissions
-- Written to by the client via Supabase anon key, so we enable RLS
-- and allow INSERTs from public (anon/authenticated). Adjust policy as needed.

create extension if not exists "pgcrypto";

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  email text not null,
  company text,
  preferred_times text,
  message text,
  source text
);

create index if not exists demo_requests_created_at_idx on public.demo_requests (created_at desc);
create index if not exists demo_requests_email_idx on public.demo_requests (email);

alter table public.demo_requests enable row level security;

-- Allow anyone to insert (demo request is public). No select/update/delete from anon.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'demo_requests'
      and policyname = 'demo_requests_insert_public'
  ) then
    create policy demo_requests_insert_public
      on public.demo_requests
      for insert
      to anon, authenticated
      with check (true);
  end if;
end $$;








