import { NextResponse } from "next/server"
import { trackUserPreference, trackPurchase } from "@/lib/recommendation-service"
import { initDatabase } from "@/lib/db-init"

// Initialize database tables
let dbInitialized = false
const initDbPromise = initDatabase()
  .then(() => {
    dbInitialized = true
    console.log("Database initialized for track API")
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error)
  })

export async function POST(request: Request) {
  try {
    // Wait for database initialization if not already done
    if (!dbInitialized) {
      console.log("Waiting for database initialization...")
      await initDbPromise
    }

    const body = await request.json()
    const { type, userId, data } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (type === "preference") {
      const { categoryId, subcategoryId, tag, weight } = data
      await trackUserPreference(userId, categoryId, subcategoryId, tag, weight)
      return NextResponse.json({ success: true })
    } else if (type === "purchase") {
      const { productId, quantity } = data
      await trackPurchase(userId, productId, quantity)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid tracking type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in track API:", error)
    return NextResponse.json({ error: "Failed to track user activity" }, { status: 500 })
  }
}
