import { useLayoutEffect, useRef } from 'react'
import { officer } from '../data/mockData'
import { useApp } from '../AppContext'
import {
  IconBuilding,
  IconChart,
  IconChevron,
  IconFolder,
  IconGrid,
  IconRadar,
  IconSettings,
  IconShield,
  IconTrend,
} from './Icons'

const groups = [
  {
    label: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: IconGrid }],
  },
  {
    label: 'Case Management',
    items: [
      { id: 'complaints', label: 'Complaints', icon: IconFolder },
      { id: 'institutions', label: 'Institutions', icon: IconBuilding },
      { id: 'radar', label: 'Coordination Radar', icon: IconRadar },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { id: 'reports', label: 'Reports', icon: IconChart },
      { id: 'trends', label: 'Trends', icon: IconTrend },
    ],
  },
  {
    label: 'System',
    items: [{ id: 'settings', label: 'Settings', icon: IconSettings }],
  },
]

export default function Sidebar() {
  const { page, go, collapsed, setCollapsed, mobileOpen, setMobileOpen, stats } = useApp()
  const navRef = useRef(null)
  const activeItemRef = useRef(null)
  const indicatorRef = useRef(null)

  useLayoutEffect(() => {
    const nav = navRef.current
    const activeItem = activeItemRef.current
    const indicator = indicatorRef.current
    if (!nav || !activeItem || !indicator) return

    const navRect = nav.getBoundingClientRect()
    const itemRect = activeItem.getBoundingClientRect()
    const x = itemRect.right - navRect.left - (collapsed ? 4 : 10) - 2
    const y = itemRect.top - navRect.top + (itemRect.height - 16) / 2
    indicator.style.transform = `translate3d(${x}px, ${y}px, 0)`
    indicator.style.opacity = '1'
  }, [page, collapsed])

  return (
    <>
      {mobileOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-open' : ''}`}>
        <div className="brand-row">
          <div className="brand">
            <span className="brand-mark">
              <IconShield size={16} />
            </span>
            {!collapsed && (
              <span className="brand-copy">
                <strong>CaseSaarthi</strong>
                <em>Institutional Complaint Monitoring</em>
              </span>
            )}
          </div>
          <button
            className="icon-btn collapse-btn"
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((v) => !v)}
          >
            <IconChevron size={16} />
          </button>
        </div>

        {!collapsed && (
          <div className="welcome">
            <h2>
              Welcome
              <br />
              Back, {officer.name.split(' ')[0]}
            </h2>
            <p>Last login: {officer.lastLogin}</p>
          </div>
        )}

        <nav className="nav" ref={navRef}>
          <i className="nav-indicator" ref={indicatorRef} aria-hidden="true" />
          {groups.map((group) => (
            <div key={group.label} className="nav-group">
              {!collapsed && <p className="nav-label">{group.label}</p>}
              {group.items.map((item) => {
                const Icon = item.icon
                const active = page === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`nav-item ${active ? 'is-active' : ''}`}
                    ref={active ? activeItemRef : undefined}
                    onClick={() => go(item.id)}
                    title={item.label}
                  >
                    <Icon size={16} />
                    {!collapsed && <span>{item.label}</span>}
                    {item.id === 'radar' && !collapsed && (
                      <em className="nav-count">{stats.overlaps}</em>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
