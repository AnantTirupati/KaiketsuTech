-- Alter project_requests to support additional MVP fields
alter table public.project_requests 
add column if not exists phone text,
add column if not exists project_title text,
add column if not exists business_goals text,
add column if not exists budget numeric,
add column if not exists priority text check (priority in ('low', 'medium', 'high', 'critical'));

-- Create intern_applications table
create table if not exists public.intern_applications (
    id uuid default gen_random_uuid() primary key,
    full_name text not null,
    email text not null,
    phone text,
    skills text,
    technologies text,
    experience text,
    portfolio_url text,
    github_url text,
    linkedin_url text,
    resume_url text,
    status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamptz default now()
);

-- Enable Row Level Security on intern_applications
alter table public.intern_applications enable row level security;

-- Policies for intern_applications
create policy "Allow public insert to intern_applications" on public.intern_applications
    for insert with check (true);

create policy "Allow admin full access to intern_applications" on public.intern_applications
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Create conversations table
create table if not exists public.conversations (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects(id) on delete cascade,
    created_at timestamptz default now()
);

-- Enable Row Level Security on conversations
alter table public.conversations enable row level security;

-- Policies for conversations
create policy "Allow authenticated select conversations" on public.conversations
    for select using (auth.role() = 'authenticated');

create policy "Allow authenticated insert conversations" on public.conversations
    for insert with check (auth.role() = 'authenticated');

create policy "Allow admin full access to conversations" on public.conversations
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Add conversation_id column to messages table
alter table public.messages 
add column if not exists conversation_id uuid references public.conversations(id) on delete cascade;

-- Register storage buckets in storage.buckets table
insert into storage.buckets (id, name, public) 
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('project-files', 'project-files', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('deliverables', 'deliverables', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('assets', 'assets', true)
on conflict (id) do nothing;

-- Storage policies for resumes (Public upload, Admin download)
create policy "Allow public upload to resumes" on storage.objects
    for insert with check (bucket_id = 'resumes');

create policy "Allow admin select to resumes" on storage.objects
    for select using (
        bucket_id = 'resumes' and
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Storage policies for project-files (Client & Admin read/write, Intern read)
create policy "Allow clients and admins to write project files" on storage.objects
    for insert with check (
        bucket_id = 'project-files' and (
            exists (
                select 1 from public.profiles
                where id = auth.uid() and role = 'admin'
            ) or
            exists (
                select 1 from public.profiles
                where id = auth.uid() and role = 'client'
            )
        )
    );

create policy "Allow clients, admins, and interns to read project files" on storage.objects
    for select using (
        bucket_id = 'project-files' and auth.role() = 'authenticated'
    );

create policy "Allow clients and admins to delete project files" on storage.objects
    for delete using (
        bucket_id = 'project-files' and (
            exists (
                select 1 from public.profiles
                where id = auth.uid() and role = 'admin'
            ) or
            exists (
                select 1 from public.profiles
                where id = auth.uid() and role = 'client'
            )
        )
    );

-- Storage policies for deliverables (Intern & Admin insert/read, Admin full)
create policy "Allow interns and admins to write deliverables" on storage.objects
    for insert with check (
        bucket_id = 'deliverables' and (
            exists (
                select 1 from public.profiles
                where id = auth.uid() and role in ('intern', 'admin')
            )
        )
    );

create policy "Allow authenticated users to read deliverables" on storage.objects
    for select using (
        bucket_id = 'deliverables' and auth.role() = 'authenticated'
    );

-- Storage policies for assets (Everyone read, Clients & Admin write)
create policy "Allow clients and admins to write assets" on storage.objects
    for insert with check (
        bucket_id = 'assets' and (
            exists (
                select 1 from public.profiles
                where id = auth.uid() and role in ('client', 'admin')
            )
        )
    );

create policy "Allow everyone to read assets" on storage.objects
    for select using (
        bucket_id = 'assets'
    );

-- Add rating column to profiles table
alter table public.profiles 
add column if not exists rating numeric default 5.0;
