"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { LocationSelector } from "@/components/location-selector"
import { CategoryCard } from "@/components/category-card"
import { VendorCard } from "@/components/vendor-card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { SplashScreen } from "@/components/splash-screen"
import { FloatingCart } from "@/components/cart/floating-cart"
import { NearbySection } from "@/components/nearby/nearby-section"
import { DashboardSection } from "@/components/dashboard/dashboard-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight, ChevronLeft, Plus } from "lucide-react"
import { categories, vendors } from "@/lib/mock-data"
import type { Location } from "@/lib/types/product"
import Link from "next/link"
import { OrderCard } from "@/components/order-card"
import { mockOrders } from "@/lib/mock-orders"
import { PersonalizedRecommendations } from "@/components/recommendations/personalized-recommendations"

export default function Home() {
  const { t, dir, isRTL } = useLanguage()
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [nearbyVendors, setNearbyVendors] = useState(vendors)
  const [popularVendors, setPopularVendors] = useState(vendors.filter((v) => v.rating >= 4.5))
  const [showSplash, setShowSplash] = useState(true)
  const [recentOrders, setRecentOrders] = useState(mockOrders.slice(0, 3))
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Handle location selection
  const handleLocationSelected = (location: Location) => {
    setSelectedLocation(location)

    // In a real app, we would fetch vendors based on the selected location
    // For now, we'll just simulate it by filtering the vendors
    const filteredVendors = vendors.filter(
      (vendor) =>
        // Simulate distance-based filtering
        Math.abs(vendor.distance - Math.random() * 2) < 5,
    )

    setNearbyVendors(filteredVendors)
  }

  // Load saved location on mount
  useEffect(() => {
    const savedLocationJson = localStorage.getItem("selectedLocation")
    if (savedLocationJson) {
      try {
        const savedLocation = JSON.parse(savedLocationJson) as Location
        setSelectedLocation(savedLocation)
      } catch (e) {
        console.error("Failed to parse saved location", e)
      }
    }

    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const role = localStorage.getItem("user_role")
    const email = localStorage.getItem("user_email")
    setIsAuthenticated(authStatus)
    setUserRole(role)
    setUserEmail(email)

    // Hide splash screen after checking if user is already logged in
    if (!authStatus) {
      // If not authenticated, keep splash screen and redirect will happen in the component
    } else {
      // If authenticated, hide splash screen after 2 seconds
      const timer = setTimeout(() => {
        setShowSplash(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Save selected location
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem("selectedLocation", JSON.stringify(selectedLocation))
    }
  }, [selectedLocation])

  if (showSplash) {
    return <SplashScreen />
  }

  // For testing purposes, always use a fixed user ID
  const userId = "user123"

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">{t("app.name")}</h1>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <LocationSelector onLocationSelected={handleLocationSelected} />
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mt-3">
            <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-3 h-4 w-4 text-slate-400`} />
            <Input
              placeholder={t("home.searchPlaceholder")}
              className={`${isRTL ? "pr-10 text-right" : "pl-10 text-left"} h-12 rounded-full`}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 py-6 pb-20">
        {/* Hero section with daily deals */}
        <div className="relative overflow-hidden px-4 mb-6">
          <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-shrink-0 w-full snap-center">
                <div className="relative h-40 w-full bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{t("home.dailyDeal", { number: item })}</h4>
                      <p className="text-sm">{t("home.dealDescription")}</p>
                    </div>
                    <Button size="sm" className="self-start rounded-full">
                      {t("home.shopNow")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`h-1.5 rounded-full ${item === 1 ? "w-6 bg-primary" : "w-1.5 bg-slate-300 dark:bg-slate-600"}`}
              />
            ))}
          </div>
        </div>

        {/* New Order Button */}
        <div className="px-4 mb-6">
          <Button asChild className="w-full py-6 text-lg rounded-xl">
            <Link href="/customer/new-delivery" className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              {t("delivery.newDelivery")}
            </Link>
          </Button>
        </div>

        {/* Categories section */}
        <section className="mb-8">
          <div className="flex items-center justify-between px-4 mb-4">
            <h2 className="text-lg font-bold">{t("home.categories")}</h2>
            <Button variant="ghost" size="sm" asChild className="rounded-full">
              <Link href="/category" className="flex items-center">
                {t("home.seeAll")}
                {isRTL ? <ChevronLeft className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
              </Link>
            </Button>
          </div>

          <div className="px-4 grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} size="sm" />
            ))}
          </div>
        </section>

        {/* Personalized Recommendations - only show if user is authenticated */}
        <PersonalizedRecommendations userId={userId} />

        {/* Dashboard section for authenticated users */}
        {isAuthenticated && <DashboardSection />}

        {/* Recent Orders section */}
        {isAuthenticated && recentOrders.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-lg font-bold">{t("home.recentOrders")}</h2>
              <Button variant="ghost" size="sm" asChild className="rounded-full">
                <Link href="/customer/history" className="flex items-center">
                  {t("home.seeAll")}
                  {isRTL ? <ChevronLeft className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                </Link>
              </Button>
            </div>

            <div className="px-4 space-y-4">
              {recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {/* Nearby vendors section */}
        <NearbySection title={t("home.nearbyVendors")} />

        {/* Popular vendors section */}
        <section className="mb-8">
          <div className="flex items-center justify-between px-4 mb-4">
            <h2 className="text-lg font-bold">{t("home.popularVendors")}</h2>
            <Button variant="ghost" size="sm" asChild className="rounded-full">
              <Link href="/popular" className="flex items-center">
                {t("home.seeAll")}
                {isRTL ? <ChevronLeft className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
              </Link>
            </Button>
          </div>

          <div className="px-4 grid grid-cols-1 gap-4">
            {popularVendors.slice(0, 3).map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />

      {/* Floating cart */}
      <FloatingCart />
    </div>
  )
}
