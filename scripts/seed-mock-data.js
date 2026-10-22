import { createClient } from '@supabase/supabase-js'
import { initialComplaints, institutions } from '../src/data/mockData.js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the seed environment.')
}

const institutionIds = new Set(institutions.map((institution) => institution.id))
const missingInstitutions = initialComplaints.filter(
  (complaint) => !institutionIds.has(complaint.institutionId),
)

if (missingInstitutions.length) {
  throw new Error(
    `Cannot seed complaints with unknown institution IDs: ${missingInstitutions
      .map((complaint) => complaint.id)
      .join(', ')}`,
  )
}

const client = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { error: accessError } = await client
  .from('institutions')
  .select('id')
  .limit(0)

if (accessError) {
  if (
    accessError.status === 401 ||
    accessError.status === 403 ||
    accessError.code === 'PGRST301' ||
    /invalid api key/i.test(accessError.message)
  ) {
    if (
      accessError.status === 403 ||
      accessError.code === '42501' ||
      /permission denied/i.test(accessError.message)
    ) {
      throw new Error(
        'Supabase accepted the API key, but the database role lacks privileges on public.institutions. In Supabase SQL Editor, grant the service_role SELECT, INSERT, and UPDATE on public.institutions and public.complaints, then retry. This does not require changing RLS policies.',
      )
    }

    throw new Error(
      'Supabase rejected SUPABASE_SERVICE_ROLE_KEY. In the Supabase Dashboard, open Project Settings > API Keys and copy the service_role key for this same project. Do not use a publishable/anon key or a session JWT. The key must be the project API key, not a browser token.',
    )
  }

  throw new Error(
    'Could not verify Supabase access before seeding. Check the project URL, network, and that the institutions table exists. No data was written.',
  )
}

const institutionRows = institutions.map(({ id, name, type, state }) => ({
  id,
  name,
  type,
  state,
}))

const { error: institutionError } = await client
  .from('institutions')
  .upsert(institutionRows, { onConflict: 'id' })

if (institutionError) {
  throw new Error(`Unable to seed institutions: ${institutionError.message}`)
}

const complaintRows = initialComplaints.map((complaint) => ({
  id: complaint.id,
  institution_id: complaint.institutionId,
  category: complaint.category,
  bureau: complaint.bureau,
  officer: complaint.officer,
  received: complaint.received,
  expected: complaint.expected,
  status: complaint.status,
  description: complaint.description,
}))

const { error: complaintError } = await client
  .from('complaints')
  .upsert(complaintRows, { onConflict: 'id' })

if (complaintError) {
  throw new Error(`Unable to seed complaints: ${complaintError.message}`)
}

console.log(`Seeded ${institutionRows.length} institutions and ${complaintRows.length} complaints.`)
