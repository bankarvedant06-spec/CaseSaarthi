import { overlapAlerts } from '../data/mockData'
import { useApp } from '../AppContext'
import { ReviewBadge } from './StatusBadge'

export default function CoordinationAlerts({ compact = false, className = '' }) {
  const { setInspectId, overlapReviews, go } = useApp()
  const rows = compact ? overlapAlerts.slice(0, 2) : overlapAlerts

  return (
    <section className={`panel radar-panel ${compact ? 'radar-compact' : ''} ${className}`}>
      <div className="panel-head">
        <div>
          <p className="eyebrow">Human review</p>
          <h3>Coordination Radar</h3>
        </div>
        {compact && (
          <button type="button" className="ghost-btn" onClick={() => go('radar')}>
            Open radar
          </button>
        )}
      </div>
      <p className="panel-note">
        Potential overlaps are alerts for officer review. Cases are not merged or closed automatically.
      </p>
      <div className="alert-list">
        {rows.map((alert) => (
          <article key={alert.id} className="alert-card">
            <header>
              <strong>{alert.id}</strong>
              <ReviewBadge review={overlapReviews[alert.id]} />
            </header>
            <p className="alert-cases">
              {alert.cases.join('  ·  ')}
            </p>
            {compact ? (
              <p className="alert-compact-institution">{alert.institution}</p>
            ) : (
              <>
                <dl>
                  <div>
                    <dt>Institution</dt>
                    <dd>{alert.institution}</dd>
                  </div>
                  <div>
                    <dt>Categories</dt>
                    <dd>{alert.categories.join(', ')}</dd>
                  </div>
                  <div>
                    <dt>Bureaus</dt>
                    <dd>{alert.bureaus.join(', ')}</dd>
                  </div>
                </dl>
                <p className="alert-reason">{alert.reason}</p>
              </>
            )}
            <button type="button" className="text-btn" onClick={() => setInspectId(alert.id)}>
              Inspect cases
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
