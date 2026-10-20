const norm = (s) => String(s || '').trim().toLowerCase()

export function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Pure function: takes provider objects, returns ranked matches with reasons.
export function matchProviders(providers, { city, locality, pincode, visitType = 'any', budget = null }) {
  const results = []

  for (const p of providers) {
    if (norm(p.city) !== norm(city)) continue // different city: not useful for a visit

    // Hard filter: visit type
    if (visitType !== 'any' && !p.visitTypes?.includes(visitType)) continue

    // Hard filter: fee within budget
    const feeFor = visitType === 'any'
      ? [p.fees?.home, p.fees?.centre].filter((f) => typeof f === 'number')
      : [p.fees?.[visitType]].filter((f) => typeof f === 'number')
    if (budget !== null && !feeFor.some((f) => f <= budget)) continue
    const fee = feeFor.length ? Math.min(...feeFor) : null

    // Location score
    const areas = (p.serviceAreas || []).map(norm)
    let score = 1
    const reasons = []
    if (pincode && (norm(p.pincode) === norm(pincode) || areas.includes(norm(pincode)))) {
      score = 3
      reasons.push('Serves your pincode')
    } else if (locality && (norm(p.locality) === norm(locality) || areas.includes(norm(locality)))) {
      score = 2
      reasons.push('Serves your locality')
    } else {
      reasons.push('Same city (no exact area match)')
    }

    if (visitType !== 'any') reasons.push(visitType === 'home' ? 'Offers home visits' : 'Offers centre visits')
    if (fee !== null && budget !== null) reasons.push(`Listed fee Rs. ${fee} is within your budget`)
    if (p.availabilitySlots?.length) reasons.push('Has listed availability')

    results.push({ provider: p, matchScore: score, fee, reasons })
  }

  results.sort((a, b) =>
    b.matchScore - a.matchScore ||
    (a.fee ?? Infinity) - (b.fee ?? Infinity) ||
    (b.provider.availabilitySlots?.length || 0) - (a.provider.availabilitySlots?.length || 0)
  )
  return results
}