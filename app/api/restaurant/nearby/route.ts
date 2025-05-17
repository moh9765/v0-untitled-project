import { NextResponse } from "next/server"
import { getRestaurantsByCategory, getNearbyRestaurants } from "@/lib/mock-data/restaurants"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const lat = Number.parseFloat(url.searchParams.get("lat") || "0")
    const lng = Number.parseFloat(url.searchParams.get("lng") || "0")
    const categoryId = url.searchParams.get("categoryId") || "food"
    const maxDistance = Number.parseFloat(url.searchParams.get("maxDistance") || "10")

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      return NextResponse.json(
        { error: "Invalid coordinates. Please provide valid lat and lng parameters." },
        { status: 400 },
      )
    }

    // Get restaurants by category
    const categoryRestaurants = getRestaurantsByCategory(categoryId)

    // Find nearby restaurants
    const nearbyRestaurants = categoryRestaurants.map(restaurant => {
      // Calculate distance using the Haversine formula
      const R = 6371 // Radius of the earth in km
      const dLat = deg2rad(restaurant.lat - lat)
      const dLon = deg2rad(restaurant.lng - lng)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat)) * Math.cos(deg2rad(restaurant.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c // Distance in km

      return {
        ...restaurant,
        distance: parseFloat(distance.toFixed(2))
      }
    })
    .filter(restaurant => restaurant.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)

    // Return the results
    return NextResponse.json({
      restaurants: nearbyRestaurants,
      count: nearbyRestaurants.length,
      userLocation: { lat, lng },
    })
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error)
    return NextResponse.json({ error: "Failed to fetch nearby restaurants" }, { status: 500 })
  }
}

// Helper function to convert degrees to radians
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
