import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api, { getErrorMessage, rupees } from '../../api/api.js'
import { Badge, ErrorState, Spinner } from '../common/ui.jsx'

const input = 'mt-1 min-h-12 w-full rounded-xl border border-line bg-white px-3 text-base'

function Num({ label, hint, value, onChange }) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input value={value} onChange={onChange} inputMode="numeric" placeholder="optional" className={input} />
      {hint && <span className="mt-0.5 block text-xs font-normal text-soft">{hint}</span>}
    </label>
  )
}

function OptionCard({ o, lowest }) {
  return (
    <article className={`rounded-2xl border bg-white p-4 shadow-sm ${lowest ? 'border-teal ring-1 ring-teal' : 'border-line'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold">{o.label}</h3>
        {lowest && <Badge tone="teal">Lowest estimate in this group</Badge>}
      </div>
      {o.complete ? (
        <>
          <p className="mt-2 text-2xl font-extrabold">{rupees(o.total)}</p>
          <ul className="mt-2 space-y-0.5 text-sm text-soft">
            {o.breakdown.map((b) => <li key={b.label}>{b.label} = {rupees(b.amount)}</li>)}
          </ul>
        </>
      ) : (
        <p className="mt-2 text-sm text-soft">Not enough information. Missing: <b className="text-navy">{o.missing.join(', ')}</b></p>
      )}
      <p className="mt-3 text-xs text-soft"><b>Formula:</b> {o.formula}</p>
      {o.assumptions.map((a) => <p key={a} className="mt-1 text-xs text-amber-800">Assumption: {a}</p>)}
    </article>
  )
}

export default function Planner() {
  const [params] = useSearchParams()
  const [f, setF] = useState({
    sessions: '10', homeFee: params.get('homeFee') || '', homeTravelPerVisit: '', centreFee: params.get('centreFee') || '',
    centreTravelPerVisit: '', rentalRatePerDay: '', rentalDays: '', rentalExtra: '', purchasePrice: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  async function calculate(e) {
    e.preventDefault()
    const payload = {}
    for (const [k, v] of Object.entries(f)) if (v !== '') payload[k] = Number(v)
    if (!payload.sessions || payload.sessions < 1) { toast.error('Enter the number of sessions (1 or more)'); return }
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/costs/compare', payload)
      setResult(data.data)
    } catch (err) {
      setError(getErrorMessage(err)); setResult(null)
    } finally { setLoading(false) }
  }

  const care = result?.options.filter((o) => o.group === 'care') || []
  const equip = result?.options.filter((o) => o.group === 'equipment') || []

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold md:text-3xl">Smart recovery cost planner</h1>
      <p className="mt-1 text-soft">Enter what you know. Leave a box empty if you do not know it, and we will tell you what is missing.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={calculate} className="space-y-5 rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-bold">Care visits</h2>
            <div className="mt-2 grid gap-3">
              <label className="text-sm font-medium">Number of sessions
                <input value={f.sessions} onChange={set('sessions')} inputMode="numeric" className={input} />
              </label>
              <Num label="Home visit fee per session (Rs.)" value={f.homeFee} onChange={set('homeFee')} />
              <Num label="Travel charge per home visit (Rs.)" hint="Only if the physio lists one." value={f.homeTravelPerVisit} onChange={set('homeTravelPerVisit')} />
              <Num label="Centre fee per session (Rs.)" value={f.centreFee} onChange={set('centreFee')} />
              <Num label="Your own travel cost per centre visit (Rs.)" value={f.centreTravelPerVisit} onChange={set('centreTravelPerVisit')} />
            </div>
          </div>
          <div>
            <h2 className="font-bold">Equipment (optional)</h2>
            <div className="mt-2 grid gap-3">
              <Num label="Rental rate per day (Rs.)" value={f.rentalRatePerDay} onChange={set('rentalRatePerDay')} />
              <Num label="Rental duration (days)" value={f.rentalDays} onChange={set('rentalDays')} />
              <Num label="Other rental charges (Rs.)" hint="Deposit, delivery or similar, if listed." value={f.rentalExtra} onChange={set('rentalExtra')} />
              <Num label="Purchase price (Rs.)" value={f.purchasePrice} onChange={set('purchasePrice')} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="min-h-12 w-full rounded-xl bg-navy font-semibold text-white disabled:opacity-60">
            {loading ? 'Calculating...' : 'Compare costs'}
          </button>
        </form>

        <section aria-live="polite" className="space-y-6">
          {loading && <Spinner label="Calculating..." />}
          {error && <ErrorState message={error} />}
          {!loading && !error && !result && (
            <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-soft">Your comparison will appear here.</div>
          )}
          {result && !loading && (
            <>
              <div>
                <h2 className="text-lg font-bold">Care visits</h2>
                <div className="mt-3 grid gap-4 md:grid-cols-2">{care.map((o) => <OptionCard key={o.key} o={o} lowest={result.lowestCare === o.key} />)}</div>
              </div>
              <div>
                <h2 className="text-lg font-bold">Equipment: rent or buy</h2>
                <div className="mt-3 grid gap-4 md:grid-cols-2">{equip.map((o) => <OptionCard key={o.key} o={o} lowest={result.lowestEquipment === o.key} />)}</div>
                {result.breakEvenDays && (
                  <p className="mt-3 rounded-xl bg-mist p-3 text-sm">
                    At this daily rate, renting costs about the same as buying after <b>{result.breakEvenDays} days</b> (extra rental charges and resale value ignored).
                  </p>
                )}
              </div>
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                {result.notes.map((n) => <p key={n} className="mt-1 first:mt-0">{n}</p>)}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
