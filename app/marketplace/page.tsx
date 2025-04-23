"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { LocationSelector } from "@/components/location-selector"
import { CategoryScroll } from "@/components/category/category-scroll"
import { ProductGridToggle } from "@/components/product/product-grid-toggle"
import { ProductCard } from "@/components/product/product-card"
import { ProductDetailsSheet } from "@/components/product/product-details-sheet"
import { FloatingCart } from "@/components/cart/floating-cart"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { productCategories } from "@/lib/mock-data/products"
import { mockProducts } from "@/lib/mock-data/products"
import type { Product } from "@/lib/types/product"

export default function MarketplacePage() {
  const { t, dir, isRTL } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter products when category or subcategory changes
  useEffect(() => {
    let filtered = mockProducts

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.categoryId === selectedCategory)
    }

    if (selectedSubcategory) {
      filtered = filtered.filter((product) => product.subcategoryId === selectedSubcategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.nameAr && product.nameAr.toLowerCase().includes(query)) ||
          product.description.toLowerCase().includes(query),
      )
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, selectedSubcategory, searchQuery])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory(undefined)
  }

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId)
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDetailsOpen(true)
  }

  const handleCloseProductDetails = () => {
    setIsProductDetailsOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">{t("marketplace.title")}</h1>
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
                placeholder={t("search.placeholder")}
                className={`pl-10 ${isRTL ? "text-right" : "text-left"}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category navigation */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800">
          <CategoryScroll
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={handleSubcategoryChange}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {selectedSubcategory
              ? productCategories
                  .find((c) => c.id === selectedCategory)
                  ?.subcategories?.find((s) => s.id === selectedSubcategory)?.name
              : selectedCategory
                ? productCategories.find((c) => c.id === selectedCategory)?.name
                : t("marketplace.allProducts")}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              {filteredProducts.length} {t("marketplace.items")}
            </span>
            <ProductGridToggle defaultView={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
            {filteredProducts.map((product) => (
              <div key={product.id} onClick={() => handleProductClick(product)}>
                <ProductCard product={product} layout={viewMode} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t("search.noResults")}</h3>
            <p className="text-slate-500 max-w-xs">{t("search.tryAgain")}</p>
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />

      {/* Floating cart */}
      <FloatingCart />

      {/* Product details sheet */}
      {selectedProduct && (
        <ProductDetailsSheet
          product={selectedProduct}
          isOpen={isProductDetailsOpen}
          onClose={handleCloseProductDetails}
        />
      )}
    </div>
  )
}
