import { useApp } from '../AppContext'
import Analytics from '../components/Analytics'

export default function Reports() {
  const { complaints, stats } = useApp()
  const multi = Object.values(
    complaints.reduce((acc, c) => {
      acc[c.institution] = (acc[c.institution] || 0) + 1
      return acc
    }, {}),
  ).filter((n) => n > 1).length

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Reports</h1>
          <p>Workload, status mix and bureau distribution from the simulated caseload.</p>
        </div>
      </header>
      <section className="report-kpis">
        <article>
          <span>Open workload</span>
          <strong>{stats.pending + stats.underProcess}</strong>
        </article>
        <article>
          <span>Disposal rate</span>
          <strong>{Math.round((stats.disposed / stats.total) * 100)}%</strong>
        </article>
        <article>
          <span>Institutions with multiple complaints</span>
          <strong>{multi}</strong>
        </article>
      </section>
      <Analytics complaints={complaints} />
    </div>
  )
}
