-- ============================================================
-- INTERN VERIFICATION & PORTFOLIO SYSTEM
-- Migration: 20260625000000
-- ============================================================

-- ==========================================
-- 1. INTERNS TABLE (extended intern metadata)
-- ==========================================
create table if not exists public.interns (
    id uuid default gen_random_uuid() primary key,
    profile_id uuid references public.profiles(id) on delete set null,
    intern_id text not null unique,              -- e.g. KT-INT-0001
    department text not null default 'engineering'
        check (department in ('engineering', 'design', 'marketing', 'operations')),
    start_date date not null default current_date,
    end_date date,
    status text not null default 'active'
        check (status in ('active', 'completed', 'revoked', 'archived')),
    bio text,
    skills text[] default '{}',
    github_url text,
    linkedin_url text,
    portfolio_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz                        -- soft delete
);

alter table public.interns enable row level security;

-- Indexes
create index if not exists idx_interns_profile_id on public.interns(profile_id);
create index if not exists idx_interns_intern_id on public.interns(intern_id);
create index if not exists idx_interns_status on public.interns(status);


-- ==========================================
-- 2. CERTIFICATES TABLE
-- ==========================================
create table if not exists public.certificates (
    id uuid default gen_random_uuid() primary key,
    intern_id uuid references public.interns(id) on delete cascade not null,
    certificate_id text not null unique,          -- e.g. KT-A7F2-2606
    title text not null,
    description text,
    issued_at timestamptz default now(),
    valid_until timestamptz,                      -- null = no expiry
    qr_code_url text,                             -- base64 data URI or storage URL
    certificate_url text,                         -- storage path for certificate file
    status text not null default 'active'
        check (status in ('active', 'revoked')),
    revoked_at timestamptz,
    revoked_reason text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.certificates enable row level security;

-- Indexes
create unique index if not exists idx_certificates_certificate_id on public.certificates(certificate_id);
create index if not exists idx_certificates_intern_id on public.certificates(intern_id);
create index if not exists idx_certificates_status on public.certificates(status);


-- ==========================================
-- 3. PROJECT CONTRIBUTORS TABLE
-- ==========================================
create table if not exists public.project_contributors (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects(id) on delete cascade not null,
    intern_id uuid references public.interns(id) on delete cascade not null,
    role text not null default 'developer'
        check (role in ('developer', 'designer', 'lead', 'reviewer')),
    contribution_summary text,
    start_date date,
    end_date date,
    created_at timestamptz default now(),
    unique(project_id, intern_id)                 -- prevent duplicate assignments
);

alter table public.project_contributors enable row level security;

-- Indexes
create index if not exists idx_project_contributors_project on public.project_contributors(project_id);
create index if not exists idx_project_contributors_intern on public.project_contributors(intern_id);


-- ==========================================
-- 4. VERIFICATION LOGS TABLE
-- ==========================================
create table if not exists public.verification_logs (
    id uuid default gen_random_uuid() primary key,
    certificate_id uuid references public.certificates(id) on delete cascade not null,
    verified_at timestamptz default now(),
    ip_address text,
    user_agent text
);

alter table public.verification_logs enable row level security;

-- Index for analytics
create index if not exists idx_verification_logs_cert on public.verification_logs(certificate_id);
create index if not exists idx_verification_logs_date on public.verification_logs(verified_at);


-- ==========================================
-- 5. AUDIT LOGS TABLE
-- ==========================================
create table if not exists public.audit_logs (
    id uuid default gen_random_uuid() primary key,
    actor_id uuid references public.profiles(id) on delete set null,
    action text not null,                          -- e.g. 'intern.create', 'certificate.revoke'
    target_type text not null,                     -- e.g. 'intern', 'certificate', 'project'
    target_id uuid,
    details jsonb default '{}',
    created_at timestamptz default now()
);

alter table public.audit_logs enable row level security;

-- Indexes
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id);
create index if not exists idx_audit_logs_target on public.audit_logs(target_type, target_id);
create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);


-- ==========================================
-- 6. MODIFY PROJECTS TABLE (showcase columns)
-- ==========================================
alter table public.projects
    add column if not exists is_showcase boolean default false,
    add column if not exists showcase_image_url text,
    add column if not exists showcase_tags text[] default '{}';


-- ==========================================
-- 7. STORAGE BUCKET FOR CERTIFICATES
-- ==========================================
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', true)
on conflict (id) do nothing;

-- Public read for certificate files
create policy "Allow public read certificate files" on storage.objects
    for select using (bucket_id = 'certificates');

-- Admin-only write for certificate files
create policy "Allow admin write certificate files" on storage.objects
    for insert with check (
        bucket_id = 'certificates' and exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

create policy "Allow admin delete certificate files" on storage.objects
    for delete using (
        bucket_id = 'certificates' and exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );


-- ==========================================
-- 8. ROW LEVEL SECURITY POLICIES
-- ==========================================

-- INTERNS: Public read for non-deleted, admin full access
create policy "Allow public read active interns" on public.interns
    for select using (deleted_at is null and status != 'archived');

create policy "Allow admin full access to interns" on public.interns
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- CERTIFICATES: Public read for active, admin full access
create policy "Allow public read active certificates" on public.certificates
    for select using (status = 'active');

create policy "Allow admin full access to certificates" on public.certificates
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- PROJECT CONTRIBUTORS: Public read, admin full access
create policy "Allow public read project contributors" on public.project_contributors
    for select using (true);

create policy "Allow admin full access to project contributors" on public.project_contributors
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- VERIFICATION LOGS: Public insert (no auth), admin read
create policy "Allow public insert verification logs" on public.verification_logs
    for insert with check (true);

create policy "Allow admin read verification logs" on public.verification_logs
    for select using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- AUDIT LOGS: Admin-only full access
create policy "Allow admin full access to audit logs" on public.audit_logs
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- PROJECTS: Add public read for showcase projects
create policy "Allow public read showcase projects" on public.projects
    for select using (is_showcase = true);

-- PROFILES: Allow public read for intern profiles (needed for public intern pages)
-- We need to allow unauthenticated reads specifically for profiles linked to interns
create policy "Allow public read intern profiles" on public.profiles
    for select using (
        exists (
            select 1 from public.interns
            where interns.profile_id = profiles.id
            and interns.deleted_at is null
            and interns.status != 'archived'
        )
    );


-- ==========================================
-- 9. UPDATED_AT TRIGGER FUNCTION
-- ==========================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_interns_updated_at
    before update on public.interns
    for each row execute function public.update_updated_at_column();

create trigger set_certificates_updated_at
    before update on public.certificates
    for each row execute function public.update_updated_at_column();
