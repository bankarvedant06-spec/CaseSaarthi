import { useMemo, useState } from 'react'
import { useApp } from '../AppContext'
import { StatusBadge } from '../components/StatusBadge'

export default function Institutions() {
  const { complaints, search, institutions } = useApp()
  const [active, setActive] = useState(null)

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return institutions
      .map((inst) => ({
        ...inst,
        count: complaints.filter((c) => c.institutionId === inst.id).length,
      }))
      .filter((i) => !q || `${i.name} ${i.id} ${i.state}`.toLowerCase().includes(q))
  }, [complaints, search, institutions])

  const profile = institutions.find((i) => i.id === active)
  const history = complaints.filter((c) => c.institutionId === active)

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Case management</p>
          <h1>Institutions</h1>
          <p>Search by name or Permanent ID and inspect associated complaint history.</p>
        </div>
      </header>

      <section className="panel table-panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Permanent ID</th>
                <th>Institution</th>
                <th>Type</th>
                <th>State</th>
                <th>Complaints</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} onClick={() => setActive(row.id)} className={active === row.id ? 'is-selected' : ''}>
                  <td>
                    <button type="button" className="linkish">
                      {row.id}
                    </button>
                  </td>
                  <td>{row.name}</td>
                  <td>{row.type}</td>
                  <td>{row.state}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {profile && (
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Institution profile</p>
              <h3>{profile.name}</h3>
            </div>
            <span className="chip">{profile.id}</span>
          </div>
          <p className="muted">
            {profile.type} · {profile.state} · {history.length} linked complaint{history.length === 1 ? '' : 's'}
          </p>
          <ul className="history-list">
            {history.map((c) => (
              <li key={c.id}>
                <strong>{c.id}</strong>
                <span>{c.category}</span>
                <span>{c.bureau}</span>
                <StatusBadge status={c.status} />
              </li>
            ))}
            {history.length === 0 && <li className="muted">No simulated complaints are linked to this institution.</li>}
          </ul>
        </section>
      )}
    </div>
  )
}
