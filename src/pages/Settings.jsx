import { officer } from '../data/mockData'

export default function Settings() {
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">System</p>
          <h1>Settings</h1>
          <p>Workspace preferences for this demonstration build.</p>
        </div>
      </header>
      <section className="panel settings-panel">
        <h3>Signed-in officer</h3>
        <p>
          {officer.name} · {officer.role}
        </p>
        <p className="muted">{officer.bureau}</p>
        <hr />
        <h3>Data notice</h3>
        <p>
          CaseSaarthi currently uses simulated records to demonstrate monitoring, assignment and
          coordination workflows. It is not connected to AICTE databases or official systems.
        </p>
      </section>
    </div>
  )
}
