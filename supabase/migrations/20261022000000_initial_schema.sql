create table public.institutions (
  id text primary key,
  name text not null,
  type text not null,
  state text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.complaints (
  id text primary key,
  institution_id text not null references public.institutions(id) on delete restrict,
  category text not null,
  bureau text not null,
  officer text not null,
  received date not null,
  expected date not null,
  status text not null check (status in ('Pending', 'Under Process', 'Disposed')),
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index complaints_institution_received_idx
  on public.complaints (institution_id, received desc);
create index complaints_status_expected_idx
  on public.complaints (status, expected);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger institutions_set_updated_at
  before update on public.institutions
  for each row execute function public.set_updated_at();

create trigger complaints_set_updated_at
  before update on public.complaints
  for each row execute function public.set_updated_at();

create table public.complaint_activity (
  id uuid primary key default gen_random_uuid(),
  complaint_id text not null references public.complaints(id) on delete cascade,
  event_type text not null,
  summary text not null,
  details jsonb not null default '{}'::jsonb,
  actor text,
  occurred_at timestamptz not null default now()
);

create index complaint_activity_timeline_idx
  on public.complaint_activity (complaint_id, occurred_at desc);

create table public.confirmed_complaint_relationships (
  id uuid primary key default gen_random_uuid(),
  complaint_a_id text not null references public.complaints(id) on delete restrict,
  complaint_b_id text not null references public.complaints(id) on delete restrict,
  relationship_type text not null default 'related',
  notes text not null default '',
  confirmed_by uuid references auth.users(id) on delete set null,
  confirmed_at timestamptz not null default now(),
  check (complaint_a_id < complaint_b_id),
  unique (complaint_a_id, complaint_b_id)
);

create view public.complaints_with_institution
with (security_invoker = true)
as
select
  complaint.id,
  complaint.institution_id as "institutionId",
  institution.name as institution,
  complaint.category,
  complaint.bureau,
  complaint.officer,
  complaint.received,
  complaint.expected,
  complaint.status,
  complaint.description,
  complaint.created_at,
  complaint.updated_at
from public.complaints as complaint
join public.institutions as institution on institution.id = complaint.institution_id;

create view public.institution_directory
with (security_invoker = true)
as
select
  institution.id,
  institution.name,
  institution.type,
  institution.state,
  count(complaint.id)::integer as complaints
from public.institutions as institution
left join public.complaints as complaint on complaint.institution_id = institution.id
group by institution.id, institution.name, institution.type, institution.state;

alter table public.institutions enable row level security;
alter table public.complaints enable row level security;
alter table public.complaint_activity enable row level security;
alter table public.confirmed_complaint_relationships enable row level security;

create policy "Authenticated users can read institutions"
  on public.institutions for select to authenticated using (true);
create policy "Authenticated users can read complaints"
  on public.complaints for select to authenticated using (true);
create policy "Authenticated users can read complaint activity"
  on public.complaint_activity for select to authenticated using (true);
create policy "Authenticated users can read confirmed relationships"
  on public.confirmed_complaint_relationships for select to authenticated using (true);

grant select on public.institutions to authenticated;
grant select on public.complaints to authenticated;
grant select on public.complaint_activity to authenticated;
grant select on public.confirmed_complaint_relationships to authenticated;
grant select on public.complaints_with_institution to authenticated;
grant select on public.institution_directory to authenticated;
