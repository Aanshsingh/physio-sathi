import { Link } from 'react-router-dom'
import { FiMapPin, FiHome, FiClock, FiCheck } from 'react-icons/fi'
import { Badge } from './ui.jsx'
import { rupees } from '../../api/api.js'

export default function ProviderCard({ result }) {
  const { provider: p, reasons = [], matchScore } = result
  const matchLabel = matchScore === 3 ? 'Pincode match' : matchScore === 2 ? 'Locality match' : 'Same city'

  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold">{p.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-soft">
            <FiMapPin aria-hidden /> {[p.locality, p.city].filter(Boolean).join(', ')}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {p.isSample && <Badge tone="amber">Sample data</Badge>}
          <Badge tone="teal">{matchLabel}</Badge>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {p.visitTypes?.includes('home') && <Badge tone="grey">Home visit</Badge>}
        {p.visitTypes?.includes('centre') && <Badge tone="grey">Centre visit</Badge>}
        {p.serviceRadiusKm ? <Badge tone="grey">Radius {p.serviceRadiusKm} km</Badge> : null}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        {typeof p.fees?.home === 'number' && (
          <div><dt className="text-soft">Home visit fee</dt><dd className="font-bold">{rupees(p.fees.home)}</dd></div>
        )}
        {typeof p.fees?.centre === 'number' && (
          <div><dt className="text-soft">Centre fee</dt><dd className="font-bold">{rupees(p.fees.centre)}</dd></div>
        )}
      </dl>

      {p.qualifications?.length > 0 && (
        <p className="mt-3 text-sm">
          <span className="text-soft">Qualifications (as supplied, not verified): </span>
          {p.qualifications.join(', ')}
        </p>
      )}
      {p.serviceAreas?.length > 0 && (
        <p className="mt-1 text-sm"><span className="text-soft">Areas served: </span>{p.serviceAreas.join(', ')}</p>
      )}
      {p.availabilitySlots?.length > 0 && (
        <p className="mt-1 flex items-center gap-1 text-sm"><FiClock aria-hidden className="text-soft" /> {p.availabilitySlots.join(', ')}</p>
      )}

      <div className="mt-4 rounded-xl bg-mist p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-dark">Why this result</p>
        <ul className="mt-1 space-y-0.5 text-sm">
          {reasons.map((r) => (
            <li key={r} className="flex items-start gap-1.5"><FiCheck className="mt-0.5 shrink-0 text-teal" aria-hidden /> {r}</li>
          ))}
        </ul>
      </div>

      <Link
        to={`/providers/${p._id}`}
        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-navy px-5 text-sm font-semibold text-white"
      >
        <FiHome aria-hidden /> View profile
      </Link>
    </article>
  )
}
