"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useLocation } from "@/hooks/use-location"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Navigation, Star, Clock, DollarSign, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useFavorites } from "@/hooks/useFavorites"

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
  categoryId: string
}

interface NearbyRestaurantsProps {
  categoryId: string
  maxDistance?: number
}

export function NearbyRestaurants({ categoryId, maxDistance = 10 }: NearbyRestaurantsProps) {
  const { t, isRTL, language } = useLanguage()
  const { currentLocation, requestLocation, isLoading: locationLoading } = useLocation()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { toggleFavorite, favorites } = useFavorites()

  // Fetch nearby restaurants when location is available
  useEffect(() => {
    async function fetchNearbyRestaurants() {
      if (!currentLocation) return

      setIsLoading(true)
      setError(null)

      try {
        // Fetch nearby restaurants from API
        const response = await fetch(
          `/api/restaurant/nearby?lat=${currentLocation.lat}&lng=${currentLocation.lng}&categoryId=${categoryId}&maxDistance=${maxDistance}`
        )

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        setRestaurants(data.restaurants || [])
      } catch (error) {
        console.error("Error fetching nearby restaurants:", error)
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
  }, [currentLocation, categoryId, maxDistance, t, toast])

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

  // Check if a restaurant is in favorites
  const isRestaurantFavorite = (restaurantId: string) => {
    return favorites.some(f => f.type === "vendor" && f.id === restaurantId)
  }

  // Toggle restaurant favorite status
  const handleToggleFavorite = (restaurant: Restaurant) => {
    toggleFavorite({
      ...restaurant,
      type: "vendor"
    })
  }

  if (locationLoading || isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{t("restaurants.nearby")}</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!currentLocation) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-medium mb-2">{t("location.required")}</h3>
          <p className="text-slate-500 mb-4">{t("location.enableDescription")}</p>
          <Button onClick={handleRequestLocation}>
            <MapPin className="mr-2 h-4 w-4" />
            {t("location.enable")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">{t("errors.dataFetchFailed")}</h3>
          <p className="text-slate-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            {t("common.retry")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (restaurants.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">{t("restaurants.noNearby")}</h3>
          <p className="text-slate-500 mb-4">{t("restaurants.tryDifferentLocation")}</p>
          <Button onClick={handleRequestLocation}>
            <MapPin className="mr-2 h-4 w-4" />
            {t("location.update")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t("restaurants.nearby")}</h2>
        <Button variant="outline" size="sm" onClick={handleRequestLocation}>
          <Navigation className="mr-2 h-4 w-4" />
          {t("location.update")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {restaurants.map((restaurant) => (
          <Link href={`/vendor/${restaurant.id}`} key={restaurant.id}>
            <Card className="w-full overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={restaurant.logo || "/placeholder.svg?height=64&width=64"}
                      alt={restaurant.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium truncate">
                          {language === "ar" && restaurant.nameAr ? restaurant.nameAr : restaurant.name}
                        </h4>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{restaurant.rating.toFixed(1)}</span>
                          <span className="mx-1">•</span>
                          <span>{restaurant.distance.toFixed(1)} km</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleToggleFavorite(restaurant)
                        }}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isRestaurantFavorite(restaurant.id)
                              ? "fill-red-500 text-red-500"
                              : "text-slate-400"
                          }`}
                        />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-slate-400 mr-1" />
                        <span>{restaurant.deliveryTime} min</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-slate-400 mr-1" />
                        <span>${restaurant.deliveryFee.toFixed(2)}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        restaurant.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {restaurant.isOpen ? t("restaurants.open") : t("restaurants.closed")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
