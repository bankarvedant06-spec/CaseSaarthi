import { useMemo, useState } from 'react'
import { bureaus, monthlyVolume, officer } from '../data/mockData'
import { useApp } from '../AppContext'
import CoordinationAlerts from '../components/CoordinationAlerts'
import {
  IconChart,
  IconFolder,
  IconGrid,
  IconRadar,
  IconTrend,
} from '../components/Icons'
import RecentComplaints from '../components/RecentComplaints'

const kpiDetails = [
  {
    key: 'all',
    label: 'Total Complaints',
    icon: IconFolder,
    note: 'Across all bureaus',
    tone: 'lilac',
  },
  {
    key: 'Pending',
    label: 'Pending',
    icon: IconTrend,
    note: 'Awaiting first action',
    tone: 'amber',
  },
  {
    key: 'Under Process',
    label: 'Under Process',
    icon: IconChart,
    note: 'Currently under review',
    tone: 'blue',
  },
  {
    key: 'Disposed',
    label: 'Disposed',
    icon: IconGrid,
    note: 'Disposed records',
    tone: 'green',
  },
  {
    key: 'overlaps',
    label: 'Potential Overlaps',
    icon: IconRadar,
    note: 'For officer review',
    tone: 'rose',
  },
]

const decorativeLines = [
  'M2 21 C12 19 14 22 23 15 S37 18 45 10 S60 14 70 6',
  'M2 15 C11 13 14 19 23 16 S37 8 45 13 S60 7 70 9',
  'M2 18 C12 20 15 10 24 13 S38 18 46 9 S60 12 70 4',
  'M2 19 C12 14 16 18 24 11 S39 14 47 8 S60 12 70 5',
  'M2 17 C12 12 16 18 25 15 S38 10 47 13 S61 5 70 8',
]

export default function Dashboard() {
  const { complaints, search, stats, go } = useApp()
  const [filter, setFilter] = useState('all')
  const [bureau, setBureau] = useState('all')
  const [detail, setDetail] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return complaints.filter((c) => {
      const matchQ =
        !q ||
        [c.id, c.institution, c.category, c.bureau, c.officer, c.status]
          .join(' ')
          .toLowerCase()
          .includes(q)
      const matchStatus =
        filter === 'all' || filter === 'overlaps' || c.status === filter
      const matchBureau = bureau === 'all' || c.bureau === bureau
      return matchQ && matchStatus && matchBureau
    })
  }, [complaints, search, filter, bureau])

  const kpiValues = [stats.total, stats.pending, stats.underProcess, stats.disposed, stats.overlaps]
  const statusTotal = stats.total || 1
  const disposalRate = Math.round((stats.disposed / statusTotal) * 100)
  const bureauCounts = bureaus.map((name) => ({
    name,
    count: filtered.filter((complaint) => complaint.bureau === name).length,
  }))
  const maxBureauCount = Math.max(...bureauCounts.map((item) => item.count), 1)

  const selectFilter = (nextFilter) => {
    setFilter((current) => (current === nextFilter ? 'all' : nextFilter))
  }

  return (
    <div className="page dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <p className="dashboard-kicker">Institutional Complaint Monitoring</p>
          <h1>Welcome back, {officer.name.split(' ')[0]}</h1>
          <p className="welcome-description">
            Your overview of complaint activity, institutional workload and coordination.
          </p>
        </div>
        <nav className="dashboard-actions" aria-label="Dashboard actions">
          <button className="is-active" type="button" onClick={() => go('dashboard')}>
            Overview
          </button>
          <button type="button" onClick={() => go('complaints')}>
            New Complaint
          </button>
          <button type="button" onClick={() => go('trends')}>
            Analyse Data
          </button>
          <button type="button" onClick={() => go('reports')}>
            Reports
          </button>
        </nav>
      </section>

      <section className="dashboard-kpis" aria-label="Complaint statistics">
        {kpiDetails.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              className={`dashboard-kpi ${item.tone} ${filter === item.key ? 'is-selected' : ''}`}
              key={item.key}
              type="button"
              aria-pressed={filter === item.key}
              onClick={() => selectFilter(item.key)}
            >
              <span className="kpi-topline">
                <span className={`kpi-icon ${item.tone}`}>
                  <Icon size={16} />
                </span>
                <span className="kpi-label">{item.label}</span>
              </span>
              <strong className="kpi-value">{kpiValues[index]}</strong>
              <span className="kpi-note">{item.note}</span>
              <svg className="kpi-spark" viewBox="0 0 72 26" aria-hidden="true">
                <path d={decorativeLines[index]} />
              </svg>
            </button>
          )
        })}
      </section>

      <section className="dashboard-analytics" aria-label="Complaint analytics">
        <article className="panel activity-card">
          <header className="dashboard-panel-head">
            <div>
              <p className="eyebrow">Caseload overview</p>
              <h2>Complaint Activity</h2>
            </div>
            <span className="chart-legend">
              <i />
              Received
            </span>
          </header>
          <div className="activity-summary">
            <strong>{stats.total.toLocaleString('en-IN')}</strong>
            <span>complaints currently recorded</span>
          </div>
          <ActivityChart />
        </article>

        <article className="panel resolution-card">
          <div className="dashboard-panel-head">
            <div>
              <p className="eyebrow">Current caseload</p>
              <h2>Disposal rate</h2>
            </div>
          </div>
          <ResolutionGauge value={disposalRate} />
          <ul className="status-breakdown">
            <li>
              <i className="status-dot pending" />
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </li>
            <li>
              <i className="status-dot processing" />
              <span>Under Process</span>
              <strong>{stats.underProcess}</strong>
            </li>
            <li>
              <i className="status-dot disposed" />
              <span>Disposed</span>
              <strong>{stats.disposed}</strong>
            </li>
          </ul>
        </article>
      </section>

      <div className="dashboard-list-controls">
        <label>
          Bureau / Cell
          <select value={bureau} onChange={(event) => setBureau(event.target.value)}>
            <option value="all">All bureaus</option>
            {bureaus.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <p>
          {filter === 'overlaps'
            ? 'Potential overlaps are listed in Coordination Radar.'
            : `${filtered.length} records match the current view`}
        </p>
        {(bureau !== 'all' || filter !== 'all') && (
          <button
            className="text-btn"
            type="button"
            onClick={() => {
              setBureau('all')
              setFilter('all')
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <section className="dashboard-lower" aria-label="Complaint activity details">
        <RecentComplaints
          className="recent-dashboard-card"
          rows={filtered.slice(0, 5)}
          onOpen={setDetail}
          compact
        />
        <CoordinationAlerts className="radar-dashboard-card" compact />
        <article className="panel workload-card">
          <header className="dashboard-panel-head">
            <div>
              <p className="eyebrow">Distribution</p>
              <h2>Bureau Workload</h2>
            </div>
            <button className="text-btn" type="button" onClick={() => go('institutions')}>
              Institutions
            </button>
          </header>
          <ul className="workload-list">
            {bureauCounts.map((item) => (
              <li key={item.name}>
                <div className="workload-meta">
                  <span>{item.name}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className="workload-track">
                  <i style={{ width: `${(item.count / maxBureauCount) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {detail && (
        <div className="modal-back" onClick={() => setDetail(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <header className="modal-head">
              <div>
                <p className="eyebrow">Complaint record</p>
                <h3>{detail.id}</h3>
              </div>
              <button className="ghost-btn" type="button" onClick={() => setDetail(null)}>
                Close
              </button>
            </header>
            <dl className="detail-grid">
              <div>
                <dt>Institution</dt>
                <dd>{detail.institution}</dd>
              </div>
              <div>
                <dt>Permanent ID</dt>
                <dd>{detail.institutionId}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{detail.category}</dd>
              </div>
              <div>
                <dt>Bureau / Cell</dt>
                <dd>{detail.bureau}</dd>
              </div>
              <div>
                <dt>Officer</dt>
                <dd>{detail.officer}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{detail.status}</dd>
              </div>
            </dl>
            <p className="case-desc">{detail.description}</p>
            <button type="button" className="text-btn" onClick={() => go('complaints')}>
              Open complaint register
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ActivityChart() {
  const width = 660
  const height = 220
  const padding = { top: 14, right: 14, bottom: 28, left: 34 }
  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom
  const maxValue = Math.ceil(Math.max(...monthlyVolume.map((item) => item.received)) / 10) * 10
  const x = (index) => padding.left + (index / (monthlyVolume.length - 1)) * innerWidth
  const y = (value) => padding.top + innerHeight - (value / maxValue) * innerHeight
  const line = monthlyVolume
    .map((item, index) => `${index === 0 ? 'M' : 'L'}${x(index)} ${y(item.received)}`)
    .join(' ')
  const area = `${line} L${x(monthlyVolume.length - 1)} ${padding.top + innerHeight} L${x(0)} ${padding.top + innerHeight} Z`

  return (
    <svg
      className="activity-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Monthly received complaint totals"
    >
      <defs>
        <linearGradient id="activity-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b7a4e0" stopOpacity=".24" />
          <stop offset="100%" stopColor="#b7a4e0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((step) => {
        const value = (maxValue / 3) * step
        const yPos = y(value)
        return (
          <g key={step}>
            <line
              className="activity-gridline"
              x1={padding.left}
              y1={yPos}
              x2={width - padding.right}
              y2={yPos}
            />
            <text className="activity-axis-label" x={padding.left - 8} y={yPos + 3} textAnchor="end">
              {Math.round(value)}
            </text>
          </g>
        )
      })}
      <path d={area} fill="url(#activity-area)" />
      <path className="activity-line" pathLength="1" d={line} />
      {monthlyVolume.map((item, index) => (
        <text
          className="activity-axis-label"
          key={item.label}
          x={x(index)}
          y={height - 5}
          textAnchor="middle"
        >
          {item.label}
        </text>
      ))}
      {monthlyVolume.map((item, index) => (
        <circle
          className="activity-point"
          key={`${item.label}-point`}
          cx={x(index)}
          cy={y(item.received)}
          r="3"
        />
      ))}
    </svg>
  )
}

function ResolutionGauge({ value }) {
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const dash = (value / 100) * circumference

  return (
    <div className="resolution-gauge">
      <svg viewBox="0 0 144 144" role="img" aria-label={`${value}% of complaints disposed`}>
        <circle className="gauge-track" cx="72" cy="72" r={radius} />
        <circle
          className="gauge-value"
          cx="72"
          cy="72"
          r={radius}
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform="rotate(-90 72 72)"
        />
      </svg>
      <div className="gauge-copy">
        <strong>{value}%</strong>
        <span>Disposed</span>
      </div>
    </div>
  )
}
