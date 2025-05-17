// Calculate distance between two coordinates using the Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Find nearby restaurants based on user location
export function findNearbyRestaurants(restaurants: any[], userLat: number, userLng: number, maxDistance = 5): any[] {
  return restaurants
    .map((restaurant) => {
      // Calculate distance using actual restaurant coordinates
      const distance = calculateDistance(userLat, userLng, restaurant.lat, restaurant.lng)

      return {
        ...restaurant,
        distance,
      }
    })
    .filter((restaurant) => restaurant.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
}

// Generate Google Maps directions URL
export function getDirectionsUrl(
  destLat: number,
  destLng: number,
  originLat: number,
  originLng: number,
  travelMode = "driving",
): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=${travelMode}`
}

// Get a static map URL with markers
export function getStaticMapUrl(
  center: { lat: number; lng: number },
  markers: Array<{ lat: number; lng: number; label?: string }>,
  zoom = 14,
  width = 600,
  height = 300,
): string {
  let url = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoom}&size=${width}x${height}&scale=2`

  // Add center marker (blue)
  url += `&markers=color:blue%7C${center.lat},${center.lng}`

  // Add restaurant markers (red)
  markers.forEach((marker, index) => {
    const label = marker.label || (index + 1).toString()
    url += `&markers=color:red%7Clabel:${label}%7C${marker.lat},${marker.lng}`
  })

  // Add API key
  url += `&key=AIzaSyC0ZhUZr_TJfxw9bNTckmCPuuIhljImDww || ""}`

  return url
}
