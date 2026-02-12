-- Create waitlist_users table for landing page waitlist signups
-- This table is written to by the client via Supabase anon key, so we enable RLS
-- and allow INSERTs from public (anon/authenticated). Adjust policy as needed.

-- Ensure uuid generator is available
create extension if not exists "pgcrypto";

create table if not exists public.waitlist_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  email text not null,
  profession text,
  audience text,
  use_cases text[] not null default '{}',
  source text
);

-- Dedupe by email (required for upsert onConflict: 'email')
create unique index if not exists waitlist_users_email_key on public.waitlist_users (email);

alter table public.waitlist_users enable row level security;

-- Allow anyone to insert (waitlist is public). No select/update/delete from anon.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'waitlist_users'
      and policyname = 'waitlist_users_insert_public'
  ) then
    create policy waitlist_users_insert_public
      on public.waitlist_users
      for insert
      to anon, authenticated
      with check (true);
  end if;
end $$;












