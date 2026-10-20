// Deterministic cost maths. No AI arithmetic. Every total comes with its formula, assumptions and missing inputs.
const round = (n) => Math.round(n * 100) / 100
const has = (v) => typeof v === 'number' && Number.isFinite(v)

export function compareCosts(input) {
  const sessions = input.sessions

  // ---- Care visits ----
  const home = { key: 'home', group: 'care', label: 'Physiotherapist home visits', complete: false, total: null, breakdown: [], assumptions: [], missing: [],
    formula: 'sessions x home session fee + sessions x travel charge per visit' }
  if (!has(input.homeFee)) home.missing.push('Home session fee')
  else {
    const travel = has(input.homeTravelPerVisit) ? input.homeTravelPerVisit : 0
    if (!has(input.homeTravelPerVisit)) home.assumptions.push('No travel charge entered, so Rs. 0 per visit is assumed.')
    home.breakdown = [
      { label: `${sessions} sessions x Rs. ${input.homeFee}`, amount: round(sessions * input.homeFee) },
      { label: `${sessions} visits x Rs. ${travel} travel`, amount: round(sessions * travel) },
    ]
    home.total = round(home.breakdown.reduce((s, b) => s + b.amount, 0))
    home.complete = true
  }

  const centre = { key: 'centre', group: 'care', label: 'Rehabilitation centre visits', complete: false, total: null, breakdown: [], assumptions: [], missing: [],
    formula: 'sessions x centre session fee + sessions x your own travel cost per visit' }
  if (!has(input.centreFee)) centre.missing.push('Centre session fee')
  else {
    const travel = has(input.centreTravelPerVisit) ? input.centreTravelPerVisit : 0
    if (!has(input.centreTravelPerVisit)) centre.assumptions.push('No travel cost entered, so Rs. 0 per visit is assumed.')
    centre.breakdown = [
      { label: `${sessions} sessions x Rs. ${input.centreFee}`, amount: round(sessions * input.centreFee) },
      { label: `${sessions} visits x Rs. ${travel} travel`, amount: round(sessions * travel) },
    ]
    centre.total = round(centre.breakdown.reduce((s, b) => s + b.amount, 0))
    centre.complete = true
  }

  // ---- Equipment ----
  const rent = { key: 'rent', group: 'equipment', label: 'Equipment rental', complete: false, total: null, breakdown: [], assumptions: [], missing: [],
    formula: 'rental rate per day x number of days + other listed charges' }
  if (!has(input.rentalRatePerDay)) rent.missing.push('Rental rate per day')
  if (!has(input.rentalDays)) rent.missing.push('Rental duration in days')
  if (rent.missing.length === 0) {
    const extra = has(input.rentalExtra) ? input.rentalExtra : 0
    if (!has(input.rentalExtra)) rent.assumptions.push('No other charges entered (deposit, delivery), so Rs. 0 is assumed.')
    rent.breakdown = [
      { label: `${input.rentalDays} days x Rs. ${input.rentalRatePerDay}`, amount: round(input.rentalDays * input.rentalRatePerDay) },
      { label: 'Other listed charges', amount: round(extra) },
    ]
    rent.total = round(rent.breakdown.reduce((s, b) => s + b.amount, 0))
    rent.complete = true
  }

  const buy = { key: 'buy', group: 'equipment', label: 'Equipment purchase', complete: false, total: null, breakdown: [], assumptions: [], missing: [],
    formula: 'purchase price' }
  if (!has(input.purchasePrice)) buy.missing.push('Purchase price')
  else {
    buy.breakdown = [{ label: 'Purchase price', amount: round(input.purchasePrice) }]
    buy.total = round(input.purchasePrice)
    buy.complete = true
    buy.assumptions.push('Resale value and delivery charges are not included.')
  }

  const options = [home, centre, rent, buy]

  const lowestOf = (keys) => {
    const done = options.filter((o) => keys.includes(o.key) && o.complete)
    if (done.length < 2) return null
    return done.reduce((a, b) => (b.total < a.total ? b : a)).key
  }

  let breakEvenDays = null
  if (has(input.purchasePrice) && has(input.rentalRatePerDay) && input.rentalRatePerDay > 0) {
    breakEvenDays = Math.ceil(input.purchasePrice / input.rentalRatePerDay)
  }

  return {
    sessions,
    options,
    lowestCare: lowestOf(['home', 'centre']),
    lowestEquipment: lowestOf(['rent', 'buy']),
    breakEvenDays,
    notes: [
      'These are estimates based only on the numbers you entered.',
      'The lowest estimate is not necessarily the best clinical choice. A qualified physiotherapist or clinician should decide what suits you.',
    ],
  }
}