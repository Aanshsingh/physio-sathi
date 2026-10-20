const BASE = process.env.API || 'http://localhost:5000/api'
 
const checks = [
  ['Server health + database', 'GET', '/health', null, (d) => d.data.db === 'connected' || 'Database not connected. Check MONGODB_URI in server/.env and Atlas Network Access.'],
  ['Providers list (sample data)', 'GET', '/providers?city=Faridabad', null, (d) => d.data.count > 0 || 'No providers found. Run: npm run seed'],
  ['Provider matching', 'POST', '/providers/match', { city: 'Faridabad', visitType: 'home' }, (d) => d.data.count > 0 || 'No matches. Run: npm run seed'],
  ['Internal equipment', 'GET', '/equipment?mode=rent&q=walker', null, (d) => d.data.count > 0 || 'No equipment. Run: npm run seed:equipment'],
  ['Cost planner', 'POST', '/costs/compare', { sessions: 2, homeFee: 500 }, (d) => d.data.options[0].total === 1000 || 'Unexpected total'],
  ['AI Sathi requirements', 'POST', '/ai/requirements', { message: 'home physio in Faridabad' }, (d) => d.data.requirements.city === 'Faridabad' || 'Unexpected parse'],
  ['Nearby requests', 'GET', '/appointment-requests/nearby?city=Faridabad', null, (d) => Array.isArray(d.data.requests) || 'Unexpected response'],
  ['TinyFish web search', 'POST', '/equipment/search', { query: 'walker', mode: 'rent', city: 'Faridabad' }, (d) => d.data.results.length > 0 || 'TinyFish returned no results'],
]
 
let failed = 0
for (const [name, method, path, body, verify] of checks) {
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(45000),
    })
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.success) {
      throw new Error(`HTTP ${res.status}: ${json?.message || 'no JSON body'}${json?.details ? ` (${json.details})` : ''}`)
    }
    const verdict = verify(json)
    if (verdict !== true) throw new Error(verdict)
    console.log(`PASS  ${name}`)
  } catch (err) {
    failed++
    console.log(`FAIL  ${name}\n      -> ${err.message}`)
  }
}
console.log(failed ? `\n${failed} check(s) failed. Fix the first FAIL first.` : '\nAll checks passed.')
process.exit(failed ? 1 : 0)