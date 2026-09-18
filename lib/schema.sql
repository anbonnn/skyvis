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
