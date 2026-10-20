import { useState } from 'react'
import toast from 'react-hot-toast'
import api, { getErrorMessage } from '../../api/api.js'
import ProviderCard from '../common/ProviderCard.jsx'
import { Spinner, EmptyState, ErrorState } from '../common/ui.jsx'

const CITIES = ['Faridabad', 'Delhi', 'Gurugram', 'Noida']
const field = 'mt-1 min-h-12 w-full rounded-xl border border-line bg-white px-3 text-base'

export default function Find() {
  const [form, setForm] = useState({ city: 'Faridabad', locality: '', pincode: '', visitType: 'any', budget: '' })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [onlyAvailability, setOnlyAvailability] = useState(false)
  const [qualification, setQualification] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function search(e) {
    e?.preventDefault()
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      toast.error('Pincode must be 6 digits')
      return
    }
    if (form.budget !== '' && (Number.isNaN(Number(form.budget)) || Number(form.budget) < 0)) {
      toast.error('Budget must be a positive number')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/providers/match', {
        city: form.city,
        locality: form.locality.trim(),
        pincode: form.pincode.trim(),
        visitType: form.visitType,
        budget: form.budget === '' ? null : Number(form.budget),
      })
      setResults(data.data.results)
    } catch (err) {
      setError(getErrorMessage(err))
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const shown = (results || []).filter(
    (r) =>
      (!onlyAvailability || r.provider.availabilitySlots?.length > 0) &&
      (!qualification || r.provider.qualifications?.includes(qualification))
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold md:text-3xl">Find a physiotherapist near you</h1>
      <p className="mt-1 text-soft">Tell us your area and preferences. We do not need any diagnosis or medical details.</p>

      <form onSubmit={search} className="mt-6 grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm md:grid-cols-3">
        <label className="text-sm font-medium">City
          <select value={form.city} onChange={set('city')} className={field}>
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">Locality (optional)
          <input value={form.locality} onChange={set('locality')} placeholder="e.g. Sector 15" className={field} maxLength={60} />
        </label>
        <label className="text-sm font-medium">Pincode (optional)
          <input value={form.pincode} onChange={set('pincode')} placeholder="e.g. 121007" inputMode="numeric" maxLength={6} className={field} />
        </label>
        <label className="text-sm font-medium">Visit type
          <select value={form.visitType} onChange={set('visitType')} className={field}>
            <option value="any">Any</option>
            <option value="home">Home visit</option>
            <option value="centre">Centre visit</option>
          </select>
        </label>
        <label className="text-sm font-medium">Budget per session in Rs. (optional)
          <input value={form.budget} onChange={set('budget')} placeholder="e.g. 700" inputMode="numeric" className={field} />
        </label>
        <div className="flex items-end">
          <button type="submit" disabled={loading} className="min-h-12 w-full rounded-xl bg-navy px-6 font-semibold text-white disabled:opacity-60">
            {loading ? 'Searching...' : 'Find physios'}
          </button>
        </div>
      </form>

      <p className="mt-3 text-xs text-soft">Demo note: physios shown here are sample data for Faridabad, Delhi, Gurugram and Noida.</p>

      <section className="mt-6" aria-live="polite">
        {loading && <Spinner label="Finding nearby physios..." />}
        {!loading && error && <ErrorState message={error} onRetry={search} />}
        {!loading && !error && results === null && (
          <EmptyState title="Start your search" text="Choose your city and press Find physios." />
        )}
        {!loading && !error && results !== null && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold">{shown.length} physio{shown.length === 1 ? '' : 's'} found</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <label className="flex min-h-11 items-center gap-2">
                  <input type="checkbox" checked={onlyAvailability} onChange={(e) => setOnlyAvailability(e.target.checked)} className="h-4 w-4" />
                  Has listed availability
                </label>
                <label className="flex items-center gap-2">Qualification
                  <select value={qualification} onChange={(e) => setQualification(e.target.value)} className="min-h-11 rounded-lg border border-line bg-white px-2">
                    <option value="">Any</option>
                    <option value="BPT">BPT</option>
                    <option value="MPT">MPT</option>
                  </select>
                </label>
              </div>
            </div>
            {shown.length === 0 ? (
              <div className="mt-4"><EmptyState title="No physios match" text="Try a different locality, visit type or a higher budget." /></div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {shown.map((r) => <ProviderCard key={r.provider._id} result={r} />)}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
