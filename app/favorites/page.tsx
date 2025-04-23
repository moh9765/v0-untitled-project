"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Heart } from "lucide-react"
import { vendors } from "@/lib/mock-data"
import { VendorCard } from "@/components/vendor-card"

export default function FavoritesPage() {
  const { t, dir, isRTL } = useLanguage()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [favoriteVendors, setFavoriteVendors] = useState(vendors.filter((v) => v.isFavorite))

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    setIsAuthenticated(authStatus)
    setIsLoading(false)

    // Redirect if not authenticated
    if (!authStatus) {
      router.push("/auth/login")
    }
  }, [router])

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold ml-2">{t("navigation.favorites")}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20">
        {favoriteVendors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {favoriteVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Heart className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 mb-4">You don't have any favorite vendors yet</p>
              <Button asChild>
                <a href="/">Browse Vendors</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  )
}
