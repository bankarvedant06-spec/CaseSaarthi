import { monthlyVolume } from '../data/mockData'
import Analytics from '../components/Analytics'
import { useApp } from '../AppContext'

export default function Trends() {
  const { complaints } = useApp()
  const peak = monthlyVolume.reduce((a, b) => (b.received > a.received ? b : a))

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Trends</h1>
          <p>Month-wise intake against disposal using demonstration figures.</p>
        </div>
      </header>
      <p className="banner">
        Highest simulated intake: {peak.label} ({peak.received} complaints received).
      </p>
      <Analytics complaints={complaints} />
    </div>
  )
}
