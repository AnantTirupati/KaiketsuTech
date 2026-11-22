-- Extends intern access to the senior role in the places the first senior-role
-- migration could not reach: the is_intern() helper (used by projects, tasks,
-- milestones and deliverable storage) and three policies that list roles inline.

create or replace function public.is_intern()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('intern', 'senior')
  );
end;
$$;

alter policy "Allow interns and admins select all conversations" on public.conversations
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = any (array['intern'::text, 'admin'::text, 'senior'::text])
  ));

alter policy "Allow interns and admins to read all messages" on public.messages
  using (exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = any (array['intern'::text, 'admin'::text, 'senior'::text])
  ));

alter policy "Allow admins and interns to read all project files" on storage.objects
  using (bucket_id = 'project-files' and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = any (array['admin'::text, 'intern'::text, 'senior'::text])
  ));
