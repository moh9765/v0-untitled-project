"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { LocationSelector } from "@/components/location-selector"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft, ArrowRight, Filter } from "lucide-react"
import { categories, subcategories, vendors } from "@/lib/mock-data"
import type { Category, Subcategory, Vendor } from "@/lib/types"
import { VendorCard } from "@/components/vendor-card"
import { TranslationKey } from "@/lib/i18n/translations"
import { PersonalizedRecommendations } from "@/components/recommendations/personalized-recommendations"
import { FloatingCart } from "@/components/cart/floating-cart"

export default function CategoryPage() {
  const { t, dir, isRTL } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [categorySubcategories, setCategorySubcategories] = useState<Subcategory[]>([])
  const [categoryVendors, setCategoryVendors] = useState<Vendor[]>([])
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    // Find the category
    const foundCategory = categories.find((c) => c.id === categoryId)
    if (!foundCategory) {
      // Category not found, redirect to home
      router.push("/")
      return
    }

    setCategory(foundCategory)

    // Get subcategories for this category
    const foundSubcategories = subcategories.filter((s) => s.categoryId === categoryId)
    setCategorySubcategories(foundSubcategories)

    // Get vendors for this category
    const foundVendors = vendors.filter((v) => v.categoryId === categoryId)
    setCategoryVendors(foundVendors)
  }, [categoryId, router])

  const toggleFilterOptions = () => {
    setShowFilterOptions((prev) => !prev)
  }

  const applyFilter = (type: string) => {
    setFilterType(type)
    setShowFilterOptions(false)
  }

  // Filter vendors by subcategory and sort by filter type
  const filteredVendors = categoryVendors
    .filter((v) =>
      selectedSubcategory ? v.subcategoryIds.includes(selectedSubcategory) : true
    )
    .sort((a, b) => {
      if (filterType === "rating") {
        return b.rating - a.rating
      } else if (filterType === "distance") {
        return a.distance - b.distance
      } else if (filterType === "popularity") {
        return b.popularity - a.popularity
      }
      return 0
    })

  const filteredProducts = categoryVendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId === selectedSubcategory ? null : subcategoryId)
  }

  if (!category) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>
  }

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto bg-slate-50 dark:bg-slate-900" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
              </Button>
              <h1 className="text-lg font-bold ml-2">{t(category.nameKey as TranslationKey)}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <LocationSelector />
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className={`pl-10 ${isRTL ? "text-right" : "text-left"} h-10 rounded-full`}
              />
            </div>
            <div className="relative">
              <Button variant="outline" size="icon" onClick={toggleFilterOptions}>
                <Filter className="h-4 w-4" />
              </Button>
              {showFilterOptions && (
                <div className="absolute right-0 mt-2 w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20">
                  <ul className="py-2">
                    <li
                      className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap"
                      onClick={() => applyFilter("rating")}
                    >
                      {t("filter.byRating")}
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap"
                      onClick={() => applyFilter("distance")}
                    >
                      {t("filter.byDistance")}
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap"
                      onClick={() => applyFilter("popularity")}
                    >
                      {t("filter.byPopularity")}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    
      {/* Main content */}
      <main className="flex-1 px-4 py-4 space-y-6">
        {/* Subcategories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold">{t("home.categories")}</h2>
          </div>

          <div className="flex overflow-x-auto pb-2 gap-3 hide-scrollbar">
            {categorySubcategories.map((subcategory) => (
              <div key={subcategory.id} className="flex-shrink-0 text-center">
                <Button
                  variant={selectedSubcategory === subcategory.id ? "default" : "outline"}
                  className="rounded-full text-sm px-4 py-2"
                  onClick={() => handleSubcategorySelect(subcategory.id)}
                >
                  {t(subcategory.nameKey as TranslationKey)}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Personalized Recommendations for Grocery */}
        {categoryId === "groceries" && (
          <section>
            <PersonalizedRecommendations userId="exampleUserId" />
          </section>
        )}

        {/* Vendors */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold">
              {selectedSubcategory
                ? t(categorySubcategories.find((s) => s.id === selectedSubcategory)?.nameKey as TranslationKey || "")
                : t(category.nameKey as TranslationKey)}
            </h2>
            <div className="text-sm text-slate-500">
              {filteredProducts.length} {t("vendor.results")}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredProducts.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} layout="list" />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">{t("search.noResults")}</p>
              <p className="text-sm text-slate-400 mt-1">{t("search.tryAgain")}</p>
            </div>
          )}
        </section>
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
      <FloatingCart />
    </div>
  )
}
