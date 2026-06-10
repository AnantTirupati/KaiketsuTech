-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text not null,
    full_name text,
    role text default 'client' check (role in ('admin', 'client', 'intern')),
    avatar_url text,
    updated_at timestamptz default now(),
    created_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create project_requests table
create table public.project_requests (
    id uuid default gen_random_uuid() primary key,
    client_id uuid references public.profiles(id) on delete set null,
    first_name text,
    last_name text,
    work_email text,
    job_title text,
    company_name text,
    project_scope text,
    project_description text,
    timeline_weeks integer,
    status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamptz default now()
);

-- Enable RLS on project_requests
alter table public.project_requests enable row level security;

-- Create projects table
create table public.projects (
    id uuid default gen_random_uuid() primary key,
    client_id uuid references public.profiles(id) on delete set null,
    title text not null,
    description text,
    status text default 'planning' check (status in ('planning', 'in_progress', 'review', 'completed')),
    velocity integer default 0,
    capacity_utilization integer default 0,
    estimated_budget numeric,
    timeline_start date,
    timeline_end date,
    created_at timestamptz default now()
);

-- Enable RLS on projects
alter table public.projects enable row level security;

-- Create tasks table
create table public.tasks (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects(id) on delete cascade,
    assigned_to uuid references public.profiles(id) on delete set null,
    title text not null,
    description text,
    status text default 'todo' check (status in ('todo', 'in_progress', 'done')),
    category text default 'Frontend' check (category in ('Frontend', 'Backend', 'Design Sys', 'Other')),
    due_date timestamptz,
    created_at timestamptz default now()
);

-- Enable RLS on tasks
alter table public.tasks enable row level security;

-- Create milestones table
create table public.milestones (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects(id) on delete cascade,
    title text not null,
    description text,
    due_date date,
    status text default 'pending' check (status in ('pending', 'completed')),
    created_at timestamptz default now()
);

-- Enable RLS on milestones
alter table public.milestones enable row level security;

-- Create messages table
create table public.messages (
    id uuid default gen_random_uuid() primary key,
    sender_id uuid references public.profiles(id) on delete cascade,
    project_id uuid references public.projects(id) on delete cascade,
    content text not null,
    file_url text,
    file_name text,
    created_at timestamptz default now()
);

-- Enable RLS on messages
alter table public.messages enable row level security;

-- Create payments table
create table public.payments (
    id uuid default gen_random_uuid() primary key,
    client_id uuid references public.profiles(id) on delete set null,
    amount numeric not null,
    currency text default 'USD',
    status text default 'pending' check (status in ('pending', 'completed', 'failed')),
    razorpay_order_id text unique,
    razorpay_payment_id text,
    package_type text check (package_type in ('starter', 'business', 'enterprise')),
    created_at timestamptz default now()
);

-- Enable RLS on payments
alter table public.payments enable row level security;

-- Create contact_inquiries table
create table public.contact_inquiries (
    id uuid default gen_random_uuid() primary key,
    full_name text not null,
    organization text,
    email text not null,
    subject text,
    message text not null,
    created_at timestamptz default now()
);

-- Enable RLS on contact_inquiries
alter table public.contact_inquiries enable row level security;


-- ==========================================
-- TRIGGERS FOR PROFILE CREATION ON SIGNUP
-- ==========================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- ROW LEVEL SECURITY POLICIES
-- ==========================================

-- Profiles Policies
create policy "Allow public read access to profiles" on public.profiles
    for select using (true);

create policy "Allow users to update their own profile" on public.profiles
    for update using (auth.uid() = id);

create policy "Allow admin full access to profiles" on public.profiles
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Project Requests Policies
create policy "Allow authenticated users to create project requests" on public.project_requests
    for insert with check (auth.role() = 'authenticated');

create policy "Allow clients to view their own project requests" on public.project_requests
    for select using (client_id = auth.uid());

create policy "Allow admin full access to project requests" on public.project_requests
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Projects Policies
create policy "Allow clients to view their own projects" on public.projects
    for select using (client_id = auth.uid());

create policy "Allow interns to view projects" on public.projects
    for select using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'intern'
        )
    );

create policy "Allow admin full access to projects" on public.projects
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Tasks Policies
create policy "Allow clients to select tasks for their projects" on public.tasks
    for select using (
        exists (
            select 1 from public.projects
            where projects.id = tasks.project_id and projects.client_id = auth.uid()
        )
    );

create policy "Allow interns to select and update tasks" on public.tasks
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'intern'
        )
    );

create policy "Allow admin full access to tasks" on public.tasks
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Milestones Policies
create policy "Allow clients to select milestones for their projects" on public.milestones
    for select using (
        exists (
            select 1 from public.projects
            where projects.id = milestones.project_id and projects.client_id = auth.uid()
        )
    );

create policy "Allow interns to select milestones" on public.milestones
    for select using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'intern'
        )
    );

create policy "Allow admin full access to milestones" on public.milestones
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Messages Policies
create policy "Allow authenticated users to read project messages" on public.messages
    for select using (auth.role() = 'authenticated');

create policy "Allow authenticated users to post messages" on public.messages
    for insert with check (auth.uid() = sender_id);

create policy "Allow admin full access to messages" on public.messages
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Payments Policies
create policy "Allow clients to view their own payments" on public.payments
    for select using (client_id = auth.uid());

create policy "Allow clients to insert payments" on public.payments
    for insert with check (client_id = auth.uid());

create policy "Allow admin full access to payments" on public.payments
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );

-- Contact Inquiries Policies
create policy "Allow public insert to contact inquiries" on public.contact_inquiries
    for insert with check (true);

create policy "Allow admin full access to contact inquiries" on public.contact_inquiries
    for all using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'admin'
        )
    );
