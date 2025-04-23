"use client"

import type React from "react"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import type { Vendor } from "@/lib/types"
import { Star, Clock, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface VendorCardProps {
  vendor: Vendor
  layout?: "grid" | "list"
}

export function VendorCard({ vendor, layout = "grid" }: VendorCardProps) {
  const { t, isRTL } = useLanguage()

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // In a real app, this would update the favorite status in the backend
    console.log(`Toggle favorite for ${vendor.id}`)
  }

  return (
    <Link href={`/vendor/${vendor.id}`}>
      <Card
        className={`overflow-hidden hover:shadow-md transition-shadow rounded-xl ${layout === "list" ? "flex" : ""}`}
      >
        <div className={`relative ${layout === "list" ? "w-1/3" : "w-full"}`}>
          <Image
            src={vendor.coverImage || "/placeholder.svg"}
            alt={isRTL && vendor.nameAr ? vendor.nameAr : vendor.name}
            width={400}
            height={200}
            className="w-full h-32 object-cover"
          />

          {/* Promotion tag */}
          {vendor.promotion && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {vendor.promotion.type === "discount"
                ? `${vendor.promotion.value}% ${t("common.off")}`
                : t("common.free")}
            </div>
          )}

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white rounded-full"
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-5 w-5 ${vendor.isFavorite ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
          </Button>

          {/* Logo */}
          <div className="absolute -bottom-4 left-4 h-16 w-16 rounded-full border-2 border-white bg-white overflow-hidden">
            <Image
              src={vendor.logo || "/placeholder.svg"}
              alt="logo"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <CardContent className={`pt-6 ${layout === "list" ? "w-2/3" : ""}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold">{isRTL && vendor.nameAr ? vendor.nameAr : vendor.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{vendor.rating}</span>
              <span className="text-xs text-slate-500 ml-1">({vendor.ratingCount})</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-y-1 text-sm text-slate-500">
            <div className="flex items-center mr-3">
              <MapPin className="h-3 w-3 mr-1" />
              <span>
                {vendor.distance} {t("common.km")}
              </span>
            </div>
            <div className="flex items-center mr-3">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {vendor.deliveryTime} {t("common.min")}
              </span>
            </div>
            <div className={`w-full mt-1 ${vendor.isOpen ? "text-green-600" : "text-red-500"}`}>
              {vendor.isOpen ? t("vendor.openNow") : t("vendor.closed")}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
