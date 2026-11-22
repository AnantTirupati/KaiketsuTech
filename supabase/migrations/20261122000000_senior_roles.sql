-- =============================================================
-- Senior roles: leadership accounts that are not interns
--
-- * Adds a `senior` profile role beside admin / client / intern.
-- * Gives every policy that grants interns access the same access to seniors.
-- * Adds a few read-only extras for seniors (applications and project requests).
-- * Adds designation columns to `interns`, so existing intern IDs and
--   certificates stay valid while the person's role changes behind them.
-- * People are assigned to the role separately, so no personal data lives in this file.
--
-- Safe to run more than once. A data backup was taken before this change.
-- =============================================================

-- 1. Allow the new role
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('admin', 'client', 'intern', 'senior'));

-- 2. Designation columns. The record keeps its KT-INT-xxxx ID and certificates.
alter table public.interns
  add column if not exists member_type text not null default 'intern'
    check (member_type in ('intern', 'senior')),
  add column if not exists designation text,
  add column if not exists leadership_title text;

-- 3. Every existing policy that matches role = 'intern' now also matches 'senior'
do $$
declare
  p record;
  new_using text;
  new_check text;
begin
  for p in
    select schemaname, tablename, policyname, qual, with_check
    from pg_policies
    where qual like '%''intern''::text%' or with_check like '%''intern''::text%'
  loop
    new_using := replace(p.qual, '= ''intern''::text', '= ANY (ARRAY[''intern''::text, ''senior''::text])');
    new_check := replace(p.with_check, '= ''intern''::text', '= ANY (ARRAY[''intern''::text, ''senior''::text])');
    if p.qual is not null and p.with_check is not null then
      execute format('alter policy %I on %I.%I using (%s) with check (%s)',
        p.policyname, p.schemaname, p.tablename, new_using, new_check);
    elsif p.qual is not null then
      execute format('alter policy %I on %I.%I using (%s)',
        p.policyname, p.schemaname, p.tablename, new_using);
    else
      execute format('alter policy %I on %I.%I with check (%s)',
        p.policyname, p.schemaname, p.tablename, new_check);
    end if;
  end loop;
end $$;

-- 4. Extra read access for seniors (on top of intern access)
drop policy if exists "Allow seniors to read intern applications" on public.intern_applications;
create policy "Allow seniors to read intern applications" on public.intern_applications
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'senior')
  );

drop policy if exists "Allow seniors to read project requests" on public.project_requests;
create policy "Allow seniors to read project requests" on public.project_requests
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'senior')
  );
