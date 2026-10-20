// Extracts search preferences from plain words.
// 1) Tries the Gemini API when AI_API_KEY is set. 2) Always has a keyword fallback so the app never breaks.
// The AI never diagnoses or prescribes, and its output is sanitised before use.

export const CITIES = ['Faridabad', 'Delhi', 'Gurugram', 'Noida']
const CITY_ALIASES = { gurgaon: 'Gurugram', 'new delhi': 'Delhi' }
const KNOWN_LOCALITIES = ['NIT', 'Ballabhgarh', 'Greater Faridabad', 'Lajpat Nagar', 'Saket', 'Defence Colony', 'Malviya Nagar']

const EQUIPMENT = [
  { name: 'hand pulley', rx: /hand pulley|shoulder pulley|finger ladder/i },
  { name: 'walker', rx: /\bwalker\b|walking frame/i },
  { name: 'wheelchair', rx: /wheel ?chair/i },
  { name: 'TENS unit', rx: /\btens\b/i },
  { name: 'knee brace', rx: /knee brace|knee support/i },
  { name: 'cervical collar', rx: /cervical collar|neck collar/i },
  { name: 'crutches', rx: /crutch/i },
]

const EMPTY = { city: '', locality: '', pincode: '', visitType: '', budget: null, equipment: '', equipmentMode: '', schedule: '' }

export function isMedicalAsk(message) {
  return /diagnos|prescrib|which medicine|what medicine|dosage|\bdose\b|cure\b|which exercise|what exercise|is it serious|treatment for|should i take/i.test(message)
}

export function keywordParse(message) {
  const m = String(message || '')
  const out = { ...EMPTY }
  const lower = m.toLowerCase()

  for (const city of CITIES) if (new RegExp(`\\b${city}\\b`, 'i').test(m)) out.city = city
  for (const [alias, city] of Object.entries(CITY_ALIASES)) if (lower.includes(alias)) out.city = city

  const sector = m.match(/sector[\s-]*(\d{1,3}[a-z]?)/i)
  if (sector) out.locality = `Sector ${sector[1].toUpperCase()}`
  else for (const loc of KNOWN_LOCALITIES) if (new RegExp(`\\b${loc}\\b`, 'i').test(m)) out.locality = loc

  const pin = m.match(/\b\d{6}\b/)
  if (pin) out.pincode = pin[0]

  const home = /\bhome\b|at home|home visit|\bghar\b/i.test(m)
  const centre = /\bcentre\b|\bcenter\b|clinic/i.test(m)
  out.visitType = home && centre ? 'any' : home ? 'home' : centre ? 'centre' : ''

  const budgetMatch =
    m.match(/(?:rs\.?|\u20B9|inr)\s*(\d[\d,]*)(\s*k\b)?/i) ||
    m.match(/budget[^\d]{0,20}(\d[\d,]*)(\s*k\b)?/i) ||
    m.match(/(\d[\d,]*)(\s*k\b)?\s*(?:rs\b|rupees)/i)
  if (budgetMatch) {
    let n = Number(budgetMatch[1].replace(/,/g, ''))
    if (budgetMatch[2]) n *= 1000
    if (Number.isFinite(n) && n > 0 && n <= 1_000_000) out.budget = n
  }

  for (const e of EQUIPMENT) if (e.rx.test(m)) { out.equipment = e.name; break }
  if (/\brent\b|rental|\bhire\b|on rent/i.test(m)) out.equipmentMode = 'rent'
  else if (/second.?hand|pre-?owned|\bused\b/i.test(m)) out.equipmentMode = 'used'
  else if (/\bbuy\b|purchase/i.test(m)) out.equipmentMode = 'buy'

  const sched = lower.match(/morning|afternoon|evening|weekend/)
  if (sched) out.schedule = sched[0]

  return out
}

function sanitize(ai) {
  const out = { ...EMPTY }
  if (!ai || typeof ai !== 'object') return out
  const city = CITIES.find((c) => c.toLowerCase() === String(ai.city || '').trim().toLowerCase())
  if (city) out.city = city
  if (typeof ai.locality === 'string') out.locality = ai.locality.trim().slice(0, 60)
  if (/^\d{6}$/.test(String(ai.pincode || ''))) out.pincode = String(ai.pincode)
  if (['home', 'centre', 'any'].includes(ai.visitType)) out.visitType = ai.visitType
  const b = Number(ai.budget)
  if (ai.budget !== null && ai.budget !== '' && Number.isFinite(b) && b > 0 && b <= 1_000_000) out.budget = b
  if (typeof ai.equipment === 'string') out.equipment = ai.equipment.trim().slice(0, 40)
  if (['buy', 'rent', 'used'].includes(ai.equipmentMode)) out.equipmentMode = ai.equipmentMode
  if (typeof ai.schedule === 'string') out.schedule = ai.schedule.trim().slice(0, 40)
  return out
}

async function aiExtract(message) {
  const key = process.env.AI_API_KEY
  if (!key) return null
  const model = process.env.AI_MODEL || 'gemini-2.5-flash'
  const prompt = `You extract search preferences for a physiotherapy finder in India.
Return ONLY a JSON object with these keys:
city (one of Faridabad, Delhi, Gurugram, Noida, or ""), locality (string or ""), pincode (6 digits or ""),
visitType ("home", "centre", "any" or ""), budget (number in rupees per session, or null),
equipment (short name of equipment mentioned, or ""), equipmentMode ("buy", "rent", "used" or ""), schedule (string or "").
Rules: never diagnose, never suggest treatment, never include medical details. Use "" or null when unknown.
User message: """${message}"""`

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 12000)
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0 },
        }),
        signal: ctrl.signal,
      }
    )
    if (!res.ok) throw new Error(`AI API status ${res.status}`)
    const body = await res.json()
    const text = body?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''
    return sanitize(JSON.parse(text.replace(/```json|```/g, '').trim()))
  } catch (err) {
    console.warn('AI extraction failed, using keyword fallback:', err.message)
    return null
  } finally {
    clearTimeout(timer)
  }
}

const isEmpty = (v) => v === '' || v === null || v === undefined

// Precedence: AI (this message) > keyword parse (this message) > previous context.
export async function extractRequirements(message, context = {}) {
  const fallback = keywordParse(message)
  const ai = await aiExtract(message)
  const prev = sanitize(context)
  const merged = {}
  for (const key of Object.keys(EMPTY)) {
    const candidates = [ai?.[key], fallback[key], prev[key]]
    merged[key] = candidates.find((v) => !isEmpty(v)) ?? EMPTY[key]
  }
  let followUp = ''
  if (!merged.city) followUp = 'Which city are you in? I can search Faridabad, Delhi, Gurugram and Noida.'
  else if (!merged.visitType) followUp = 'Would you like a home visit or a centre visit?'
  return { requirements: merged, followUp, source: ai ? 'ai' : 'fallback' }
}

export function sanitizeContext(ctx) {
  return sanitize(ctx)
}