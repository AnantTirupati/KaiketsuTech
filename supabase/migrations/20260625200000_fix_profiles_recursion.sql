-- Drop the recursive public read policy on profiles to resolve infinite recursion loop
drop policy if exists "Allow public read intern profiles" on public.profiles;
