"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MapPin, Home, Briefcase, Plus, Navigation, Search, X } from "lucide-react"
import { useLocation } from "@/hooks/use-location"
import { savedLocations } from "@/lib/mock-data"
import type { Location } from "@/lib/types"

interface LocationSelectorProps {
  onLocationSelected?: (location: Location) => void
}

export function LocationSelector({ onLocationSelected }: LocationSelectorProps) {
  const { t, dir, isRTL } = useLanguage()
  const { currentLocation, permissionStatus, isLoading, requestLocation } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLocationSelect = (location: Location) => {
    if (onLocationSelected) {
      onLocationSelected(location)
    }
    setIsOpen(false)
  }

  const handleCurrentLocation = async () => {
    if (permissionStatus === "denied") {
      // Show instructions to enable location in browser settings
      alert(t("location.permissionDenied"))
      return
    }

    await requestLocation()

    if (currentLocation) {
      const currentLocationObj: Location = {
        id: "current",
        name: t("location.current"),
        address: currentLocation.address,
        addressAr: currentLocation.addressAr,
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      }

      handleLocationSelect(currentLocationObj)
    }
  }

  // Filter locations based on search query
  const filteredLocations = searchQuery
    ? savedLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.address.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : savedLocations

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MapPin className="h-4 w-4" />
          <span className="truncate max-w-[150px]">
            {currentLocation ? currentLocation.address : t("home.setLocation")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir={dir}>
        <DialogHeader>
          <DialogTitle>{t("home.setLocation")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder={t("location.searchPlaceholder")}
              className={`pl-10 ${isRTL ? "text-right" : "text-left"}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Current location button */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleCurrentLocation}
            disabled={isLoading}
          >
            <Navigation className="h-4 w-4 text-blue-500" />
            {isLoading ? t("location.searching") : t("location.current")}
          </Button>

          {/* Saved locations */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium">{t("location.savedLocations")}</h3>
            <div className="space-y-2 mt-2">
              {filteredLocations.map((location) => (
                <Button
                  key={location.id}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => handleLocationSelect(location)}
                >
                  {location.type === "home" ? (
                    <Home className="h-4 w-4 text-slate-500" />
                  ) : location.type === "work" ? (
                    <Briefcase className="h-4 w-4 text-slate-500" />
                  ) : (
                    <MapPin className="h-4 w-4 text-slate-500" />
                  )}
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{location.name}</span>
                    <span className="text-xs text-slate-500">
                      {isRTL && location.addressAr ? location.addressAr : location.address}
                    </span>
                  </div>
                </Button>
              ))}

              {/* Add new location button */}
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4 text-slate-500" />
                {t("location.addNew")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
