-- Agenda VPS — Vintage DevStack (sem dependência do auth.users do Supabase)
create extension if not exists "pgcrypto";
create extension if not exists btree_gist;

do $$ begin
  create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
exception when duplicate_object then null;
end $$;

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists availability_rules (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 1 and 7),
  start_minute smallint not null default 1020,
  end_minute smallint not null default 1320,
  slot_minutes smallint not null default 30,
  active boolean not null default true,
  unique (weekday)
);

insert into availability_rules (weekday, start_minute, end_minute, slot_minutes, active)
values
  (1, 1020, 1320, 30, true),
  (2, 1020, 1320, 30, true),
  (3, 1020, 1320, 30, true),
  (4, 1020, 1320, 30, true)
on conflict (weekday) do update set
  start_minute = excluded.start_minute,
  end_minute = excluded.end_minute,
  slot_minutes = excluded.slot_minutes,
  active = excluded.active;

create table if not exists availability_blocks (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  client_name text not null,
  client_email text not null,
  client_whatsapp text not null,
  topic text,
  status booking_status not null default 'pending',
  meeting_url text,
  meeting_room text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists bookings_starts_at_idx on bookings (starts_at);
create index if not exists bookings_status_idx on bookings (status);

alter table bookings drop constraint if exists bookings_no_overlap;
alter table bookings
  add constraint bookings_no_overlap
  exclude using gist (
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status in ('pending', 'confirmed'));

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on bookings;
create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();
