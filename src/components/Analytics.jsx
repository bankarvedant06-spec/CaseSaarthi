import { bureaus, monthlyVolume } from '../data/mockData'
import { useApp } from '../AppContext'

export default function Analytics({ complaints }) {
  const { stats } = useApp()
  const source = complaints || []

  const bureauCounts = bureaus.map((name) => ({
    name,
    count: source.filter((c) => c.bureau === name).length,
  }))
  const maxBureau = Math.max(...bureauCounts.map((b) => b.count), 1)

  const status = [
    { label: 'Pending', value: stats.pending, color: '#c4a574' },
    { label: 'Under Process', value: stats.underProcess, color: '#b7a4e0' },
    { label: 'Disposed', value: stats.disposed, color: '#7dcea0' },
  ]
  const totalStatus = status.reduce((s, x) => s + x.value, 0) || 1

  return (
    <section className="analytics-grid">
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Case volume</p>
            <h3>Complaint volume over time</h3>
          </div>
          <span className="chip">Received · disposed</span>
        </div>
        <VolumeChart />
      </article>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Workload</p>
            <h3>Distribution by Bureau / Cell</h3>
          </div>
        </div>
        <ul className="bar-list">
          {bureauCounts.map((b) => (
            <li key={b.name}>
              <div className="bar-meta">
                <span>{b.name}</span>
                <strong>{b.count}</strong>
              </div>
              <div className="bar-track">
                <i style={{ width: `${(b.count / maxBureau) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Status mix</p>
            <h3>Complaint status distribution</h3>
          </div>
        </div>
        <div className="donut-row">
          <Donut parts={status} total={totalStatus} />
          <ul className="legend">
            {status.map((s) => (
              <li key={s.label}>
                <i style={{ background: s.color }} />
                <span>{s.label}</span>
                <strong>
                  {s.value}
                  <em>{Math.round((s.value / totalStatus) * 100)}%</em>
                </strong>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  )
}

function VolumeChart() {
  const w = 640
  const h = 180
  const pad = { t: 16, r: 8, b: 28, l: 8 }
  const innerW = w - pad.l - pad.r
  const innerH = h - pad.t - pad.b
  const max = Math.max(...monthlyVolume.flatMap((d) => [d.received, d.disposed]))
  const x = (i) => pad.l + (i / (monthlyVolume.length - 1)) * innerW
  const y = (v) => pad.t + innerH - (v / max) * innerH

  const received = monthlyVolume
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(d.received)}`)
    .join(' ')
  const receivedArea = `${received} L${x(monthlyVolume.length - 1)} ${pad.t + innerH} L${x(0)} ${pad.t + innerH} Z`
  const disposed = monthlyVolume
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(d.disposed)}`)
    .join(' ')

  return (
    <svg className="volume-chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Monthly received and disposed complaints">
      {monthlyVolume.map((d, i) => (
        <text key={d.label} x={x(i)} y={h - 6} textAnchor="middle" fill="#7d758c" fontSize="10">
          {d.label}
        </text>
      ))}
      <path d={receivedArea} fill="rgba(167,146,214,0.14)" />
      <path className="chart-line" pathLength="1" d={received} fill="none" stroke="#b7a4e0" strokeWidth="1.8" />
      <path className="chart-line-muted" d={disposed} fill="none" stroke="#8f8a9a" strokeWidth="1.4" strokeDasharray="4 4" />
    </svg>
  )
}

function Donut({ parts, total }) {
  const r = 42
  const c = 2 * Math.PI * r
  const slices = parts.reduce((acc, p) => {
    const len = (p.value / total) * c
    const start = acc.length ? acc[acc.length - 1].end : 0
    acc.push({ ...p, len, start, end: start + len })
    return acc
  }, [])
  return (
    <svg className="donut" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#1b1a24" strokeWidth="12" />
      {slices.map((p) => (
          <circle
            key={p.label}
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={p.color}
            strokeWidth="12"
            strokeDasharray={`${p.len} ${c - p.len}`}
            strokeDashoffset={-p.start}
            strokeLinecap="butt"
            transform="rotate(-90 60 60)"
          />
      ))}
      <text x="60" y="56" textAnchor="middle" fill="#f3eefc" fontSize="16" fontWeight="600">
        {total}
      </text>
      <text x="60" y="72" textAnchor="middle" fill="#8b8496" fontSize="9">
        cases
      </text>
    </svg>
  )
}
