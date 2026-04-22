-- Ragdoll diary: core tables (access via service role from Next.js server only).
-- RLS enabled with no policies denies anon/authenticated PostgREST access.

create table public.diary_day (
  diary_date date primary key,
  memory_text text not null default '',
  updated_at timestamptz not null default now()
);

create table public.diary_photo (
  id uuid primary key default gen_random_uuid(),
  diary_date date not null references public.diary_day (diary_date) on delete cascade,
  storage_path text not null unique,
  caption text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index diary_photo_diary_date_idx on public.diary_photo (diary_date);

create table public.symptom_entry (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null,
  severity int not null check (severity >= 1 and severity <= 5),
  tags text[] not null default '{}',
  meds text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index symptom_entry_occurred_at_idx on public.symptom_entry (occurred_at desc);

alter table public.diary_day enable row level security;
alter table public.diary_photo enable row level security;
alter table public.symptom_entry enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'diary-photos',
  'diary-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
