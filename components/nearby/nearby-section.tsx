"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { VendorCard } from "@/components/vendor-card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Filter } from "lucide-react"
import { vendors } from "@/lib/mock-data"
import Link from "next/link"

interface NearbySectionProps {
  title?: string
  maxItems?: number
}

export function NearbySection({ title = "Nearby Vendors", maxItems = 3 }: NearbySectionProps) {
  const { t, isRTL } = useLanguage()
  const [nearbyVendors] = useState(vendors)
  const [isExpanded, setIsExpanded] = useState(false)

  const displayedVendors = isExpanded ? nearbyVendors : nearbyVendors.slice(0, maxItems)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" asChild className="rounded-full">
            <Link href="/nearby" className="flex items-center">
              {t("home.seeAll")}
              {isRTL ? <ChevronLeft className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
            </Link>
          </Button>
        </div>
      </div>

      <div className="px-4 grid grid-cols-1 gap-4">
        {displayedVendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>

      {nearbyVendors.length > maxItems && (
        <div className="px-4 mt-4">
          <Button variant="outline" className="w-full rounded-full" onClick={toggleExpand}>
            {isExpanded ? t("common.showLess") : `${t("common.showMore")} (${nearbyVendors.length - maxItems})`}
          </Button>
        </div>
      )}
    </section>
  )
}
