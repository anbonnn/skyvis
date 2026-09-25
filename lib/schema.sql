-- SKYVIS schema. Run once via POST /api/setup (see README).

create extension if not exists "pgcrypto";

create table if not exists companies (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  registration_number text,
  field               text,
  employee_count      text,
  years_operating     integer,
  created_at          timestamptz not null default now()
);

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid references companies(id) on delete cascade,
  email         text not null unique,
  password_hash text not null,
  name          text,
  job_role      text,
  department    text,
  role          text not null default 'member',   -- member | company_admin | staff
  created_at    timestamptz not null default now()
);

create table if not exists invitations (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references companies(id) on delete cascade,
  email       text not null,
  token       text not null unique,
  job_role    text,
  department  text,
  invited_by  uuid references users(id) on delete set null,
  accepted_at timestamptz,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

create table if not exists assessments (
  id                 uuid primary key default gen_random_uuid(),
  company_id         uuid not null references companies(id) on delete cascade,
  title              text not null,
  instrument_version text not null default '1.0',
  status             text not null default 'open',  -- open | closed
  created_by         uuid references users(id) on delete set null,
  created_at         timestamptz not null default now(),
  closed_at          timestamptz
);

create table if not exists responses (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  user_id       uuid not null references users(id) on delete cascade,
  answers       jsonb not null default '{}'::jsonb,
  scores        jsonb,
  submitted_at  timestamptz,
  updated_at    timestamptz not null default now(),
  unique (assessment_id, user_id)
);

create index if not exists idx_users_company on users(company_id);
create index if not exists idx_invitations_company on invitations(company_id);
create index if not exists idx_assessments_company on assessments(company_id);
create index if not exists idx_responses_assessment on responses(assessment_id);

-- ===== Business map =====

create table if not exists org_nodes (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references companies(id) on delete cascade,
  parent_id    uuid references org_nodes(id) on delete cascade,
  label        text not null,
  node_type    text not null,                 -- company | department | team | position
  headcount    integer,
  purpose      text,
  systems      text[],
  manual_level text,                          -- High | Medium | Low
  variance     text,
  declared     boolean not null default false,-- required by policy, not staffed
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists processes (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references companies(id) on delete cascade,
  name        text not null,
  short_name  text,
  trigger     text,
  ends_when   text,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists process_steps (
  id          uuid primary key default gen_random_uuid(),
  process_id  uuid not null references processes(id) on delete cascade,
  node_id     uuid references org_nodes(id) on delete set null,
  seq         integer not null default 0,
  action      text not null,                  -- what actually happens
  sys         text,                           -- the named tool
  kind        text not null default 'unknown',-- none | paper | shadow | system | unknown
  rule        text,                           -- timing or limit the policy states
  created_at  timestamptz not null default now()
);

create index if not exists idx_org_nodes_company on org_nodes(company_id);
create index if not exists idx_org_nodes_parent on org_nodes(parent_id);
create index if not exists idx_processes_company on processes(company_id);
create index if not exists idx_steps_process on process_steps(process_id);
