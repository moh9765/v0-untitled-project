"use client"

import Image from "next/image"
import { Heart, Star } from "lucide-react"
import { useFavorites } from "@/hooks/useFavorites"
import type { Vendor } from "@/lib/types"
import { Button } from "@/components/ui/button"

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const { toggleFavorite, favorites } = useFavorites()
  const isFavorited = favorites.some(f => f.type === "vendor" && f.id === vendor.id)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite({
      
      type: "vendor",
      ...vendor,
      
    })
  }

  return (
    <div className="relative p-4 border rounded-xl bg-white dark:bg-slate-900 shadow-sm">
      <Button onClick={handleToggleFavorite} className="absolute top-3 right-3 z-10">
        <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
      </Button>

      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16 overflow-hidden rounded-full bg-gray-200">
          <Image
            src={vendor.logo || "/placeholder.svg"}
            alt={vendor.name}
            fill
            className="object-cover"
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{vendor.name}</h3>
          <p className="text-sm text-slate-500">{vendor.address}</p>
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm">{vendor.rating || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
