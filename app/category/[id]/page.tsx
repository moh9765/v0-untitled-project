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

export default function CategoryPage() {
  const { t, dir, isRTL } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [categorySubcategories, setCategorySubcategories] = useState<Subcategory[]>([])
  const [categoryVendors, setCategoryVendors] = useState<Vendor[]>([])
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

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

  // Filter vendors by subcategory
  const filteredVendors = selectedSubcategory
    ? categoryVendors.filter((v) => v.subcategoryIds.includes(selectedSubcategory))
    : categoryVendors

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId === selectedSubcategory ? null : subcategoryId)
  }

  if (!category) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
              </Button>
              <h1 className="text-xl font-bold ml-2">{t(category.nameKey)}</h1>
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
              <Input placeholder={t("search.placeholder")} className={`pl-10 ${isRTL ? "text-right" : "text-left"}`} />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20">
        {/* Subcategories */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{t("home.categories")}</h2>
          </div>

          <div className="flex overflow-x-auto pb-2 gap-3 hide-scrollbar">
            {categorySubcategories.map((subcategory) => (
              <div key={subcategory.id} className="flex-shrink-0">
                <Button
                  variant={selectedSubcategory === subcategory.id ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => handleSubcategorySelect(subcategory.id)}
                >
                  {t(subcategory.nameKey)}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Vendors */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              {selectedSubcategory
                ? t(categorySubcategories.find((s) => s.id === selectedSubcategory)?.nameKey || "")
                : t(category.nameKey)}
            </h2>
            <div className="text-sm text-slate-500">
              {filteredVendors.length} {t("vendor.results")}
            </div>
          </div>

          {filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredVendors.map((vendor) => (
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
    </div>
  )
}
