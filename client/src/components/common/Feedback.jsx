
export function Spinner({ label = 'Loading...' }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-line bg-white p-5"
      role="status"
    >
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-teal" />
      <p className="text-sm text-soft">{label}</p>
    </div>
  )
}

export function EmptyState({ title, text }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 text-center">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-sm text-soft">{text}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div
      className="rounded-2xl border border-red-200 bg-white p-5"
      role="alert"
    >
      <h3 className="font-bold text-red-700">Something went wrong</h3>

      <p className="mt-1 text-sm text-soft">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-3 min-h-10 rounded-lg bg-navy px-4 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  )
}

