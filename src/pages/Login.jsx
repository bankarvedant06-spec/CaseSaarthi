import { useState } from 'react'
import { useApp } from '../AppContext'
import { IconEye, IconEyeOff, IconShield } from '../components/Icons'

const prototypeEmail = 'demo@casesaarthi.local'
const prototypePassword = 'SaarthiDemo2026!'

export default function Login() {
  const { login, requestPasswordReset, connectionStatus, connectionMessage } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [recovering, setRecovering] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setNotice('')
    try {
      if (recovering) {
        const result = await requestPasswordReset(email)
        if (result.success) setNotice(result.message)
        else setError(result.message)
      } else {
        const result = await login(email, password)
        setError(result.success ? '' : result.message)
      }
    } catch {
      setError('The request could not be completed. Check the Supabase Auth status message below and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-screen">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand">
          <span className="login-brand-mark">
            <IconShield size={19} />
          </span>
          <span>CaseSaarthi</span>
        </div>

        <div className="login-intro">
          <h1 id="login-title">{recovering ? 'Reset your password' : 'Welcome back'}</h1>
          <p>
            {recovering
              ? 'Enter your account email and we’ll send a secure password recovery link.'
              : 'Sign in to continue to your institutional workspace.'}
          </p>
        </div>

        <form className="login-form" onSubmit={submit}>
          <label className="login-field">
            <span>Email address</span>
            <input
              type="email"
              autoComplete="username"
              placeholder="name@institution.org"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
              required
            />
          </label>

          {!recovering && (
            <label className="login-field">
              <span>Password</span>
              <span className="login-password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setError('')
                    setNotice('')
                  }}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                </button>
              </span>
            </label>
          )}

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}
          {notice && <p className="login-success" role="status">{notice}</p>}

          <button className="login-submit" type="submit" disabled={submitting}>
            {submitting
              ? recovering ? 'Sending link…' : 'Signing in…'
              : recovering ? 'Send recovery link' : 'Sign in'}
          </button>
        </form>

        <button
          className="login-link"
          type="button"
          onClick={() => {
            setRecovering((value) => !value)
            setError('')
            setNotice('')
          }}
        >
          {recovering ? 'Back to sign in' : 'Forgot password?'}
        </button>

        {!recovering && (
          <p className="login-demo">
            <strong>Prototype demo</strong>
            <span>{prototypeEmail}</span>
            <span>{prototypePassword}</span>
          </p>
        )}

        <footer className="login-footer">
          <span>Institutional Complaint Monitoring</span>
          <span>Prototype access only · Not connected to institutional accounts</span>
        </footer>
        <p className={`login-connection is-${connectionStatus}`} role="status">
          <i aria-hidden="true" />
          {connectionMessage}
        </p>
      </section>
    </main>
  )
}
