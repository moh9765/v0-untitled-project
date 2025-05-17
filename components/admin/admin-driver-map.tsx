"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface Driver {
  id: string
  name: string
  status: string
  currentLocation?: {
    lat: number
    lng: number
    address: string
  }
  vehicle?: {
    type: string
  }
  activeOrder?: {
    id: string
    status: string
  }
}

interface AdminDriverMapProps {
  drivers: Driver[]
}

export function AdminDriverMap({ drivers }: AdminDriverMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([])

  // Initialize map
  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsAPI = () => {
      const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      
      if (!googleMapsApiKey) {
        console.error("Google Maps API key is missing")
        return
      }
      
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      document.head.appendChild(script)
      
      return () => {
        document.head.removeChild(script)
      }
    }
    
    // Initialize map
    const initMap = () => {
      const mapElement = document.getElementById("driver-map")
      
      if (!mapElement) {
        console.error("Map element not found")
        return
      }
      
      // Default to New York City coordinates
      const mapInstance = new google.maps.Map(mapElement, {
        center: { lat: 40.7128, lng: -74.006 },
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      })
      
      setMap(mapInstance)
      setMapLoaded(true)
    }
    
    loadGoogleMapsAPI()
    
    // Cleanup
    return () => {
      // Clear markers and info windows
      markers.forEach(marker => marker.setMap(null))
      setMarkers([])
      infoWindows.forEach(infoWindow => infoWindow.close())
      setInfoWindows([])
    }
  }, [])

  // Update markers when drivers change
  useEffect(() => {
    if (!map || !mapLoaded || !drivers.length) return
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))
    infoWindows.forEach(infoWindow => infoWindow.close())
    
    const newMarkers: google.maps.Marker[] = []
    const newInfoWindows: google.maps.InfoWindow[] = []
    const bounds = new google.maps.LatLngBounds()
    
    // Add markers for each driver
    drivers.forEach(driver => {
      if (!driver.currentLocation) return
      
      const { lat, lng } = driver.currentLocation
      const position = new google.maps.LatLng(lat, lng)
      
      // Extend bounds
      bounds.extend(position)
      
      // Create marker
      const marker = new google.maps.Marker({
        position,
        map,
        title: driver.name,
        icon: {
          url: getMarkerIcon(driver.status),
          scaledSize: new google.maps.Size(32, 32),
        },
      })
      
      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${driver.name}</div>
            <div style="margin-bottom: 4px;">
              <span style="background-color: ${getStatusColor(driver.status)}; color: white; padding: 2px 6px; border-radius: 9999px; font-size: 12px;">
                ${driver.status.replace("_", " ")}
              </span>
            </div>
            ${driver.vehicle ? `<div style="margin-bottom: 4px;">Vehicle: ${driver.vehicle.type}</div>` : ''}
            ${driver.activeOrder ? `<div style="margin-bottom: 4px;">Order: ${driver.activeOrder.id}</div>` : ''}
            <div style="font-size: 12px; color: #666;">${driver.currentLocation.address}</div>
          </div>
        `,
      })
      
      // Add click event
      marker.addListener("click", () => {
        // Close all info windows
        newInfoWindows.forEach(iw => iw.close())
        
        // Open this info window
        infoWindow.open(map, marker)
      })
      
      newMarkers.push(marker)
      newInfoWindows.push(infoWindow)
    })
    
    // Fit bounds if there are markers
    if (newMarkers.length > 0) {
      map.fitBounds(bounds)
      
      // Set minimum zoom level
      const listener = google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 15) {
          map.setZoom(15)
        }
        google.maps.event.removeListener(listener)
      })
    }
    
    setMarkers(newMarkers)
    setInfoWindows(newInfoWindows)
  }, [map, mapLoaded, drivers])

  // Helper function to get marker icon based on status
  const getMarkerIcon = (status: string) => {
    switch (status) {
      case "online":
        return "/images/marker-green.png" // Replace with actual icon path
      case "on_delivery":
        return "/images/marker-blue.png" // Replace with actual icon path
      case "offline":
        return "/images/marker-gray.png" // Replace with actual icon path
      case "suspended":
        return "/images/marker-red.png" // Replace with actual icon path
      default:
        return "/images/marker-default.png" // Replace with actual icon path
    }
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#10b981" // green
      case "on_delivery":
        return "#3b82f6" // blue
      case "offline":
        return "#6b7280" // gray
      case "suspended":
        return "#ef4444" // red
      default:
        return "#6b7280" // gray
    }
  }

  if (!mapLoaded) {
    return <Skeleton className="h-full w-full" />
  }

  return (
    <div id="driver-map" className="h-full w-full rounded-md">
      {/* Map will be rendered here */}
    </div>
  )
}
