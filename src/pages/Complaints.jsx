import { useMemo, useState } from 'react'
import { bureaus, categories } from '../data/mockData'
import { useApp } from '../AppContext'
import { StatusBadge } from '../components/StatusBadge'

const officers = ['Kavita Rao', 'Arjun Mehta', 'Priya Nair', 'S. Iyer', 'Rohan Desai', 'Meera Joshi']
const statuses = ['Pending', 'Under Process', 'Disposed']

function createEmptyForm(institutionList) {
  return {
    institutionId: institutionList[0]?.id || '',
    category: categories[0],
    bureau: bureaus[0],
    officer: officers[0],
    received: '2026-10-21',
    expected: '2026-11-21',
    status: 'Pending',
    description: '',
  }
}

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function Complaints() {
  const { complaints, addComplaint, updateComplaint, search, institutions } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(() => createEmptyForm(institutions))
  const [created, setCreated] = useState(null)
  const [selected, setSelected] = useState(null)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [updating, setUpdating] = useState(false)

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return complaints.filter(
      (c) =>
        !q ||
        [c.id, c.institution, c.category, c.bureau, c.officer, c.status].join(' ').toLowerCase().includes(q),
    )
  }, [complaints, search])

  const updateSelectedComplaint = async (patch) => {
    setUpdateError('')
    setUpdating(true)
    try {
      const updated = await updateComplaint(selected.id, patch)
      setSelected(updated)
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Could not update the complaint. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const inst = institutions.find((i) => i.id === form.institutionId)
    if (!inst) {
      setSubmitError('No institution records are available. Add the institution to Supabase before creating a complaint.')
      return
    }

    setSubmitting(true)
    try {
      const record = await addComplaint({
        ...form,
        institution: inst.name,
      })
      setCreated(record.id)
      setOpen(false)
      setForm(createEmptyForm(institutions))
      setSelected(record)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not save the complaint. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Case management</p>
          <h1>Complaints</h1>
          <p>Register, assign and update institution-related complaint records.</p>
        </div>
        <button type="button" className="solid-btn" onClick={() => {
          setSubmitError('')
          setOpen(true)
        }}>
          Register complaint
        </button>
      </header>
      {created && <p className="banner">New case ID generated: {created}</p>}

      <section className="panel table-panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Institution</th>
                <th>Category</th>
                <th>Bureau</th>
                <th>Officer</th>
                <th>Received</th>
                <th>Expected</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} onClick={() => setSelected(row)}>
                  <td>
                    <button type="button" className="linkish">
                      {row.id}
                    </button>
                  </td>
                  <td>{row.institution}</td>
                  <td>{row.category}</td>
                  <td>{row.bureau}</td>
                  <td>{row.officer}</td>
                  <td>{formatDate(row.received)}</td>
                  <td>{formatDate(row.expected)}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <section className="panel detail-panel">
          <div className="panel-head">
            <h3>{selected.id}</h3>
            <div className="detail-controls">
              <label className="inline-label">
                Bureau / Cell
                <select
                  value={selected.bureau}
                  disabled={updating}
                  onChange={(e) => void updateSelectedComplaint({ bureau: e.target.value })}
                >
                  {bureaus.map((bureau) => (
                    <option key={bureau}>{bureau}</option>
                  ))}
                </select>
              </label>
              <label className="inline-label">
                Update status
                <select
                  value={selected.status}
                  disabled={updating}
                  onChange={(e) => void updateSelectedComplaint({ status: e.target.value })}
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          {updating && <p className="muted" role="status">Saving complaint changes…</p>}
          {updateError && <p className="form-error" role="alert">{updateError}</p>}
          <p className="case-desc">{selected.description}</p>
          <p className="muted">
            {selected.institution} · PID {selected.institutionId} · {selected.bureau} · {selected.officer}
          </p>
        </section>
      )}

      {open && (
        <div className="modal-back" onClick={() => setOpen(false)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <header className="modal-head">
              <div>
                <p className="eyebrow">New record</p>
                <h3>Register complaint</h3>
              </div>
              <button type="button" className="ghost-btn" onClick={() => setOpen(false)}>
                Close
              </button>
            </header>
            <div className="form-grid">
              {institutions.length === 0 && (
                <p className="form-error full" role="alert">
                  No institutions are available in Supabase. Add institution records before registering complaints.
                </p>
              )}
              <label>
                Institution
                <select
                  value={form.institutionId}
                  onChange={(e) => setForm({ ...form, institutionId: e.target.value })}
                >
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.id})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Bureau / Cell
                <select value={form.bureau} onChange={(e) => setForm({ ...form, bureau: e.target.value })}>
                  {bureaus.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label>
                Assigned officer
                <select value={form.officer} onChange={(e) => setForm({ ...form, officer: e.target.value })}>
                  {officers.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label>
                Date received
                <input
                  type="date"
                  value={form.received}
                  onChange={(e) => setForm({ ...form, received: e.target.value })}
                />
              </label>
              <label>
                Expected disposal
                <input
                  type="date"
                  value={form.expected}
                  onChange={(e) => setForm({ ...form, expected: e.target.value })}
                />
              </label>
              <label className="full">
                Description
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Summarise the institution-related complaint…"
                />
              </label>
            </div>
            {submitError && <p className="form-error" role="alert">{submitError}</p>}
            <footer className="modal-actions">
              <button type="submit" className="solid-btn" disabled={submitting || institutions.length === 0}>
                {submitting ? 'Saving complaint…' : 'Generate case ID'}
              </button>
            </footer>
          </form>
        </div>
      )}
    </div>
  )
}
