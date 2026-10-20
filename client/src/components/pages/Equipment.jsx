import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiSearch } from 'react-icons/fi'
import api, { getErrorMessage } from '../../api/api.js'
import { InternalCard, ExternalCard } from "../common/EquipmentCards.jsx"
import { Spinner, EmptyState, ErrorState } from '../common/Feedback.jsx'

const MODES = [
  { key: 'buy', label: 'Buy' },
  { key: 'rent', label: 'Rent' },
  { key: 'used', label: 'Used' },
]

export default function Equipment() {
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [mode, setMode] = useState('rent')
  const [city, setCity] = useState('Faridabad')

  const [internal, setInternal] = useState({ state: 'idle', items: [], error: '' })
  const [external, setExternal] = useState({ state: 'idle', items: [], error: '' })

  async function run(nextMode = mode) {
    const query = q.trim()
    if (query.length < 2) {
      toast.error('Type at least 2 characters, for example "walker"')
      return
    }
    setInternal({ state: 'loading', items: [], error: '' })
    setExternal({ state: 'loading', items: [], error: '' })

    const [internalRes, externalRes] = await Promise.allSettled([
      api.get('/equipment', { params: { mode: nextMode, q: query, city } }),
      api.post('/equipment/search', { query, mode: nextMode, city }),
    ])

    if (internalRes.status === 'fulfilled') {
      setInternal({ state: 'done', items: internalRes.value.data.data.listings, error: '' })
    } else {
      setInternal({ state: 'error', items: [], error: getErrorMessage(internalRes.reason) })
    }
    if (externalRes.status === 'fulfilled') {
      setExternal({ state: 'done', items: externalRes.value.data.data.results, error: '' })
    } else {
      setExternal({ state: 'error', items: [], error: getErrorMessage(externalRes.reason) })
    }
  }

  const ran = useRef(false)
  useEffect(() => {
    if (!ran.current && q.trim().length >= 2) {
      ran.current = true
      run()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function changeMode(key) {
    setMode(key)
    if (internal.state !== 'idle') run(key)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold md:text-3xl">Rehab equipment</h1>
      <p className="mt-1 text-soft">Compare our listings with live results from the web. Ask a qualified physiotherapist which equipment suits you.</p>

      <div className="mt-6 inline-flex rounded-xl border border-line bg-white p-1" role="tablist">
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={mode === key}
            onClick={() => changeMode(key)}
            className={`min-h-11 rounded-lg px-5 text-sm font-semibold ${mode === key ? 'bg-navy text-white' : 'text-soft'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); run() }}
        className="mt-4 grid gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm md:grid-cols-[1fr_200px_auto]"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. hand pulley, walker, wheelchair"
          className="min-h-12 rounded-xl border border-line px-3 text-base"
          aria-label="Equipment to search"
          maxLength={100}
        />
        <select value={city} onChange={(e) => setCity(e.target.value)} className="min-h-12 rounded-xl border border-line bg-white px-3" aria-label="City">
          {['Faridabad', 'Delhi', 'Gurugram', 'Noida'].map((c) => <option key={c}>{c}</option>)}
        </select>
        <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy px-6 font-semibold text-white">
          <FiSearch aria-hidden /> Search
        </button>
      </form>

      {internal.state === 'idle' ? (
        <div className="mt-6"><EmptyState title="Search for equipment" text="We show our own listings and live web results side by side." /></div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section aria-labelledby="internal-h">
            <h2 id="internal-h" className="text-lg font-bold">Physio Sathi listings</h2>
            <p className="text-xs text-soft">Sample listings for the demo.</p>
            <div className="mt-3 space-y-4" aria-live="polite">
              {internal.state === 'loading' && <Spinner label="Loading our listings..." />}
              {internal.state === 'error' && <ErrorState message={internal.error} onRetry={() => run()} />}
              {internal.state === 'done' && internal.items.length === 0 && (
                <EmptyState title="No internal listings found" text="Check the web results, or try another search word." />
              )}
              {internal.state === 'done' && internal.items.map((i) => <InternalCard key={i._id} item={i} />)}
            </div>
          </section>

          <section aria-labelledby="external-h">
            <h2 id="external-h" className="text-lg font-bold">From the web (external)</h2>
            <p className="text-xs text-soft">Found with TinyFish search. Not verified for quality, safety or seller trust. Always check the source.</p>
            <div className="mt-3 space-y-4" aria-live="polite">
              {external.state === 'loading' && <Spinner label="Searching the web and reading pages (this can take 10-30 seconds)..." />}
              {external.state === 'error' && <ErrorState message={external.error} onRetry={() => run()} />}
              {external.state === 'done' && external.items.length === 0 && (
                <EmptyState title="No web results found" text="Try different words, for example the product's common name." />
              )}
              {external.state === 'done' && external.items.map((i) => <ExternalCard key={i.sourceUrl} item={i} />)}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
