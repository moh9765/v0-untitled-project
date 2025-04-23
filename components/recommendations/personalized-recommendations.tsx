"use client"

import { useEffect } from "react"
import { useRecommendations } from "@/hooks/use-recommendations"
import { ProductCard } from "@/components/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "@/contexts/language-context"

interface PersonalizedRecommendationsProps {
  userId: string
}

export function PersonalizedRecommendations({ userId }: PersonalizedRecommendationsProps) {
  const { t } = useTranslation()
  const { recommendations, isLoading, error, refreshRecommendations } = useRecommendations(userId)

  // Refresh recommendations when the component mounts
  useEffect(() => {
    refreshRecommendations()
  }, [refreshRecommendations])

  if (isLoading && recommendations.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{t("home.recommendedForYou")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{t("home.popularVendors")}</h2>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t("home.recommendedForYou")}</h2>
        <button
          onClick={() => refreshRecommendations()}
          className="text-sm text-primary hover:underline"
          disabled={isLoading}
        >
          {isLoading ? t("common.loading") : t("recommendations.refresh")}
        </button>
      </div>

      {error && <p className="text-sm text-amber-600">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {recommendations.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
