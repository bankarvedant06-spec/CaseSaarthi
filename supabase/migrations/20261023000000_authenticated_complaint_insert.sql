grant insert (
  id,
  institution_id,
  category,
  bureau,
  officer,
  received,
  expected,
  status,
  description
) on public.complaints to authenticated;

create policy "Authenticated users can create complaints"
  on public.complaints
  for insert
  to authenticated
  with check (auth.uid() is not null);
