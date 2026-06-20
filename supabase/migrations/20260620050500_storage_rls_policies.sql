-- Allow clients and admins to update (overwrite) their own project-files
create policy "Allow clients and admins to update project files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'project-files' and 
  (is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
)
with check (
  bucket_id = 'project-files' and 
  (is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
);

-- Allow interns and admins to update (overwrite) their own deliverables
create policy "Allow interns and admins to update deliverables"
on storage.objects for update
to authenticated
using (
  bucket_id = 'deliverables' and 
  (is_intern() or (storage.foldername(name))[1] = auth.uid()::text)
)
with check (
  bucket_id = 'deliverables' and 
  (is_intern() or (storage.foldername(name))[1] = auth.uid()::text)
);

-- Allow interns and admins to delete their own deliverables
create policy "Allow interns and admins to delete deliverables"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'deliverables' and 
  (is_intern() or (storage.foldername(name))[1] = auth.uid()::text)
);
