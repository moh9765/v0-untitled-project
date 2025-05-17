import { NextResponse } from "next/server"
import { getRecommendations, generateRecommendations } from "@/lib/recommendation-service"
import { mockProducts } from "@/lib/mock-data/products"
import { initDatabase } from "@/lib/db-init"
import type { Product } from "@/lib/types/product"
// Initialize database tables
let dbInitialized = false
const initDbPromise = initDatabase()
  .then(() => {
    dbInitialized = true
    console.log("Database initialized for recommendations API")
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error)
  })

export async function GET(request: Request) {
  try {
    // Wait for database initialization if not already done
    if (!dbInitialized) {
      console.log("Waiting for database initialization...")
      await initDbPromise
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "anonymous-user"
    console.log("User ID:", userId) // Log the user ID for debugging
    const refresh = searchParams.get("refresh") === "true"

    interface Recommendation {
      productId: string
      score: number
    }
    let recommendations: Recommendation[] = []

    try {
      if (refresh) {
        // Generate new recommendations
        recommendations = await generateRecommendations(userId, mockProducts)
      } else {
        // Get existing recommendations
        recommendations = await getRecommendations(userId)
      }
    } catch (dbError) {
      console.error("Database error in recommendations API:", dbError)
      // Continue with empty recommendations - we'll fall back to popular products below
    }

    // If we have recommendations, map them to products
    if (recommendations && recommendations.length > 0) {
      interface Recommendation {
        productId: string
        score: number
      }

      

      const recommendedProducts = recommendations
        .map((rec: Recommendation) => {
          const product = mockProducts.find((p: Product) => p.id === rec.productId)
          return product
        ? {
            ...product,
            recommendationScore: rec.score,
          }
        : null
        })
        .filter(Boolean)

      if (recommendedProducts.length > 0) {
        return NextResponse.json({ recommendations: recommendedProducts })
      }
    }

    // Fallback to popular products
    const popularProducts = mockProducts
      .filter((p) => p.isPopular || p.rating >= 4.5)
      .slice(0, 6)
      .map((p) => ({
        ...p,
        recommendationScore: 0.7,
      }))

    return NextResponse.json({ recommendations: popularProducts })
  } catch (error) {
    console.error("Error in recommendations API:", error)

    // Always return a valid response, even in case of errors
    const popularProducts = mockProducts
      .filter((p) => p.isPopular || p.rating >= 4.5)
      .slice(0, 6)
      .map((p) => ({
        ...p,
        recommendationScore: 0.7,
      }))

    return NextResponse.json({ recommendations: popularProducts })
  }
}
