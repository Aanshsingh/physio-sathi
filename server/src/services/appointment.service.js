const norm = (s) => String(s || '').trim().toLowerCase()

// Closeness of a request to a physio's chosen base area: 3 pincode, 2 locality, 1 same city.
export function closeness(request, base) {
  if (base.pincode && norm(request.pincode) === norm(base.pincode)) return 3
  if (base.locality && norm(request.locality) === norm(base.locality)) return 2
  return 1
}

// Demo view only: no names, phone numbers or notes are ever returned.
export function toNearbyView(request, base) {
  const score = closeness(request, base)
  return {
    id: request._id,
    city: request.city,
    locality: request.locality || null,
    pincode: request.pincode || null,
    visitType: request.visitType,
    preferredDate: request.preferredDate,
    preferredTime: request.preferredTime,
    status: request.status,
    closenessScore: score,
    closeness: score === 3 ? 'Same pincode' : score === 2 ? 'Same locality' : 'Same city',
    createdAt: request.createdAt,
  }
}

export function rankNearby(requests, base) {
  return requests
    .map((r) => toNearbyView(r, base))
    .sort((a, b) => b.closenessScore - a.closenessScore || new Date(b.createdAt) - new Date(a.createdAt))
}