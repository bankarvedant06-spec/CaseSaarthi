import CoordinationAlerts from '../components/CoordinationAlerts'

export default function CoordinationRadar() {
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Case management</p>
          <h1>Coordination Radar</h1>
          <p>
            Review possible overlaps across Bureaus and Cells. These signals support coordination;
            they are not confirmed duplicates and do not change case status.
          </p>
        </div>
      </header>
      <CoordinationAlerts />
    </div>
  )
}
