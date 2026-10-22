import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigStatus =
  !supabaseUrl && !supabaseKey
    ? 'not-configured'
    : !supabaseUrl
      ? 'missing-url'
      : !supabaseKey
        ? 'missing-key'
        : 'ready'

export const supabase = supabaseConfigStatus === 'ready'
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null

export async function verifySupabaseConnection() {
  try {
    const response = await fetch(new URL('/auth/v1/health', supabaseUrl), {
      method: 'GET',
      headers: { apikey: supabaseKey },
      signal: AbortSignal.timeout(10000),
    })

    if (response.ok) {
      return {
        ok: true,
        message: 'Supabase Auth endpoint is reachable. Sign in with a Supabase Auth user to load database records.',
      }
    }

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        message: `Supabase rejected the frontend API key (HTTP ${response.status}). Check the publishable/anon key in Project Settings → API Keys.`,
      }
    }

    if (response.status === 404) {
      return {
        ok: false,
        message: 'The Supabase Auth endpoint was not found (HTTP 404). Check VITE_SUPABASE_URL in the local environment.',
      }
    }

    return {
      ok: false,
      message: `Supabase Auth returned HTTP ${response.status}. Check the project status in the Supabase Dashboard.`,
    }
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      return { ok: false, message: 'Supabase Auth connection timed out. Check your internet connection and try again.' }
    }

    if (error instanceof TypeError) {
      return {
        ok: false,
        message: 'Could not reach Supabase Auth. Check your internet connection, browser network access, and VITE_SUPABASE_URL.',
      }
    }

    return { ok: false, message: 'Supabase Auth connection check failed unexpectedly. Restart the dev server and try again.' }
  }
}
