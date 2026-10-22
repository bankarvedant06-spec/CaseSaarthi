import { useApp } from '../AppContext'

export default function StatStrip({ filter, onFilter }) {
  const { stats } = useApp()

  const items = [
    { key: 'all', label: 'Total Complaints', value: stats.total },
    { key: 'Pending', label: 'Pending', value: stats.pending },
    { key: 'Under Process', label: 'Under Process', value: stats.underProcess },
    { key: 'Disposed', label: 'Disposed', value: stats.disposed },
    { key: 'overlaps', label: 'Potential Overlaps', value: stats.overlaps },
  ]

  return (
    <section className="stat-strip" aria-label="Complaint overview">
      {items.map((item, i) => (
        <button
          key={item.key}
          type="button"
          className={`stat-cell ${filter === item.key ? 'is-on' : ''}`}
          onClick={() => onFilter(filter === item.key ? 'all' : item.key)}
        >
          {i > 0 && <i className="stat-rule" />}
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </button>
      ))}
    </section>
  )
}

export function Sparkline({ values, color }) {
  const w = 220
  const h = 78
  const max = Math.max(...values)
  const min = Math.min(...values)
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 10) - 5
    return [x, y]
  })
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]} ${p[1]}`).join(' ')
  const area = `${line} L${w} ${h} L0 ${h} Z`
  const last = pts[pts.length - 1]

  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`g-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${color.replace('#', '')})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
    </svg>
  )
}
