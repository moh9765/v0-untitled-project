"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useLocation } from "@/hooks/use-location"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Navigation, ExternalLink, AlertCircle, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { getDirectionsUrl, getStaticMapUrl } from "@/lib/location-service"

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
}

interface NearbyRestaurantsMapProps {
  categoryId?: string
  maxDistance?: number
}

export function NearbyRestaurantsMap({ categoryId = "food", maxDistance = 10 }: NearbyRestaurantsMapProps) {
  const { t, isRTL, language } = useLanguage()
  const { currentLocation, requestLocation, isLoading: locationLoading } = useLocation()
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch nearby restaurants when location is available
  useEffect(() => {
    async function fetchNearbyRestaurants() {
      if (!currentLocation) return

      setIsLoading(true)

      try {
        // Fetch nearby restaurants from API
        const response = await fetch(
          `/api/restaurants/nearby?lat=${currentLocation.lat}&lng=${currentLocation.lng}&categoryId=${categoryId}&maxDistance=${maxDistance}`,
        )

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        setNearbyRestaurants(data.restaurants)
      } catch (error) {
        console.error("Error fetching nearby restaurants:", error)
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

  if (!currentLocation) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <MapPin className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("location.permissionNeeded")}</h3>
          <p className="text-slate-500 text-center mb-4">{t("location.enableToSeeNearby")}</p>
          <Button onClick={handleRequestLocation} disabled={locationLoading}>
            {locationLoading ? t("loading.message") : t("location.enableLocation")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Skeleton className="h-[300px] w-full mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Generate static map URL with markers for all restaurants
  const staticMapUrl = getStaticMapUrl(
    currentLocation,
    nearbyRestaurants.map((restaurant, index) => ({
      lat: restaurant.lat,
      lng: restaurant.lng,
      label: (index + 1).toString(),
    })),
    14,
    600,
    300,
  )

  return (
    <div className="space-y-4">
      <Card className="w-full overflow-hidden">
        {mapError ? (
          <div className="h-[300px] w-full flex items-center justify-center bg-slate-100">
            <div className="text-center p-4">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
              <p className="text-slate-600">{t("errors.mapLoadFailed")}</p>
            </div>
          </div>
        ) : (
          <div className="h-[300px] w-full relative">
            <img
              src={staticMapUrl || "/placeholder.svg?height=300&width=600"}
              alt={t("location.mapOfNearbyRestaurants")}
              className="h-full w-full object-cover"
              onError={() => setMapError("Failed to load map")}
            />
          </div>
        )}
      </Card>

      <h3 className="text-lg font-medium">
        {nearbyRestaurants.length > 0
          ? t("location.nearbyRestaurants", { count: nearbyRestaurants.length })
          : t("location.noNearbyRestaurants")}
      </h3>

      {nearbyRestaurants.length > 0 ? (
        <div className="space-y-3">
          {nearbyRestaurants.map((restaurant, index) => {
            // Generate directions URL
            const directionsUrl = getDirectionsUrl(
              restaurant.lat,
              restaurant.lng,
              currentLocation.lat,
              currentLocation.lng,
            )

            return (
              <Card key={restaurant.id} className="w-full overflow-hidden">
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
                            {index + 1}. {language === "ar" && restaurant.nameAr ? restaurant.nameAr : restaurant.name}
                          </h4>
                          <div className="flex items-center text-sm text-slate-500 mt-1">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{restaurant.rating.toFixed(1)}</span>
                            <span className="mx-1">•</span>
                            <span>{restaurant.distance.toFixed(1)} km</span>
                            <span className="mx-1">•</span>
                            <span>{restaurant.deliveryTime} min</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 truncate">
                            {language === "ar" && restaurant.addressAr ? restaurant.addressAr : restaurant.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" size="sm" asChild>
                      <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                        <Navigation className="h-4 w-4 mr-1" />
                        {t("location.directions")}
                      </a>
                    </Button>
                    <Button variant="default" size="sm" asChild>
                      <Link href={`/vendor/${restaurant.id}`}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {t("common.view")}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="w-full">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <MapPin className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">{t("location.noRestaurantsFound")}</h3>
            <p className="text-slate-500 text-center mb-4">{t("location.tryIncreasingRadius")}</p>
            <Button onClick={() => window.location.reload()}>{t("common.refresh")}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
