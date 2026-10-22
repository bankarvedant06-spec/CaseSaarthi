import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { IconShield } from '../components/Icons'

export default function ResetPassword() {
  const [checking, setChecking] = useState(Boolean(supabase))
  const [recoveryReady, setRecoveryReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState(
    supabase ? '' : 'Supabase Auth is not configured. Check the local environment settings.',
  )
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    let active = true
    const recoveryInUrl =
      new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery' ||
      new URLSearchParams(window.location.search).get('type') === 'recovery'

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'PASSWORD_RECOVERY' && session) {
        setRecoveryReady(true)
        setError('')
      }
    })

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError) {
        setError('Could not validate the recovery link. Request a new password recovery email.')
      } else if (recoveryInUrl && data.session) {
        setRecoveryReady(true)
      }
      setChecking(false)
    }).catch(() => {
      if (!active) return
      setError('Could not validate the recovery link. Check your connection or request a new recovery email.')
      setChecking(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (password.length < 6) {
      setError('Use a password with at least 6 characters.')
      return
    }
    if (password !== confirmation) {
      setError('The passwords do not match.')
      return
    }
    if (!recoveryReady || !supabase) {
      setError('This recovery session is not valid. Request a new password recovery email.')
      return
    }

    setSaving(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        if (updateError.status === 401 || updateError.code === 'session_not_found') {
          setError('This recovery link has expired or was already used. Request a new recovery email.')
        } else if (updateError.status === 429) {
          setError('Supabase is temporarily rate-limiting password changes. Wait a few minutes and try again.')
        } else {
          setError('Supabase could not update the password. Check Authentication → Logs in the Supabase Dashboard.')
        }
        return
      }
      setPassword('')
      setConfirmation('')
      setNotice('Your password has been updated. You can now continue to CaseSaarthi.')
    } catch {
      setError('Could not reach Supabase Auth. Check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="login-screen">
      <section className="login-panel" aria-labelledby="reset-title">
        <div className="login-brand">
          <span className="login-brand-mark"><IconShield size={19} /></span>
          <span>CaseSaarthi</span>
        </div>
        <div className="login-intro">
          <h1 id="reset-title">Set a new password</h1>
          <p>Choose a new password for your institutional workspace account.</p>
        </div>

        {checking ? (
          <p className="login-connection" role="status">Validating your recovery link…</p>
        ) : recoveryReady ? (
          <form className="login-form" onSubmit={submit}>
            <label className="login-field">
              <span>New password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
              />
            </label>
            <label className="login-field">
              <span>Confirm new password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                required
                minLength={6}
              />
            </label>
            {error && <p className="login-error" role="alert">{error}</p>}
            {notice && <p className="login-success" role="status">{notice}</p>}
            {notice ? (
              <button className="login-submit" type="button" onClick={() => window.location.assign('/')}>
                Continue to sign in
              </button>
            ) : (
              <button className="login-submit" type="submit" disabled={saving}>
                {saving ? 'Updating password…' : 'Update password'}
              </button>
            )}
          </form>
        ) : (
          <div>
            <p className="login-error" role="alert">
              {error || 'This recovery link is invalid, expired, or already used. Request a new one.'}
            </p>
            <a className="login-link login-link-anchor" href="/">Return to sign in</a>
          </div>
        )}

        <footer className="login-footer">
          <span>Institutional Complaint Monitoring</span>
        </footer>
      </section>
    </main>
  )
}
