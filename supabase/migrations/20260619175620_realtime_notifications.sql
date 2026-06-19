-- Create notifications table
create table public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    description text not null,
    type text default 'info' check (type in ('success', 'info', 'warning')),
    read boolean default false,
    created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) on notifications
alter table public.notifications enable row level security;

-- Policies for notifications
create policy "Allow users to select their own notifications" on public.notifications
    for select to authenticated
    using (auth.uid() = user_id);

create policy "Allow users to update their own notifications" on public.notifications
    for update to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Allow users to delete their own notifications" on public.notifications
    for delete to authenticated
    using (auth.uid() = user_id);

-- System-wide notification triggers

-- 1. Trigger for new project request (notify admins)
create or replace function public.notify_new_project_request()
returns trigger as $$
declare
  admin_record record;
begin
  for admin_record in select id from public.profiles where role = 'admin' loop
    insert into public.notifications (user_id, title, description, type)
    values (
      admin_record.id,
      'New Project Request',
      coalesce(new.company_name, 'A client') || ' requested a proposal for "' || coalesce(new.project_title, 'Untitled Project') || '".',
      'success'
    );
  end loop;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_project_request_created
  after insert on public.project_requests
  for each row execute procedure public.notify_new_project_request();

-- 2. Trigger for project approved/created (notify client)
create or replace function public.notify_project_approved()
returns trigger as $$
begin
  if new.client_id is not null then
    insert into public.notifications (user_id, title, description, type)
    values (
      new.client_id,
      'Project Provisioned',
      'Your project "' || new.title || '" has been successfully provisioned.',
      'success'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_project_created
  after insert on public.projects
  for each row execute procedure public.notify_project_approved();

-- 3. Trigger for project status update (notify client)
create or replace function public.notify_project_status_update()
returns trigger as $$
begin
  if old.status is distinct from new.status and new.client_id is not null then
    insert into public.notifications (user_id, title, description, type)
    values (
      new.client_id,
      'Project Status Updated',
      'Project "' || new.title || '" status changed to ' || replace(new.status, '_', ' ') || '.',
      'info'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_project_status_updated
  after update on public.projects
  for each row execute procedure public.notify_project_status_update();

-- 4. Trigger for task assignment (notify intern)
create or replace function public.notify_task_assigned()
returns trigger as $$
declare
  project_title text;
begin
  if new.assigned_to is not null then
    select title into project_title from public.projects where id = new.project_id;
    insert into public.notifications (user_id, title, description, type)
    values (
      new.assigned_to,
      'New Task Assigned',
      'You have been assigned the task "' || new.title || '" in project "' || coalesce(project_title, 'N/A') || '".',
      'info'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_task_assigned
  after insert on public.tasks
  for each row execute procedure public.notify_task_assigned();

-- 5. Trigger for payment completed (notify client and admins)
create or replace function public.notify_payment_completed()
returns trigger as $$
declare
  admin_record record;
  client_email text;
begin
  if old.status = 'pending' and new.status = 'completed' then
    select email into client_email from public.profiles where id = new.client_id;
    
    -- Notify client
    insert into public.notifications (user_id, title, description, type)
    values (
      new.client_id,
      'Payment Successful',
      'Your payment of $' || new.amount || ' for the ' || coalesce(new.package_type, '') || ' package was successful.',
      'success'
    );
    
    -- Notify admins
    for admin_record in select id from public.profiles where role = 'admin' loop
      insert into public.notifications (user_id, title, description, type)
      values (
        admin_record.id,
        'Payment Captured',
        'Payment of $' || new.amount || ' received from ' || coalesce(client_email, 'a client') || '.',
        'success'
      );
    end loop;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_payment_completed
  after update on public.payments
  for each row execute procedure public.notify_payment_completed();

-- 6. Trigger for career applications (notify admins)
create or replace function public.notify_new_intern_application()
returns trigger as $$
declare
  admin_record record;
begin
  for admin_record in select id from public.profiles where role = 'admin' loop
    insert into public.notifications (user_id, title, description, type)
    values (
      admin_record.id,
      'New Career Application',
      new.full_name || ' submitted an application for an internship.',
      'info'
    );
  end loop;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_intern_application_created
  after insert on public.intern_applications
  for each row execute procedure public.notify_new_intern_application();

-- Add table to Supabase Realtime publication
alter publication supabase_realtime add table public.notifications;
