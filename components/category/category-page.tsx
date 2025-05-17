"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { LocationSelector } from "@/components/location-selector"
import { NearbyRestaurantsMap } from "@/components/maps/nearby-restaurants-map"
import { VendorCard } from "@/components/vendor-card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { FloatingCart } from "@/components/cart/floating-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, MapPin, List, ArrowLeft, ArrowRight, Clock } from "lucide-react"
import { categories } from "@/lib/mock-data"
import { useLocation } from "@/hooks/use-location"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface Restaurant {
  id: string
  name: string
  nameAr?: string
  rating: number
  ratingCount: number
  address: string
  addressAr?: string
  lat: number
  lng: number
  deliveryTime: number
  deliveryFee: number
  distance: number
  logo: string
  isOpen: boolean
}

interface CategoryPageProps {
  categoryId: string
}

export function CategoryPage({ categoryId }: CategoryPageProps) {
  const { t, dir, isRTL, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { currentLocation, requestLocation } = useLocation()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showClosed, setShowClosed] = useState(true) // Default to showing closed restaurants

  const category = categories.find((c) => c.id === categoryId)

  // Fetch nearby restaurants when location is available
  useEffect(() => {
    async function fetchNearbyRestaurants() {
      if (!currentLocation) return

      setIsLoading(true)
      setError(null)

      try {
        // Fetch nearby restaurants from API with 1km radius
        const response = await fetch(
          `/api/restaurants/nearby?lat=${currentLocation.lat}&lng=${currentLocation.lng}&categoryId=${categoryId}&maxDistance=1`,
        )

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        setRestaurants(data.restaurants)
      } catch (err) {
        console.error("Error fetching nearby restaurants:", err)
        setError("Failed to load restaurants")
        toast({
          title: t("errors.dataFetchFailed"),
          description: t("errors.tryAgainLater"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNearbyRestaurants()
  }, [currentLocation, categoryId, t, toast])

  // Filter restaurants based on search query and open/closed status
  useEffect(() => {
    if (restaurants.length === 0) {
      setFilteredRestaurants([])
      return
    }

    let filtered = [...restaurants]

    // Filter by open/closed status if needed
    if (!showClosed) {
      filtered = filtered.filter((restaurant) => restaurant.isOpen)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.nameAr?.toLowerCase().includes(query) ||
          restaurant.address.toLowerCase().includes(query),
      )
    }

    setFilteredRestaurants(filtered)
  }, [restaurants, searchQuery, showClosed])

  const handleRequestLocation = async () => {
    try {
      await requestLocation()
    } catch (error) {
      toast({
        title: t("errors.locationFailed"),
        description: t("errors.locationPermission"),
        variant: "destructive",
      })
    }
  }

  const toggleShowClosed = () => {
    setShowClosed((prev) => !prev)
  }

  const categoryTitle = category ? t(`categories.${category.id}`) : t("categories.unknown")

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
              </Button>
              <h1 className="text-xl font-bold text-primary ml-2">{categoryTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <LocationSelector />
            </div>
          </div>

          <div className="relative mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t("search.placeholder")}
                className={`pl-10 ${isRTL ? "text-right" : "text-left"}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              title={showClosed ? t("filter.hideClosed") : t("filter.showClosed")}
              onClick={toggleShowClosed}
              className={!showClosed ? "bg-slate-200 dark:bg-slate-700" : ""}
            >
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        {!currentLocation ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <MapPin className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t("location.permissionNeeded")}</h3>
            <p className="text-slate-500 max-w-xs mb-4">{t("location.enableToSeeNearby")}</p>
            <Button onClick={handleRequestLocation}>{t("location.enableLocation")}</Button>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-24 w-24 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-red-500 dark:text-red-300" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t("errors.dataFetchFailed")}</h3>
            <p className="text-slate-500 max-w-xs mb-4">{t("errors.tryAgainLater")}</p>
            <Button onClick={() => window.location.reload()}>{t("common.refresh")}</Button>
          </div>
        ) : (
          <Tabs defaultValue="list" onValueChange={(value) => setViewMode(value as "list" | "map")}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold">
                  {filteredRestaurants.length} {t("nearby.restaurants")}
                </h2>
                <p className="text-sm text-slate-500">{t("nearby.withinRadius", { distance: "1" })}</p>
              </div>
              <TabsList>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  {t("view.list")}
                </TabsTrigger>
                <TabsTrigger value="map">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t("view.map")}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredRestaurants.length > 0 ? (
                <div className="space-y-4">
                  {filteredRestaurants.map((restaurant, index) => (
                    <div key={restaurant.id} className="relative">
                      {!restaurant.isOpen && (
                        <Badge
                          variant="secondary"
                          className="absolute top-2 right-2 z-10 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        >
                          {t("restaurant.closed")}
                        </Badge>
                      )}
                      <div className={`${!restaurant.isOpen ? "opacity-70" : ""}`}>
                        <VendorCard
                          restaurant={{ ...restaurant, index: index + 1 }}
                          currentLocation={currentLocation}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Search className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t("search.noResults")}</h3>
                  <p className="text-slate-500 max-w-xs mb-4">{t("search.tryAgainOrExpand")}</p>
                  <Button onClick={() => window.location.reload()}>{t("common.refresh")}</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <NearbyRestaurantsMap categoryId={categoryId} maxDistance={1} showClosed={showClosed} />
            </TabsContent>
          </Tabs>
        )}
      </main>

      <BottomNavigation />
      <FloatingCart />
    </div>
  )
}
