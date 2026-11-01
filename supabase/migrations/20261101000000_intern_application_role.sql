-- ============================================================
-- Migration: 20261101000000_intern_application_role
-- Record which role an applicant applied for.
-- Applications submitted before this migration have no role
-- (both columns stay null).
-- ============================================================

alter table public.intern_applications
    add column if not exists job_posting_id uuid references public.job_postings(id) on delete set null,
    add column if not exists role_title text;  -- kept even if the posting is later deleted

create index if not exists idx_intern_applications_job_posting_id
    on public.intern_applications(job_posting_id);

-- Include the role in the admin notification
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
      new.full_name || ' submitted an application for ' || coalesce(new.role_title, 'an internship') || '.',
      'info'
    );
  end loop;
  return new;
end;
$$ language plpgsql security definer;
