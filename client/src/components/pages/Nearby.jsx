import { useEffect, useState } from 'react'
import { FiMapPin } from 'react-icons/fi'
import api, { getErrorMessage } from '../../api/api.js'
import { Badge, EmptyState, ErrorState, Spinner } from '../common/ui.jsx'

const field = 'mt-1 min-h-12 w-full rounded-xl border border-line bg-white px-3 text-base'
const timeLabel = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', flexible: 'Flexible' }

export default function Nearby() {
  const [base, setBase] = useState({ city: 'Faridabad', locality: '', pincode: '' })
  const [state, setState] = useState('loading')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const set = (k) => (e) => setBase((s) => ({ ...s, [k]: e.target.value }))

  async function load(e) {
    e?.preventDefault()
    setState('loading')
    try {
      const { data } = await api.get('/appointment-requests/nearby', { params: base })
      setItems(data.data.requests); setState('done')
    } catch (err) {
      setError(getErrorMessage(err)); setState('error')
    }
  }
  useEffect(() => { load() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold md:text-3xl">Nearby requests</h1>
        <Badge tone="amber">Demo view</Badge>
      </div>
      <p className="mt-1 text-soft">This shows how a physiotherapist could see patient requests close to their service area, so they travel less. A real physio login is on the roadmap.</p>
      <p className="mt-2 rounded-xl border border-line bg-white p-3 text-xs text-soft">Privacy: this view never shows patient names, phone numbers or notes.</p>

      <form onSubmit={load} className="mt-5 grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-4">
        <label className="text-sm font-medium">City
          <select value={base.city} onChange={set('city')} className={field}>
            {['Faridabad', 'Delhi', 'Gurugram', 'Noida'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">Your locality
          <input value={base.locality} onChange={set('locality')} className={field} placeholder="e.g. Sector 15" maxLength={60} />
        </label>
        <label className="text-sm font-medium">Your pincode
          <input value={base.pincode} onChange={set('pincode')} className={field} inputMode="numeric" maxLength={6} />
        </label>
        <div className="flex items-end"><button className="min-h-12 w-full rounded-xl bg-navy font-semibold text-white">Show requests</button></div>
      </form>

      <section className="mt-6 space-y-3" aria-live="polite">
        {state === 'loading' && <Spinner label="Loading requests..." />}
        {state === 'error' && <ErrorState message={error} onRetry={load} />}
        {state === 'done' && items.length === 0 && <EmptyState title="No pending requests yet" text="Send a request from a physio's profile page and it will show up here." />}
        {state === 'done' && items.map((r) => (
          <article key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
            <div>
              <p className="flex items-center gap-1 font-bold"><FiMapPin className="text-teal" aria-hidden /> {[r.locality, r.city].filter(Boolean).join(', ')}{r.pincode ? ` - ${r.pincode}` : ''}</p>
              <p className="mt-0.5 text-sm text-soft">
                {r.visitType === 'home' ? 'Home visit' : 'Centre visit'} &middot; {new Date(r.preferredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' })} &middot; {timeLabel[r.preferredTime]}
              </p>
            </div>
            <div className="flex gap-1"><Badge tone="teal">{r.closeness}</Badge><Badge tone="grey">{r.status}</Badge></div>
          </article>
        ))}
      </section>
    </div>
  )
}
