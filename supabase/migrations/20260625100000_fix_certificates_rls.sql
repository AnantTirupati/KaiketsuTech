-- Drop old certificates public select policy
drop policy if exists "Allow public read active certificates" on public.certificates;

-- Create new certificates public select policy to allow verification of revoked certificates
create policy "Allow public read all certificates" on public.certificates
    for select using (true);
