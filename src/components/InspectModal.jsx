import { overlapAlerts } from '../data/mockData'
import { useApp } from '../AppContext'
import { StatusBadge } from './StatusBadge'
import { IconClose } from './Icons'

export default function InspectModal() {
  const { inspectId, setInspectId, complaints, reviewOverlap, overlapReviews } = useApp()
  if (!inspectId) return null
  const alert = overlapAlerts.find((a) => a.id === inspectId)
  if (!alert) return null
  const cases = complaints.filter((c) => alert.cases.includes(c.id))
  const decision = overlapReviews[alert.id]

  return (
    <div className="modal-back" onClick={() => setInspectId(null)}>
      <div className="modal" role="dialog" aria-labelledby="inspect-title" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <div>
            <p className="eyebrow">Coordination review</p>
            <h3 id="inspect-title">{alert.id} · {alert.institution}</h3>
          </div>
          <button className="icon-btn" type="button" aria-label="Close" onClick={() => setInspectId(null)}>
            <IconClose size={16} />
          </button>
        </header>
        <p className="modal-lead">{alert.reason}</p>
        <div className="case-compare">
          {cases.map((c) => (
            <article key={c.id} className="case-sheet">
              <h4>{c.id}</h4>
              <p>{c.category}</p>
              <p>{c.bureau}</p>
              <p>{c.officer}</p>
              <StatusBadge status={c.status} />
              <p className="case-desc">{c.description}</p>
            </article>
          ))}
        </div>
        <footer className="modal-actions">
          <button
            type="button"
            className={`solid-btn ${decision === 'related' ? 'is-on' : ''}`}
            onClick={() => reviewOverlap(alert.id, 'related')}
          >
            Mark related
          </button>
          <button
            type="button"
            className={`ghost-btn ${decision === 'independent' ? 'is-on' : ''}`}
            onClick={() => reviewOverlap(alert.id, 'independent')}
          >
            Mark independent
          </button>
          <span className="hint">Recording a review does not merge or dispose either case.</span>
        </footer>
      </div>
    </div>
  )
}
