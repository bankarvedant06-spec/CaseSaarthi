export function StatusBadge({ status }) {
  const key = status.toLowerCase().replace(/\s+/g, '-')
  return <span className={`status-badge status-${key}`}>{status}</span>
}

export function ReviewBadge({ review }) {
  if (!review) return <span className="status-badge status-pending">Awaiting review</span>
  if (review === 'related') return <span className="status-badge status-under-process">Related</span>
  return <span className="status-badge status-disposed">Independent</span>
}
