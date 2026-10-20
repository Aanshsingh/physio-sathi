import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSend } from 'react-icons/fi'
import api, { getErrorMessage, rupees } from '../../api/api.js'
import { Badge } from '../common/ui.jsx'
import { InternalCard, ExternalCard } from '../common/EquipmentCards.jsx'

const SUGGESTIONS = [
  'I need a home visit physio in Faridabad Sector 15, budget Rs. 700 per session',
  'Looking for a walker on rent in Faridabad',
  'Centre visit physio in Delhi, evening, budget Rs. 700',
]

function Understood({ r }) {
  const chips = [r.city, r.locality, r.pincode, r.visitType && `${r.visitType} visit`, r.budget && `Budget ${rupees(r.budget)}`,
    r.equipment && `${r.equipment} (${r.equipmentMode || 'rent'})`, r.schedule].filter(Boolean)
  if (!chips.length) return null
  return (
    <div className="mt-2 flex flex-wrap gap-1" aria-label="What I understood">
      {chips.map((c) => <Badge key={c} tone="teal">{c}</Badge>)}
    </div>
  )
}

function MiniProvider({ result }) {
  const p = result.provider
  const fees = [p.fees?.home && `Home ${rupees(p.fees.home)}`, p.fees?.centre && `Centre ${rupees(p.fees.centre)}`].filter(Boolean).join(' | ')
  return (
    <article className="rounded-xl border border-line bg-white p-3">
      <div className="flex flex-wrap items-center gap-1">
        <h4 className="font-bold">{p.name}</h4>
        {p.isSample && <Badge tone="amber">Sample data</Badge>}
      </div>
      <p className="text-sm text-soft">{[p.locality, p.city].filter(Boolean).join(', ')} &middot; {fees}</p>
      <p className="mt-1 text-xs text-teal-dark">Why: {result.reasons.join('. ')}</p>
      <Link to={`/providers/${p._id}`} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-teal-dark underline">View profile and send request</Link>
    </article>
  )
}

function AssistantExtras({ data }) {
  const eq = data.equipment
  return (
    <div className="mt-3 space-y-4">
      {data.providers.length > 0 && (
        <div>
          <p className="text-sm font-bold">Nearby physios</p>
          <div className="mt-2 space-y-2">{data.providers.map((r) => <MiniProvider key={r.provider._id} result={r} />)}</div>
          <Link to="/find" className="mt-2 inline-block text-sm font-semibold text-teal-dark underline">See all matches and filters</Link>
        </div>
      )}
      {eq && (
        <div>
          <p className="text-sm font-bold">Equipment: {eq.mode}</p>
          {eq.internal.length > 0 && <div className="mt-2 space-y-2">{eq.internal.map((i) => <InternalCard key={i._id} item={i} />)}</div>}
          {eq.externalError ? (
            <p className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">{eq.externalError}</p>
          ) : eq.external.length > 0 ? (
            <div className="mt-2 space-y-2">{eq.external.map((i) => <ExternalCard key={i.sourceUrl} item={i} />)}</div>
          ) : (
            <p className="mt-2 text-sm text-soft">No web results found.</p>
          )}
          <Link to="/planner" className="mt-2 inline-block text-sm font-semibold text-teal-dark underline">Compare rent vs buy in the cost planner</Link>
        </div>
      )}
    </div>
  )
}

export default function Assistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi, I am AI Sathi. Tell me your city, whether you want a home or centre visit, your budget, and any equipment you need. I cannot diagnose or prescribe.' },
  ])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [ctx, setCtx] = useState({})
  const bottom = useRef(null)

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages, loading])

  async function send(raw) {
    const message = (raw ?? text).trim()
    if (message.length < 2 || loading) return
    setText('')
    setMessages((m) => [...m, { role: 'user', text: message }])
    setLoading(true)
    try {
      const { data } = await api.post('/ai/assistant', { message, context: ctx })
      setCtx(data.data.requirements)
      setMessages((m) => [...m, { role: 'assistant', text: data.data.reply, data: data.data }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: getErrorMessage(err), error: true }])
    } finally { setLoading(false) }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-6" style={{ minHeight: 'calc(100vh - 9rem)' }}>
      <h1 className="text-2xl font-bold">AI Sathi</h1>
      <p className="text-sm text-soft">Describe what you need in your own words. I find nearby physios and equipment for you.</p>

      <div className="mt-4 flex-1 space-y-4" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-navy text-white' : m.error ? 'border border-red-200 bg-red-50 text-red-900' : 'border border-line bg-white'}`}>
              <p>{m.text}</p>
              {m.data && <Understood r={m.data.requirements} />}
              {m.data && <AssistantExtras data={m.data} />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-soft" role="status">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-teal" />
            Looking for physios and equipment. Web search can take up to 30 seconds...
          </div>
        )}
        <div ref={bottom} />
      </div>

      {messages.length === 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} className="min-h-11 rounded-full border border-line bg-white px-4 text-left text-sm hover:border-teal">{s}</button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send() }} className="sticky bottom-20 mt-4 flex gap-2 bg-page pb-2 pt-2 md:bottom-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. home physio in Faridabad, budget Rs. 700"
          className="min-h-12 flex-1 rounded-xl border border-line bg-white px-3 text-base"
          aria-label="Message to AI Sathi"
          maxLength={500}
        />
        <button type="submit" disabled={loading} className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-xl bg-navy px-4 text-white disabled:opacity-60" aria-label="Send">
          <FiSend aria-hidden />
        </button>
      </form>
      <p className="text-xs text-soft">AI Sathi cannot diagnose or prescribe. A qualified physiotherapist should make clinical decisions. Web results are not verified.</p>
    </div>
  )
}
