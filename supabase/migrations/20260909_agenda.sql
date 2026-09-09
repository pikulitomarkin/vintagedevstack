-- Agenda de videochamadas — Vintage DevStack
-- Aplicar no SQL Editor do Supabase (ou via CLI: supabase db push)

create extension if not exists btree_gist;

-- Perfis (mínimo para admin; compatível com scaffold existente)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  phone text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  bio text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Cria profile ao cadastrar usuário no Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Regras de disponibilidade (ISO weekday: 1=seg … 7=dom)
create table if not exists public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 1 and 7),
  start_minute smallint not null default 1020, -- 17:00
  end_minute smallint not null default 1320,   -- 22:00
  slot_minutes smallint not null default 30,
  active boolean not null default true,
  unique (weekday)
);

alter table public.availability_rules enable row level security;

drop policy if exists "availability_rules_public_read" on public.availability_rules;
create policy "availability_rules_public_read" on public.availability_rules
  for select using (true);

drop policy if exists "availability_rules_admin_all" on public.availability_rules;
create policy "availability_rules_admin_all" on public.availability_rules
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

insert into public.availability_rules (weekday, start_minute, end_minute, slot_minutes, active)
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

-- Bloqueios pontuais
create table if not exists public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

alter table public.availability_blocks enable row level security;

drop policy if exists "availability_blocks_admin_all" on public.availability_blocks;
create policy "availability_blocks_admin_all" on public.availability_blocks
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- Bookings
do $$ begin
  create type public.booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
exception when duplicate_object then null;
end $$;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  client_name text not null,
  client_email text not null,
  client_whatsapp text not null,
  topic text,
  status public.booking_status not null default 'pending',
  meeting_url text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists bookings_starts_at_idx on public.bookings (starts_at);
create index if not exists bookings_status_idx on public.bookings (status);

-- Impede sobreposição de slots ativos
alter table public.bookings drop constraint if exists bookings_no_overlap;
alter table public.bookings
  add constraint bookings_no_overlap
  exclude using gist (
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status in ('pending', 'confirmed'));

alter table public.bookings enable row level security;

-- Admin vê/gerencia tudo
drop policy if exists "bookings_admin_all" on public.bookings;
create policy "bookings_admin_all" on public.bookings
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- Slots ocupados (sem PII) para montar a grade pública
create or replace function public.get_busy_slots(p_from timestamptz, p_to timestamptz)
returns table (starts_at timestamptz, ends_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select b.starts_at, b.ends_at
  from public.bookings b
  where b.status in ('pending', 'confirmed')
    and b.starts_at < p_to
    and b.ends_at > p_from
  union all
  select bl.starts_at, bl.ends_at
  from public.availability_blocks bl
  where bl.starts_at < p_to
    and bl.ends_at > p_from;
$$;

revoke all on function public.get_busy_slots(timestamptz, timestamptz) from public;
grant execute on function public.get_busy_slots(timestamptz, timestamptz) to anon, authenticated;

-- Criar booking com validações
create or replace function public.create_booking(
  p_starts_at timestamptz,
  p_client_name text,
  p_client_email text,
  p_client_whatsapp text,
  p_topic text default null
)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot_minutes int := 30;
  v_ends_at timestamptz;
  v_local timestamp;
  v_weekday int;
  v_minute int;
  v_rule public.availability_rules%rowtype;
  v_booking public.bookings;
  v_min_lead interval := interval '2 hours';
  v_horizon interval := interval '14 days';
begin
  if p_starts_at < now() + v_min_lead then
    raise exception 'ANTECEDENCIA: agende com pelo menos 2 horas de antecedência';
  end if;
  if p_starts_at > now() + v_horizon then
    raise exception 'HORIZONTE: agendamentos apenas nos próximos 14 dias';
  end if;
  if length(trim(p_client_name)) < 2 then
    raise exception 'NOME: informe seu nome';
  end if;
  if p_client_email !~* '^[^@]+@[^@]+\.[^@]+$' then
    raise exception 'EMAIL: informe um e-mail válido';
  end if;
  if length(regexp_replace(p_client_whatsapp, '\D', '', 'g')) < 10 then
    raise exception 'WHATSAPP: informe um número válido';
  end if;

  -- Converter para horário de São Paulo
  v_local := p_starts_at at time zone 'America/Sao_Paulo';
  v_weekday := extract(isodow from v_local)::int;
  v_minute := extract(hour from v_local)::int * 60 + extract(minute from v_local)::int;

  select * into v_rule
  from public.availability_rules
  where weekday = v_weekday and active = true;

  if not found then
    raise exception 'DIA: indisponível neste dia da semana';
  end if;

  v_slot_minutes := v_rule.slot_minutes;
  v_ends_at := p_starts_at + make_interval(mins => v_slot_minutes);

  if v_minute < v_rule.start_minute or (v_minute + v_slot_minutes) > v_rule.end_minute then
    raise exception 'HORARIO: fora da janela 17h–22h';
  end if;
  if mod(v_minute - v_rule.start_minute, v_slot_minutes) <> 0 then
    raise exception 'SLOT: horário inválido';
  end if;

  if exists (
    select 1 from public.bookings b
    where b.status in ('pending', 'confirmed')
      and b.client_email = lower(trim(p_client_email))
      and b.starts_at > now()
  ) then
    raise exception 'DUPLICADO: você já possui um agendamento ativo com este e-mail';
  end if;

  insert into public.bookings (
    starts_at, ends_at, client_name, client_email, client_whatsapp, topic, status
  ) values (
    p_starts_at,
    v_ends_at,
    trim(p_client_name),
    lower(trim(p_client_email)),
    trim(p_client_whatsapp),
    nullif(trim(coalesce(p_topic, '')), ''),
    'pending'
  )
  returning * into v_booking;

  return v_booking;
exception
  when exclusion_violation then
    raise exception 'OCUPADO: este horário acabou de ser reservado';
end;
$$;

revoke all on function public.create_booking(timestamptz, text, text, text, text) from public;
grant execute on function public.create_booking(timestamptz, text, text, text, text) to anon, authenticated;

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();
