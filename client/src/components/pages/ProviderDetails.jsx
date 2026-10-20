import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiMapPin, FiClock, FiCheckCircle } from 'react-icons/fi'
import api, { getErrorMessage, rupees } from '../../api/api.js'
import { Badge, ErrorState, Spinner } from '../common/ui.jsx'

const field = 'mt-1 min-h-12 w-full rounded-xl border border-line bg-white px-3 text-base'
const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function ProviderDetails() {
  const { id } = useParams()
  const [provider, setProvider] = useState(null)
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ patientName: '', phone: '', city: '', locality: '', pincode: '', visitType: '', preferredDate: '', preferredTime: 'flexible', note: '' })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(null)
  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))

  async function load() {
    setState('loading')
    try {
      const { data } = await api.get(`/providers/${id}`)
      const p = data.data
      setProvider(p)
      setForm((s) => ({ ...s, city: p.city, visitType: p.visitTypes?.[0] || '' }))
      setState('ready')
    } catch (err) {
      setError(getErrorMessage(err)); setState('error')
    }
  }
  useEffect(() => { load() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id])

  async function submit(e) {
    e.preventDefault()
    setSending(true)
    try {
      const { data } = await api.post('/appointment-requests', { providerId: id, ...form })
      setDone(data.data)
      toast.success('Request sent')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally { setSending(false) }
  }

  if (state === 'loading') return <div className="mx-auto max-w-3xl px-4 py-10"><Spinner label="Loading profile..." /></div>
  if (state === 'error') return <div className="mx-auto max-w-3xl px-4 py-10"><ErrorState message={error} onRetry={load} /></div>

  const p = provider
  const planner = `/planner?${new URLSearchParams({ ...(p.fees?.home ? { homeFee: p.fees.home } : {}), ...(p.fees?.centre ? { centreFee: p.fees.centre } : {}) })}`

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_420px]">
      <section>
        <Link to="/find" className="text-sm font-semibold text-teal-dark">&larr; Back to results</Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold md:text-3xl">{p.name}</h1>
          {p.isSample && <Badge tone="amber">Sample data</Badge>}
        </div>
        <p className="mt-1 flex items-center gap-1 text-soft"><FiMapPin aria-hidden /> {[p.locality, p.city].filter(Boolean).join(', ')}</p>

        <div className="mt-4 flex flex-wrap gap-1">
          {p.visitTypes?.includes('home') && <Badge tone="grey">Home visit</Badge>}
          {p.visitTypes?.includes('centre') && <Badge tone="grey">Centre visit</Badge>}
          {p.serviceRadiusKm ? <Badge tone="grey">Service radius {p.serviceRadiusKm} km</Badge> : null}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 rounded-2xl border border-line bg-white p-5">
          {typeof p.fees?.home === 'number' && <div><dt className="text-sm text-soft">Home visit fee</dt><dd className="text-xl font-bold">{rupees(p.fees.home)}</dd></div>}
          {typeof p.fees?.centre === 'number' && <div><dt className="text-sm text-soft">Centre fee</dt><dd className="text-xl font-bold">{rupees(p.fees.centre)}</dd></div>}
        </dl>

        <div className="mt-5 space-y-3 text-sm">
          {p.qualifications?.length > 0 && <p><b>Qualifications</b> (as supplied, not verified by Physio Sathi): {p.qualifications.join(', ')}</p>}
          {p.services?.length > 0 && <p><b>Services:</b> {p.services.join(', ')}</p>}
          {p.serviceAreas?.length > 0 && <p><b>Areas served:</b> {p.serviceAreas.join(', ')}</p>}
          {p.availabilitySlots?.length > 0 && <p className="flex items-center gap-1"><FiClock aria-hidden /> <b>Availability (as listed):</b> {p.availabilitySlots.join(', ')}</p>}
        </div>

        <Link to={planner} className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-line bg-white px-4 text-sm font-semibold hover:border-teal">
          Plan costs with this physio&apos;s fees
        </Link>
      </section>

      <section className="h-fit rounded-2xl border border-line bg-white p-5 shadow-sm" aria-labelledby="enq">
        {done ? (
          <div role="status">
            <FiCheckCircle className="text-3xl text-teal" aria-hidden />
            <h2 className="mt-2 text-lg font-bold">Request sent to {done.providerName}</h2>
            <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              <b>This is not a confirmed appointment.</b> It is only confirmed after the physio accepts it.
            </p>
            <p className="mt-3 text-xs text-soft">Reference: {String(done.id).slice(-8)}</p>
            <Link to="/find" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-navy px-5 text-sm font-semibold text-white">Back to physios</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <h2 id="enq" className="text-lg font-bold">Send an appointment request</h2>
            <p className="text-xs text-soft">Do not enter any medical details. The physio will contact you to confirm.</p>
            <label className="block text-sm font-medium">Your name
              <input required value={form.patientName} onChange={set('patientName')} className={field} maxLength={80} autoComplete="name" />
            </label>
            <label className="block text-sm font-medium">Mobile number
              <input required value={form.phone} onChange={set('phone')} className={field} inputMode="tel" placeholder="10-digit number" autoComplete="tel" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">Locality
                <input value={form.locality} onChange={set('locality')} className={field} maxLength={60} />
              </label>
              <label className="block text-sm font-medium">Pincode
                <input value={form.pincode} onChange={set('pincode')} className={field} inputMode="numeric" maxLength={6} />
              </label>
            </div>
            <label className="block text-sm font-medium">Visit type
              <select value={form.visitType} onChange={set('visitType')} className={field}>
                {p.visitTypes.map((v) => <option key={v} value={v}>{v === 'home' ? 'Home visit' : 'Centre visit'}</option>)}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">Preferred date
                <input required type="date" min={today()} value={form.preferredDate} onChange={set('preferredDate')} className={field} />
              </label>
              <label className="block text-sm font-medium">Time
                <select value={form.preferredTime} onChange={set('preferredTime')} className={field}>
                  <option value="flexible">Flexible</option><option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option><option value="evening">Evening</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium">Note (optional)
              <textarea value={form.note} onChange={set('note')} maxLength={200} rows={2} className={`${field} py-2`} placeholder="Anything the physio should know about timing" />
            </label>
            <button type="submit" disabled={sending} className="min-h-12 w-full rounded-xl bg-navy font-semibold text-white disabled:opacity-60">
              {sending ? 'Sending...' : 'Send request'}
            </button>
            <p className="text-xs text-soft">A request is not a confirmed appointment until the physio accepts it.</p>
          </form>
        )}
      </section>
    </div>
  )
}
