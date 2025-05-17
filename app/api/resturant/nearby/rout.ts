import { NextResponse } from "next/server"
import { restaurants } from "@/lib/mock-data/restaurants"
import { findNearbyRestaurants } from "@/lib/location-service"

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

    // Filter restaurants by category
    const categoryRestaurants = restaurants.filter((r) => r.categoryId === categoryId)

    // Find nearby restaurants
    const nearbyRestaurants = findNearbyRestaurants(categoryRestaurants, lat, lng, maxDistance)

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
