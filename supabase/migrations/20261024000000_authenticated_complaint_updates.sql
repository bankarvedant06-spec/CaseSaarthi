grant update (bureau, status) on public.complaints to authenticated;

create policy "Authenticated users can update complaint assignments and status"
  on public.complaints
  for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
