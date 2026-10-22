import { useApp } from '../AppContext'
import { StatusBadge } from './StatusBadge'

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function RecentComplaints({ rows, onOpen, compact = false, className = '' }) {
  const { go } = useApp()

  if (compact) {
    return (
      <section className={`panel table-panel recent-compact ${className}`}>
        <div className="panel-head">
          <div>
            <p className="eyebrow">Live caseload</p>
            <h3>Recent Complaints</h3>
          </div>
          <button type="button" className="text-btn" onClick={() => go('complaints')}>
            View all
          </button>
        </div>
        <div className="recent-compact-list">
          {rows.length === 0 && <p className="empty">No records match the current filters.</p>}
          {rows.map((row) => (
            <button
              className="recent-compact-row"
              key={row.id}
              type="button"
              onClick={() => onOpen?.(row)}
            >
              <span className="recent-compact-copy">
                <strong>{row.id}</strong>
                <span>{row.institution}</span>
              </span>
              <StatusBadge status={row.status} />
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className={`panel table-panel ${className}`}>
      <div className="panel-head">
        <div>
          <p className="eyebrow">Live caseload</p>
          <h3>Recent complaints</h3>
        </div>
        <button type="button" className="ghost-btn" onClick={() => go('complaints')}>
          All
        </button>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Institution</th>
              <th>Complaint Category</th>
              <th>Bureau</th>
              <th>Assigned Officer</th>
              <th>Date Received</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">
                  No records match the current filters.
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={row.id} onClick={() => onOpen?.(row)}>
                <td>
                  <span className="idx">#{String(i + 1).padStart(2, '0')}</span>
                  <button type="button" className="linkish">
                    {row.id}
                  </button>
                </td>
                <td>{row.institution}</td>
                <td>{row.category}</td>
                <td>{row.bureau}</td>
                <td>{row.officer}</td>
                <td>{formatDate(row.received)}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
