import { FiAlertCircle, FiSearch } from 'react-icons/fi'

export function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-soft" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-teal" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function EmptyState({ title, text }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
      <FiSearch className="mx-auto text-2xl text-soft" aria-hidden />
      <p className="mt-2 font-bold">{title}</p>
      {text && <p className="mt-1 text-sm text-soft">{text}</p>}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900" role="alert">
      <p className="flex items-start gap-2 font-semibold">
        <FiAlertCircle className="mt-0.5 shrink-0" aria-hidden /> {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 min-h-11 rounded-lg bg-white px-4 font-semibold text-navy ring-1 ring-red-200">
          Try again
        </button>
      )}
    </div>
  )
}

const tones = {
  teal: 'bg-mist text-teal-dark',
  navy: 'bg-navy text-white',
  amber: 'bg-amber-100 text-amber-900',
  grey: 'bg-slate-100 text-slate-700',
}

export function Badge({ tone = 'teal', children }) {
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>
}
