-- Stickers: placed overlays per route + uploaded image collection (server-only via service role).

create table public.sticker_placed (
  id uuid primary key,
  path_key text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sticker_placed_path_key_idx on public.sticker_placed (path_key);

create table public.sticker_collection_item (
  id uuid primary key,
  name text not null,
  data_url text not null,
  created_at_ms bigint not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create index sticker_collection_sort_idx on public.sticker_collection_item (sort_order);

alter table public.sticker_placed enable row level security;
alter table public.sticker_collection_item enable row level security;
