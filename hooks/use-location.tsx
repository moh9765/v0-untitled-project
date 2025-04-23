"use client"

import { useState, useEffect } from "react"
import type { UserLocation, LocationPermissionStatus } from "@/lib/types"

export function useLocation() {
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>("unknown")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser")
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      })

      // In a real app, we would use a geocoding service to get the address
      // For now, we'll just use the coordinates
      const mockAddress = "Current Location"
      const mockAddressAr = "الموقع الحالي"

      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: mockAddress,
        addressAr: mockAddressAr,
      })

      setPermissionStatus("granted")
      localStorage.setItem("locationPermission", "granted")
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        if (err.code === 1) {
          // Permission denied
          setPermissionStatus("denied")
          localStorage.setItem("locationPermission", "denied")
          setError("Location permission denied")
        } else {
          // Other errors
          setError(`Error getting location: ${err.message}`)
        }
      } else {
        setError(`Error getting location: ${err instanceof Error ? err.message : String(err)}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check if we have stored permission status
    const storedPermission = localStorage.getItem("locationPermission") as LocationPermissionStatus | null

    if (storedPermission) {
      setPermissionStatus(storedPermission)

      // If permission was previously granted, try to get the location
      if (storedPermission === "granted") {
        requestLocation()
      }
    } else {
      setPermissionStatus("prompt")
    }
  }, [])

  return {
    currentLocation,
    permissionStatus,
    isLoading,
    error,
    requestLocation,
  }
}
