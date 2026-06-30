create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy if not exists "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);
