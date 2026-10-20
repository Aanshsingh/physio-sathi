const SEARCH_URL = 'https://api.search.tinyfish.ai'
const FETCH_URL = 'https://api.fetch.tinyfish.ai'

function configError() {
  const e = new Error('TinyFish API key not configured')
  e.status = 503
  return e
}

async function request(url, options, timeoutMs) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal })
    const body = await res.json().catch(() => null)
    if (!res.ok) {
      const e = new Error(body?.error?.message || body?.message || `TinyFish error ${res.status}`)
      e.status = res.status
      throw e
    }
    return body
  } catch (err) {
    if (err.name === 'AbortError') {
      const e = new Error('TinyFish request timed out')
      e.status = 504
      throw e
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export async function tinyfishSearch(query) {
  const key = process.env.TINYFISH_API_KEY
  if (!key) throw configError()
  const params = new URLSearchParams({ query, location: 'IN', language: 'en' })
  const body = await request(`${SEARCH_URL}?${params}`, { headers: { 'X-API-Key': key } }, 10_000)
  return body?.results || []
}

export async function tinyfishFetch(urls) {
  const key = process.env.TINYFISH_API_KEY
  if (!key) throw configError()
  const body = await request(
    FETCH_URL,
    {
      method: 'POST',
      headers: { 'X-API-Key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls, format: 'markdown' }),
    },
    30_000
  )
  return { results: body?.results || [], errors: body?.errors || [] }
}