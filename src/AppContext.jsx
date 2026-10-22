import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { initialComplaints, institutions as mockInstitutions, overlapAlerts } from './data/mockData'
import { supabase, supabaseConfigStatus, verifySupabaseConnection } from './lib/supabase'

const AppContext = createContext(null)

const demoCredentials = {
  email: 'demo@casesaarthi.local',
  password: 'SaarthiDemo2026!',
}

function nextCaseId(complaints) {
  const nums = complaints.map((c) => Number(c.id.split('-').pop()) || 1000)
  const next = Math.max(...nums, 1228) + 1
  return `CS-2026-${next}`
}

function getSafeAuthError(error) {
  const code = typeof error?.code === 'string' ? error.code.toLowerCase() : ''
  const message = typeof error?.message === 'string' ? error.message.toLowerCase() : ''

  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return 'Supabase Auth says this email is not confirmed. In Supabase Dashboard, open Authentication → Users and check the user’s confirmation status.'
  }

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'Supabase Auth rejected the credentials. Check the email and password for this Auth user; confirming the email does not set or verify the password you entered.'
  }

  if (error?.status === 429) {
    return 'Supabase Auth is rate-limiting sign-in attempts (HTTP 429). Wait a few minutes before trying again.'
  }

  if (error?.status === 401 || message.includes('invalid api key')) {
    return 'Supabase Auth rejected the frontend API key. Verify VITE_SUPABASE_ANON_KEY in the local environment and restart the dev server.'
  }

  if (error?.name === 'AuthRetryableFetchError' || error instanceof TypeError || message.includes('fetch failed')) {
    return 'The sign-in request could not reach Supabase Auth. Check your internet connection and the browser Network panel for a blocked request.'
  }

  const codeLabel = /^[a-z0-9_.-]+$/.test(code) ? ` (${code})` : ''
  const statusLabel = Number.isInteger(error?.status) ? ` (HTTP ${error.status})` : ''
  return `Supabase Auth sign-in failed${statusLabel}${codeLabel}. Check Authentication → Logs in the Supabase Dashboard.`
}

function getSafeDatabaseError(error) {
  const code = typeof error?.code === 'string' ? error.code.toLowerCase() : ''
  const message = typeof error?.message === 'string' ? error.message.toLowerCase() : ''

  if (code === '42501' || error?.status === 403 || message.includes('permission denied')) {
    return 'Supabase denied database access for this Auth session. Check the SELECT grants and RLS policies for complaints, institutions, and their views.'
  }

  if (code === 'pgrst205' || code === '42p01') {
    return 'A required Supabase table or view was not found. Check that the existing database migration was applied to this project.'
  }

  if (code === 'pgrst301' || error?.status === 401) {
    return 'Supabase rejected or expired the Auth session. Sign out and sign in again.'
  }

  if (error?.name === 'AuthRetryableFetchError' || error instanceof TypeError || message.includes('fetch failed')) {
    return 'The database request could not reach Supabase. Check your internet connection and browser Network panel.'
  }

  const codeLabel = /^[a-z0-9_.-]+$/.test(code) ? ` (${code})` : ''
  const statusLabel = Number.isInteger(error?.status) ? ` (HTTP ${error.status})` : ''
  return `Supabase data loading failed${statusLabel}${codeLabel}. Check the Supabase Dashboard logs and database setup.`
}

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const demoSession = useRef(false)
  const [page, setPage] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [complaints, setComplaints] = useState(initialComplaints)
  const [institutions, setInstitutions] = useState(mockInstitutions)
  const [databaseStatus, setDatabaseStatus] = useState(supabase ? 'checking' : 'mock')
  const [databaseError, setDatabaseError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState(
    supabase ? 'checking' : supabaseConfigStatus,
  )
  const [connectionMessage, setConnectionMessage] = useState(
    supabase
      ? 'Checking the Supabase project connection…'
      : supabaseConfigStatus === 'missing-url'
        ? 'Add VITE_SUPABASE_URL to the local environment file.'
        : supabaseConfigStatus === 'missing-key'
          ? 'Add VITE_SUPABASE_ANON_KEY to the local environment file.'
          : 'Supabase is not configured.',
  )
  const [overlapReviews, setOverlapReviews] = useState({})
  const [inspectId, setInspectId] = useState(null)
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    if (!supabase) return undefined

    let active = true
    let requestId = 0

    const checkConnection = async () => {
      setConnectionStatus('checking')
      setConnectionMessage('Checking the Supabase project connection…')

      const result = await verifySupabaseConnection()
      if (!active) return
      setConnectionStatus(result.ok ? 'connected' : 'error')
      setConnectionMessage(result.message)
    }

    const loadDatabase = async (session) => {
      const currentRequest = ++requestId
      if (!session) {
        setDatabaseStatus('auth-required')
        setDatabaseError('')
        if (!demoSession.current) setIsAuthenticated(false)
        return
      }

      demoSession.current = false
      setIsAuthenticated(true)
      setDatabaseStatus('loading')
      setDatabaseError('')
      try {
        const [complaintsResult, institutionsResult] = await Promise.all([
          supabase.from('complaints_with_institution').select('*').order('received', { ascending: false }),
          supabase.from('institution_directory').select('*').order('name'),
        ])

        if (!active || currentRequest !== requestId) return
        if (complaintsResult.error) throw complaintsResult.error
        if (institutionsResult.error) throw institutionsResult.error

        setComplaints(complaintsResult.data)
        setInstitutions(institutionsResult.data)
        setDatabaseStatus('connected')
        setConnectionStatus('connected')
        setConnectionMessage('Supabase project connected and data access is available.')
      } catch (error) {
        if (!active || currentRequest !== requestId) return
        setDatabaseStatus('error')
        setDatabaseError(getSafeDatabaseError(error))
      }
    }

    const initialize = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (!active) return
        if (error) {
          setDatabaseStatus('error')
          setDatabaseError('Unable to check the Supabase Auth session.')
        }
        if (!error) await loadDatabase(data.session)
      } catch {
        if (!active) return
        setDatabaseStatus('error')
        setDatabaseError('Unable to check the Supabase Auth session.')
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => void loadDatabase(session))
    })
    void checkConnection()
    void initialize()

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const addComplaint = async (payload) => {
    const record = {
      id: nextCaseId(complaints),
      status: payload.status || 'Pending',
      ...payload,
    }

    if (supabase) {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !sessionData.session) {
        throw new Error('Sign in with your Supabase account to save complaints. Demo access is read-only.')
      }

      const { data, error } = await supabase
        .from('complaints')
        .insert({
          id: record.id,
          institution_id: record.institutionId,
          category: record.category,
          bureau: record.bureau,
          officer: record.officer,
          received: record.received,
          expected: record.expected,
          status: record.status,
          description: record.description,
        })
        .select('id, institution_id, category, bureau, officer, received, expected, status, description')
        .single()

      if (error) {
        if (error.code === '42501' || error.status === 401 || error.status === 403) {
          throw new Error('Complaint saving is not enabled yet. Apply the authenticated complaint-insert migration.')
        }
        if (error.code === '23503') {
          throw new Error('This institution is not in the Supabase database yet. Add its institution record before creating the complaint.')
        }
        if (error.code === '23505') {
          throw new Error('A complaint with this generated ID already exists. Please submit again.')
        }
        throw new Error('Supabase could not save this complaint. Check your connection and try again.')
      }

      const savedRecord = {
        ...data,
        institutionId: data.institution_id,
        institution: institutions.find((institution) => institution.id === data.institution_id)?.name || record.institution,
      }
      setComplaints((list) => [savedRecord, ...list])
      return savedRecord
    }

    setComplaints((list) => [record, ...list])
    return record
  }

  const updateComplaint = async (id, patch) => {
    const current = complaints.find((complaint) => complaint.id === id)
    if (!current) throw new Error('This complaint is no longer available. Refresh the page and try again.')

    if (supabase) {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !sessionData.session) {
        throw new Error('Sign in with your Supabase account to update complaints. Demo access is read-only.')
      }

      const update = {}
      if (typeof patch.status === 'string') update.status = patch.status
      if (typeof patch.bureau === 'string') update.bureau = patch.bureau
      if (!Object.keys(update).length) {
        throw new Error('No supported complaint changes were provided.')
      }

      const { data, error } = await supabase
        .from('complaints')
        .update(update)
        .eq('id', id)
        .select('id, institution_id, category, bureau, officer, received, expected, status, description')
        .single()

      if (error) {
        if (error.code === '42501' || error.status === 401 || error.status === 403) {
          throw new Error('Complaint updates are not enabled yet. Apply the authenticated complaint-update migration.')
        }
        throw new Error('Supabase could not update this complaint. Check your connection and try again.')
      }

      const savedRecord = {
        ...data,
        institutionId: data.institution_id,
        institution: institutions.find((institution) => institution.id === data.institution_id)?.name || current.institution,
      }
      setComplaints((list) => list.map((complaint) => (complaint.id === id ? savedRecord : complaint)))
      return savedRecord
    }

    const savedRecord = { ...current, ...patch }
    setComplaints((list) => list.map((complaint) => (complaint.id === id ? savedRecord : complaint)))
    return savedRecord
  }

  const reviewOverlap = (id, decision) => {
    setOverlapReviews((prev) => ({ ...prev, [id]: decision }))
  }

  const login = async (email, password) => {
    const valid =
      email.trim().toLowerCase() === demoCredentials.email &&
      password === demoCredentials.password

    if (valid) {
      if (supabase) {
        const { error } = await supabase.auth.signOut()
        if (error) {
          return {
            success: false,
            message: `Could not clear the existing Supabase session: ${getSafeAuthError(error)}`,
          }
        }
      }
      demoSession.current = true
      setPage('dashboard')
      setIsAuthenticated(true)
      return { success: true }
    }

    if (!supabase) {
      return { success: false, message: 'Supabase Auth is not configured. Use the prototype demo credentials.' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) return { success: false, message: getSafeAuthError(error) }
      if (!data.session) {
        return {
          success: false,
          message: 'Supabase Auth returned no session. Check Authentication → Logs in the Supabase Dashboard.',
        }
      }
    } catch (error) {
      return { success: false, message: getSafeAuthError(error) }
    }

    demoSession.current = false
    setPage('dashboard')
    setIsAuthenticated(true)
    return { success: true }
  }

  const requestPasswordReset = async (email) => {
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase Auth is not configured. Check the local VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY settings.',
      }
    }

    const hostname = window.location.hostname.toLowerCase()
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === '::1' ||
      /^127(?:\.\d{1,3}){3}$/.test(hostname)
    ) {
      return {
        success: false,
        message: 'This page is open at localhost, which only works on this device. To open the recovery email on your phone, open CaseSaarthi on both devices using your laptop’s Wi-Fi IPv4 address, or use your deployed CaseSaarthi website, then request a new recovery email.',
      }
    }

    try {
      const redirectTo = new URL('/reset-password', window.location.origin).toString()
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo })
      if (error) return { success: false, message: getSafeAuthError(error) }
      return {
        success: true,
        message: 'If this address belongs to an account, Supabase will send a recovery link to this CaseSaarthi address. Open the new link on a device that can reach this address.',
      }
    } catch (error) {
      return { success: false, message: getSafeAuthError(error) }
    }
  }

  const logout = () => {
    demoSession.current = false
    setIsAuthenticated(false)
    setPage('dashboard')
    setMobileOpen(false)
    setNoticeOpen(false)
    setProfileOpen(false)
    setInspectId(null)
    if (supabase) {
      void supabase.auth.signOut().then(({ error }) => {
        if (error) setDatabaseError('Supabase sign-out could not be confirmed.')
      }).catch(() => setDatabaseError('Supabase sign-out could not be confirmed.'))
    }
  }

  const go = (next) => {
    setPage(next)
    setMobileOpen(false)
    setNoticeOpen(false)
    setProfileOpen(false)
  }

  const stats = useMemo(() => {
    const pending = complaints.filter((c) => c.status === 'Pending').length
    const underProcess = complaints.filter((c) => c.status === 'Under Process').length
    const disposed = complaints.filter((c) => c.status === 'Disposed').length
    return {
      total: complaints.length,
      pending,
      underProcess,
      disposed,
      overlaps: overlapAlerts.length,
    }
  }, [complaints])

  const value = {
    isAuthenticated,
    login,
    requestPasswordReset,
    logout,
    page,
    go,
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
    search,
    setSearch,
    complaints,
    institutions,
    databaseStatus,
    databaseError,
    connectionStatus,
    connectionMessage,
    addComplaint,
    updateComplaint,
    overlapReviews,
    reviewOverlap,
    inspectId,
    setInspectId,
    noticeOpen,
    setNoticeOpen,
    profileOpen,
    setProfileOpen,
    stats,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
