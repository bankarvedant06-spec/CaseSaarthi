import { useApp } from '../AppContext'
import Header from './Header'
import InspectModal from './InspectModal'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const { setNoticeOpen, setProfileOpen, databaseStatus, databaseError } = useApp()

  return (
    <div
      className="shell"
      onClick={() => {
        setNoticeOpen(false)
        setProfileOpen(false)
      }}
    >
      <div className="app-frame">
        <Sidebar />
        <div className="workspace">
          <Header />
          {databaseStatus === 'auth-required' && (
            <p className="database-notice" role="status">
              Supabase is configured, but no Supabase Auth session exists. Showing local demo data;
              the prototype login does not authenticate database users.
            </p>
          )}
          {databaseStatus === 'loading' && (
            <p className="database-notice" role="status">Loading authenticated Supabase data…</p>
          )}
          {databaseStatus === 'connected' && (
            <p className="database-notice" role="status">
              Connected to Supabase. Complaint creation, Bureau assignments, and status changes are saved to the database.
            </p>
          )}
          {databaseStatus === 'error' && (
            <p className="database-notice is-error" role="alert">
              Supabase data could not be loaded: {databaseError} Local demo data remains visible.
            </p>
          )}
          <main className="content">{children}</main>
        </div>
      </div>
      <InspectModal />
    </div>
  )
}
