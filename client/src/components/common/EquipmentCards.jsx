import { FiExternalLink, FiTool } from 'react-icons/fi'
import { Badge } from './ui.jsx'
import { rupees } from '../../api/api.js'

const availabilityText = { available: 'Available', unavailable: 'Not available', unknown: 'Availability not confirmed' }

export function InternalCard({ item }) {
  return (
    <article className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-mist text-xl text-teal-dark"><FiTool aria-hidden /></span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1">
            <h3 className="font-bold">{item.name}</h3>
            {item.isSample && <Badge tone="amber">Sample data</Badge>}
            {item.condition === 'used' && <Badge tone="grey">Used</Badge>}
          </div>
          <p className="mt-1 text-sm text-soft">{item.description}</p>
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        {typeof item.salePrice === 'number' && <div><dt className="text-soft">Buy</dt><dd className="font-bold">{rupees(item.salePrice)}</dd></div>}
        {typeof item.rentalPricePerDay === 'number' && <div><dt className="text-soft">Rent</dt><dd className="font-bold">{rupees(item.rentalPricePerDay)} / day</dd></div>}
      </dl>
      <p className="mt-3 text-xs text-soft">
        Seller: {item.sellerName}{item.city ? `, ${item.city}` : ''} &middot; {availabilityText[item.availabilityStatus] || availabilityText.unknown}
      </p>
    </article>
  )
}

const statusLabel = {
  fetched: 'Page read',
  fetch_failed: 'Page could not be read',
  search_only: 'Search result only',
}

export function ExternalCard({ item }) {
  const price = item.prices?.[0]
  return (
    <article className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-4">
      <div className="flex flex-wrap items-center gap-1">
        <Badge tone="amber">External result, not verified</Badge>
        <Badge tone="grey">{statusLabel[item.retrievalStatus] || item.retrievalStatus}</Badge>
        {item.rentalMentioned && <Badge tone="teal">Rental terms mentioned</Badge>}
      </div>
      <h3 className="mt-2 font-bold">{item.title || item.siteName || item.sourceUrl}</h3>
      {item.siteName && <p className="text-xs text-soft">{item.siteName}</p>}
      {item.snippet && <p className="mt-1 text-sm text-soft">{item.snippet}</p>}

      {price ? (
        <p className="mt-3 text-sm">
          <span className="text-soft">Price mentioned on the page: </span>
          <span className="font-bold">{rupees(price.amount)}</span>
          <span className="block text-xs text-soft">"...{price.context}..."</span>
        </p>
      ) : (
        <p className="mt-3 text-sm text-soft">No price found on the page. Check the source.</p>
      )}

      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-teal-dark underline"
      >
        View source <FiExternalLink aria-hidden />
      </a>
    </article>
  )
}
