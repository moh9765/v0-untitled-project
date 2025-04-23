"use client"

import { useState, useEffect, useCallback } from "react"
import type { Product } from "@/lib/types/product"
import { mockProducts } from "@/lib/mock-data/products"

export function useRecommendations(userId: string | null) {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshRecommendations = useCallback(async () => {
    if (!userId) {
      // Set fallback recommendations for non-logged in users
      const fallbackRecommendations = mockProducts.filter((p) => p.isPopular || p.rating >= 4.5).slice(0, 6)
      setRecommendations(fallbackRecommendations)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Use a simple GET request without additional headers to minimize potential issues
      const response = await fetch(`/api/recommendations?userId=${userId}&refresh=true`)

      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations)
      } else {
        // Fallback to popular products if no recommendations
        const fallbackRecommendations = mockProducts.filter((p) => p.isPopular || p.rating >= 4.5).slice(0, 6)
        setRecommendations(fallbackRecommendations)
      }
    } catch (err) {
      console.error("Error refreshing recommendations:", err)

      // Set fallback recommendations
      const fallbackRecommendations = mockProducts.filter((p) => p.isPopular || p.rating >= 4.5).slice(0, 6)
      setRecommendations(fallbackRecommendations)

      // Set a user-friendly error message
      setError("Unable to load personalized recommendations. Showing popular items instead.")
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Fetch recommendations on mount and when userId changes
  useEffect(() => {
    // Always set fallback recommendations first to ensure something is displayed
    const fallbackRecommendations = mockProducts.filter((p) => p.isPopular || p.rating >= 4.5).slice(0, 6)
    setRecommendations(fallbackRecommendations)

    // Then try to fetch personalized recommendations if we have a userId
    if (userId) {
      refreshRecommendations()
    }
  }, [userId, refreshRecommendations])

  // Track user behavior
  const trackUserBehavior = async (eventType: string, data: any) => {
    if (!userId) return

    try {
      await fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          eventType,
          data,
        }),
      })
    } catch (err) {
      console.error("Error tracking user behavior:", err)
      // Silently fail - tracking errors shouldn't affect the user experience
    }
  }

  return {
    recommendations,
    isLoading,
    error,
    refreshRecommendations,
    trackUserBehavior,
  }
}
