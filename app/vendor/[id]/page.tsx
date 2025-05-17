"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Vendor as VendorCard } from "@/components/Card/VendorCard"
import type { Vendor } from "@/lib/types"
import { ArrowLeft, ArrowRight, Star, Clock, MapPin, Heart, Share2 } from "lucide-react"
import Image from "next/image"

export default function VendorPage() {
  const { t, dir, isRTL } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const vendorId = params.id as string

  const [vendor, setVendor] = useState<Vendor | null>(null)

  useEffect(() => {
    // Find the vendor
    const vendors: Vendor[] = [
      {
        id: "1",
        name: "Vendor 1",
        nameAr: "البائع 1",
        coverImage: "/images/vendor1-cover.jpg",
        logo: "/images/vendor1-logo.jpg",
        rating: 4.5,
        ratingCount: 120,
        isOpen: true,
        address: "123 Main St",
        addressAr: "123 الشارع الرئيسي",
        deliveryTime: 30,
        deliveryFee: 5.0,
        minOrder: 20.0,
        distance: 2.5,
        isFavorite: false,
        lat: function (lat: number, lng: number, lat1: any, lng1: any) {
          throw new Error("Function not implemented.")
        },
        lng: function (lat: number, lng: number, lat1: any, lng1: any) {
          throw new Error("Function not implemented.")
        },
        popularity: undefined,
        image: false,
        categoryId: "",
        subcategoryIds: [],
        tags: []
      },
      {
        id: "2",
        name: "Vendor 2",
        nameAr: "البائع 2",
        coverImage: "/images/vendor2-cover.jpg",
        logo: "/images/vendor2-logo.jpg",
        rating: 4.0,
        ratingCount: 80,
        isOpen: false,
        address: "456 Elm St",
        addressAr: "456 شارع إلم",
        deliveryTime: 45,
        deliveryFee: 3.0,
        minOrder: 15.0,
        distance: 5.0,
        isFavorite: true,
        lat: function (lat: number, lng: number, lat1: any, lng1: any) {
          throw new Error("Function not implemented.")
        },
        lng: function (lat: number, lng: number, lat1: any, lng1: any) {
          throw new Error("Function not implemented.")
        },
        popularity: undefined,
        image: false,
        categoryId: "",
        subcategoryIds: [],
        tags: []
      },
    ];

    const foundVendor: Vendor | undefined = vendors.find((v: Vendor) => v.id === vendorId);
    if (!foundVendor) {
      // Vendor not found, redirect to home
      router.push("/")
      return
    }

    setVendor(foundVendor)
  }, [vendorId, router])

  const handleToggleFavorite = () => {
    if (!vendor) return

    // In a real app, this would update the favorite status in the backend
    setVendor({
      ...vendor,
      isFavorite: !vendor.isFavorite,
    })
  }

  if (!vendor) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900" dir={dir}>
      {/* Vendor header */}
      <div className="relative">
        <div className="h-48 w-full relative">
          <Image
            src={vendor.coverImage || "/placeholder.svg"}
            alt={isRTL && vendor.nameAr ? vendor.nameAr : vendor.name}
            fill
            className="object-cover"
          />

          {/* Back button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 h-10 w-10 bg-white/80 hover:bg-white rounded-full"
            onClick={() => router.back()}
          >
            {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          </Button>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 bg-white/80 hover:bg-white rounded-full"
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-5 w-5 ${vendor.isFavorite ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/80 hover:bg-white rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Vendor logo */}
        <div className="absolute -bottom-10 left-4 h-20 w-20 rounded-full border-4 border-white bg-white overflow-hidden">
          <Image
            src={vendor.logo || "/placeholder.svg"}
            alt="logo"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Vendor info */}
      <div className="container mx-auto px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold">{isRTL && vendor.nameAr ? vendor.nameAr : vendor.name}</h1>

        <div className="flex items-center mt-1">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="font-medium">{vendor.rating}</span>
            <span className="text-sm text-slate-500 ml-1">({vendor.ratingCount})</span>
          </div>
          <span className="mx-2 text-slate-300">•</span>
          <div className={`${vendor.isOpen ? "text-green-600" : "text-red-500"}`}>
            {vendor.isOpen ? t("vendor.openNow") : t("vendor.closed")}
          </div>
        </div>

        <div className="flex flex-wrap gap-y-1 text-sm text-slate-500 mt-2">
          <div className="flex items-center mr-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{isRTL && vendor.addressAr ? vendor.addressAr : vendor.address}</span>
          </div>
          <div className="flex items-center mr-4">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {vendor.deliveryTime} {t("common.min")}
            </span>
          </div>
        </div>

        {/* Delivery info */}
        <div className="flex items-center justify-between mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div>
            <div className="text-sm text-slate-500">{t("vendor.deliveryFee")}</div>
            <div className="font-medium">
              {vendor.deliveryFee === 0 ? t("common.free") : `$${vendor.deliveryFee.toFixed(2)}`}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-500">{t("vendor.minOrder")}</div>
            <div className="font-medium">${vendor.minOrder.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">{t("vendor.distance")}</div>
            <div className="font-medium">
              {vendor.distance} {t("common.km")}
            </div>
          </div>
        </div>
      </div>

      {/* Main content - This would be replaced with actual menu/products */}
      <main className="flex-1 container mx-auto px-4 py-4 pb-20">
        <div className="text-center py-10">
          <p className="text-slate-500">
            {t("vendor.viewMenu")} / {t("vendor.viewProducts")}
          </p>
          <p className="text-sm text-slate-400 mt-1">(This is a placeholder for the vendor's menu or products)</p>
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  )
}
