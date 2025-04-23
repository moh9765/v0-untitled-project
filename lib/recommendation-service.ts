import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"
import { sql } from "./db"
import type { Product } from "./types/product"
import { tableExists } from "./db-init"

// Types for our recommendation system
export type UserPreference = {
  userId: string
  categoryId: string | null
  subcategoryId: string | null
  tag: string | null
  weight: number
}

export type PurchaseRecord = {
  userId: string
  productId: string
  quantity: number
  purchasedAt: Date
}

export type ProductRecommendation = {
  userId: string
  productId: string
  score: number
}

// Track user preferences (e.g., when they view product details)
export async function trackUserPreference(
  userId: string,
  categoryId: string | null,
  subcategoryId: string | null,
  tag: string | null,
  weight = 1.0,
): Promise<void> {
  try {
    // Check if table exists
    const exists = await tableExists("user_preferences")
    if (!exists) {
      console.error("user_preferences table does not exist")
      return
    }

    // Upsert user preference (update weight if exists, insert if not)
    await sql`
      INSERT INTO user_preferences (user_id, category_id, subcategory_id, tag, weight, created_at, updated_at)
      VALUES (${userId}, ${categoryId}, ${subcategoryId}, ${tag}, ${weight}, NOW(), NOW())
      ON CONFLICT (user_id, category_id, subcategory_id, tag)
      DO UPDATE SET weight = user_preferences.weight + ${weight}, updated_at = NOW()
    `
  } catch (error) {
    console.error("Error tracking user preference:", error)
    // Don't throw the error to prevent breaking the user experience
  }
}

// Track purchase history
export async function trackPurchase(userId: string, productId: string, quantity: number): Promise<void> {
  try {
    // Check if table exists
    const exists = await tableExists("purchase_history")
    if (!exists) {
      console.error("purchase_history table does not exist")
      return
    }

    await sql`
      INSERT INTO purchase_history (user_id, product_id, quantity, purchased_at)
      VALUES (${userId}, ${productId}, ${quantity}, NOW())
    `
  } catch (error) {
    console.error("Error tracking purchase:", error)
    // Don't throw the error to prevent breaking the user experience
  }
}

// Get user preferences
export async function getUserPreferences(userId: string): Promise<UserPreference[]> {
  try {
    // Check if table exists
    const exists = await tableExists("user_preferences")
    if (!exists) {
      console.error("user_preferences table does not exist")
      return []
    }

    const result = await sql`
      SELECT user_id as "userId", category_id as "categoryId", subcategory_id as "subcategoryId", tag, weight
      FROM user_preferences
      WHERE user_id = ${userId}
      ORDER BY weight DESC
    `
    return result || []
  } catch (error) {
    console.error("Error getting user preferences:", error)
    return []
  }
}

// Get user purchase history
export async function getUserPurchaseHistory(userId: string): Promise<PurchaseRecord[]> {
  try {
    // Check if table exists
    const exists = await tableExists("purchase_history")
    if (!exists) {
      console.error("purchase_history table does not exist")
      return []
    }

    const result = await sql`
      SELECT user_id as "userId", product_id as "productId", quantity, purchased_at as "purchasedAt"
      FROM purchase_history
      WHERE user_id = ${userId}
      ORDER BY purchased_at DESC
    `
    return result || []
  } catch (error) {
    console.error("Error getting user purchase history:", error)
    return []
  }
}

// Generate recommendations using Grok AI
export async function generateRecommendations(
  userId: string,
  products: Product[],
  maxRecommendations = 10,
): Promise<ProductRecommendation[]> {
  try {
    // Get user preferences and purchase history
    const preferences = await getUserPreferences(userId)
    const purchaseHistory = await getUserPurchaseHistory(userId)

    // If we don't have enough data, return popular products
    if (preferences.length === 0 && purchaseHistory.length === 0) {
      return products
        .filter((p) => p.isPopular || p.rating >= 4.5)
        .slice(0, maxRecommendations)
        .map((p) => ({
          userId,
          productId: p.id,
          score: 0.7, // Default score for popular products
        }))
    }

    // Prepare data for Grok AI
    const userData = {
      preferences,
      purchaseHistory,
      availableProducts: products.map((p) => ({
        id: p.id,
        name: p.name,
        categoryId: p.categoryId,
        subcategoryId: p.subcategoryId,
        tags: p.tags || [],
        price: p.price,
        rating: p.rating,
      })),
    }

    try {
      // Use Grok AI to analyze user data and generate recommendations
      const prompt = `
        You are a product recommendation system for a delivery app.
        Analyze the following user data and recommend products that the user might be interested in.
        
        User Preferences:
        ${JSON.stringify(preferences, null, 2)}
        
        Purchase History:
        ${JSON.stringify(purchaseHistory, null, 2)}
        
        Available Products:
        ${JSON.stringify(userData.availableProducts, null, 2)}
        
        Based on this data, recommend up to ${maxRecommendations} products with a relevance score between 0 and 1.
        Return your response as a valid JSON array of objects with the following format:
        [
          {
            "productId": "product-id",
            "score": 0.95
          }
        ]
        
        Only include the productId and score in your response, nothing else.
      `

      // Call Grok AI
      const { text } = await generateText({
        model: xai("grok-2-1212"),
        prompt,
      })

      // Parse the response
      try {
        const recommendations = JSON.parse(text) as Array<{ productId: string; score: number }>

        // Check if table exists before storing recommendations
        const exists = await tableExists("product_recommendations")
        if (exists) {
          // Store recommendations in the database
          for (const rec of recommendations) {
            try {
              await sql`
                INSERT INTO product_recommendations (user_id, product_id, score, created_at)
                VALUES (${userId}, ${rec.productId}, ${rec.score}, NOW())
                ON CONFLICT (user_id, product_id)
                DO UPDATE SET score = ${rec.score}, created_at = NOW()
              `
            } catch (error) {
              console.error("Error storing recommendation:", error)
              // Continue with the next recommendation
            }
          }
        } else {
          console.error("product_recommendations table does not exist")
        }

        return recommendations.map((rec) => ({
          userId,
          productId: rec.productId,
          score: rec.score,
        }))
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError)
        throw new Error("Failed to parse AI recommendations")
      }
    } catch (aiError) {
      console.error("Error calling AI service:", aiError)
      throw new Error("Failed to generate AI recommendations")
    }
  } catch (error) {
    console.error("Error generating recommendations:", error)

    // Fallback to popular products
    return products
      .filter((p) => p.isPopular || p.rating >= 4.5)
      .slice(0, maxRecommendations)
      .map((p) => ({
        userId,
        productId: p.id,
        score: 0.7, // Default score for popular products
      }))
  }
}

// Get stored recommendations for a user
export async function getRecommendations(userId: string): Promise<ProductRecommendation[]> {
  try {
    // Check if table exists
    const exists = await tableExists("product_recommendations")
    if (!exists) {
      console.error("product_recommendations table does not exist")
      return []
    }

    const result = await sql`
      SELECT user_id as "userId", product_id as "productId", score
      FROM product_recommendations
      WHERE user_id = ${userId}
      ORDER BY score DESC
    `
    return result || []
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return []
  }
}
