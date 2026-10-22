import { notifications, officer } from '../data/mockData'
import { useApp } from '../AppContext'
import { IconBell, IconHome, IconMenu, IconSearch } from './Icons'

const crumbs = {
  dashboard: ['Overview', 'Dashboard'],
  complaints: ['Case Management', 'Complaints'],
  institutions: ['Case Management', 'Institutions'],
  radar: ['Case Management', 'Coordination Radar'],
  reports: ['Analytics', 'Reports'],
  trends: ['Analytics', 'Trends'],
  settings: ['System', 'Settings'],
}

export default function Header() {
  const {
    page,
    search,
    setSearch,
    setMobileOpen,
    noticeOpen,
    setNoticeOpen,
    profileOpen,
    setProfileOpen,
    go,
    logout,
  } = useApp()
  const trail = crumbs[page] || ['Overview', 'Dashboard']

  return (
    <header className="topbar">
      <div className="crumb-wrap">
        <button className="icon-btn mobile-only" type="button" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <IconMenu size={18} />
        </button>
        <IconHome size={15} />
        <span className="crumb">
          {trail[0]} <span>/</span> {trail[1]}
        </span>
      </div>

      <div className="topbar-actions" onClick={(e) => e.stopPropagation()}>
        <label className="search-field">
          <IconSearch size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases, institutions…"
            aria-label="Search cases and institutions"
          />
        </label>

        <div className="menu-anchor">
          <button
            className="icon-btn"
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setNoticeOpen((v) => !v)
              setProfileOpen(false)
            }}
          >
            <IconBell size={16} />
            <i className="notify-dot" />
          </button>
          {noticeOpen && (
            <div className="dropdown">
              <p className="dropdown-title">Notifications</p>
              {notifications.map((n) => (
                <button key={n.id} type="button" className="dropdown-item" onClick={() => go('radar')}>
                  <strong>{n.title}</strong>
                  <span>{n.body}</span>
                  <em>{n.time}</em>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="menu-anchor">
          <button
            className="profile-chip"
            type="button"
            onClick={() => {
              setProfileOpen((v) => !v)
              setNoticeOpen(false)
            }}
          >
            <span className="avatar">{officer.name.split(' ').map((n) => n[0]).join('')}</span>
            <span className="profile-meta">
              <strong>{officer.name}</strong>
              <em>{officer.role}</em>
            </span>
          </button>
          {profileOpen && (
            <div className="dropdown dropdown-right">
              <p className="dropdown-title">{officer.bureau}</p>
              <button type="button" className="dropdown-item" onClick={() => go('settings')}>
                <strong>Open settings</strong>
                <span>Workspace preferences and display</span>
              </button>
              <button type="button" className="dropdown-item profile-logout" onClick={logout}>
                <strong>Sign out</strong>
                <span>Return to the prototype sign-in screen</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
