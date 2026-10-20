import { tinyfishSearch, tinyfishFetch } from './tinyfish.service.js'
import { ApiError } from '../utils/ApiError.js'

// Only reports what the page text actually contains. Never guesses.
function extractFacts(text = '') {
  const t = text.slice(0, 20000)
  const prices = []
  const re = /(?:₹|Rs\.?|INR)\s?([\d,]+(?:\.\d+)?)/gi
  let m
  while ((m = re.exec(t)) && prices.length < 3) {
    const amount = Number(m[1].replace(/,/g, ''))
    if (!Number.isNaN(amount) && amount > 0) {
      prices.push({ amount, raw: m[0], context: t.slice(Math.max(0, m.index - 50), m.index + 60).replace(/\s+/g, ' ') })
    }
  }
  const rentalMentioned = /\b(on rent|for rent|rental|per day|per week|per month|\/day|\/month)\b/i.test(t)
  return { prices, rentalMentioned }
}

export async function searchExternalEquipment({ query, mode, city }) {
  const modeWord = { buy: 'buy price', rent: 'rental price per day', used: 'second hand price' }[mode]
  const q = `${query} ${modeWord} ${city} India`.replace(/\s+/g, ' ').trim()

  let found
  try {
    found = await tinyfishSearch(q)
  } catch (err) {
    throw new ApiError(
      502,
      'External web research is unavailable right now. Internal listings still work.',
      'TINYFISH_UNAVAILABLE',
      err.message
    )
  }

  const top = found.filter((r) => r.url).slice(0, 5)
  if (top.length === 0) return { query: q, mode, results: [], note: 'No external results found' }

  let fetched = { results: [], errors: [] }
  let fetchFailed = false
  try {
    fetched = await tinyfishFetch(top.map((r) => r.url))
  } catch {
    fetchFailed = true
  }

  // Match by url, not array index (per TinyFish docs)
  const byUrl = new Map(fetched.results.map((p) => [p.url, p]))

  const results = top.map((r) => {
    const page = byUrl.get(r.url)
    const facts = page ? extractFacts(page.text) : { prices: [], rentalMentioned: false }
    return {
      sourceType: 'external',
      verified: false,
      title: r.title || null,
      snippet: r.snippet || null,
      siteName: r.site_name || null,
      sourceUrl: r.url,
      prices: facts.prices,
      rentalMentioned: facts.rentalMentioned,
      retrievalStatus: page ? 'fetched' : fetchFailed ? 'search_only' : 'fetch_failed',
    }
  })

  return { query: q, mode, results }
}