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
import { FilterPanel, type FilterOptions } from "@/components/marketplace/filter-panel"
import { NearbyRestaurants } from "@/components/restaurant/nearby-restaurants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import type { Product, ProductCategory } from "@/lib/types/product"
import { TranslationKey } from "@/lib/i18n/translations"

export default function MarketplacePage() {
  const { t, dir, isRTL } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({})
  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const [showRestaurants, setShowRestaurants] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch('/api/products', { signal: AbortSignal.timeout(10000) })
        if (!productsRes.ok) throw new Error('products_failed')

        const categoriesRes = await fetch('/api/categories', { signal: AbortSignal.timeout(10000) })
        if (!categoriesRes.ok) throw new Error('categories_failed')

        const [productsData, categoriesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json()
        ])

        const transformedProducts = productsData.map((product: any) => ({
          id: product.id,
          name: product.name,
          nameAr: product.name_ar || null,
          description: product.description,
          descriptionAr: product.description_ar || null,
          price: Number(product.price),
          images: product.images , // Use actual images if available
          thumbnail: product.thumbnail , // Fallback if thumbnail is missing
          categoryId: product.category_id,
          subcategoryId: product.subcategory_id,
          tags: Array.isArray(product.tags) ? product.tags : [],
          rating: Number(product.rating || 0),
          ratingCount: Number(product.rating_count || 0),
          stock: Number(product.stock || 0),
          unit: product.unit,
          weight: product.weight ? Number(product.weight) : undefined,
          nutritionInfo: product.nutrition_info || null,
          ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
          isFavorite: Boolean(product.is_favorite),
          isPopular: Boolean(product.is_popular),
          isNew: Boolean(product.is_new),
          storeId: product.store_id,
          originalPrice: product.original_price ? Number(product.original_price) : undefined,
          discount: product.discount ? Number(product.discount) : 0
        }))

        setProducts(transformedProducts)
        setCategories(categoriesData)
        setFilteredProducts(transformedProducts)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown_error'
        setError(message === 'products_failed' ? 'failedProducts' : 'generalError')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update active filter count
  useEffect(() => {
    let count = 0
    if (activeFilters.categoryId) count++
    if (activeFilters.priceRange &&
        (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 100)) count++
    if (activeFilters.minRating) count++
    if (activeFilters.tags && activeFilters.tags.length > 0) count++
    if (activeFilters.sortBy) count++
    if (activeFilters.inStock) count++
    if (activeFilters.onSale) count++

    setActiveFilterCount(count)
  }, [activeFilters])

  // Apply filters to products
  useEffect(() => {
    let filtered = products

    // Category filter from category scroll
    if (selectedCategory) {
      filtered = filtered.filter(p => p.categoryId === selectedCategory)
    }

    // Subcategory filter from category scroll
    if (selectedSubcategory) {
      filtered = filtered.filter(p => p.subcategoryId === selectedSubcategory)
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.nameAr?.toLowerCase().includes(query)) ||
        p.description.toLowerCase().includes(query)
      )
    }

    // Category filter from filter panel
    if (activeFilters.categoryId && !selectedCategory) {
      filtered = filtered.filter(p => p.categoryId === activeFilters.categoryId)
    }

    // Price range filter
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange
      filtered = filtered.filter(p => p.price >= min && p.price <= max)
    }

    // Rating filter
    if (activeFilters.minRating) {
      filtered = filtered.filter(p => p.rating >= (activeFilters.minRating as number))
    }

    // Tags filter
    if (activeFilters.tags && activeFilters.tags.length > 0) {
      filtered = filtered.filter(p =>
        activeFilters.tags?.some(tag => p.tags.includes(tag))
      )
    }

    // In stock filter
    if (activeFilters.inStock) {
      filtered = filtered.filter(p => p.stock > 0)
    }

    // On sale filter
    if (activeFilters.onSale) {
      filtered = filtered.filter(p => p.discount && p.discount > 0)
    }

    // Apply sorting
    if (activeFilters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (activeFilters.sortBy) {
          case 'price-asc':
            return a.price - b.price
          case 'price-desc':
            return b.price - a.price
          case 'rating-desc':
            return b.rating - a.rating
          case 'name-asc':
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, selectedSubcategory, searchQuery, activeFilters])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory(undefined)

    // Check if this is a food-related category to show restaurants
    setShowRestaurants(categoryId === "food")
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-slate-500">{t("loading.message")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500 p-4 text-center">
        <h2 className="text-xl font-bold mb-2">{t("errors.failedProducts")}</h2>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          {t("common.retry")}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">{t("marketplace.title")}</h1>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <LocationSelector />
            </div>
          </div>

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
            <Button
              variant={activeFilterCount > 0 ? "default" : "outline"}
              size="icon"
              onClick={() => setIsFilterPanelOpen(true)}
              className="relative"
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Active filter badges */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activeFilters.categoryId && !selectedCategory && (
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  {categories.find(c => c.id === activeFilters.categoryId)?.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setActiveFilters(prev => ({ ...prev, categoryId: undefined }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {activeFilters.priceRange &&
                (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 100) && (
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  ${activeFilters.priceRange[0]} - ${activeFilters.priceRange[1]}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setActiveFilters(prev => ({ ...prev, priceRange: [0, 100] }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {activeFilters.minRating && (
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  {t("filters.minRating")}: {activeFilters.minRating}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setActiveFilters(prev => ({ ...prev, minRating: undefined }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {activeFilters.sortBy && (
                <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                  {t(`filters.${activeFilters.sortBy}` as TranslationKey)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setActiveFilters(prev => ({ ...prev, sortBy: undefined }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setActiveFilters({})}
                >
                  {t("filters.clearAll")}
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800">
          <CategoryScroll
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={handleSubcategoryChange}
            categories={categories}
          />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {selectedSubcategory
              ? categories.find(c => c.id === selectedCategory)?.subcategories?.find(s => s.id === selectedSubcategory)?.name
              : selectedCategory
              ? categories.find(c => c.id === selectedCategory)?.name
              : t("marketplace.allProducts")}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              {filteredProducts.length} {t("marketplace.items")}
            </span>
            <ProductGridToggle defaultView={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        {/* Show nearby restaurants if a food category is selected */}
        {showRestaurants && selectedCategory && (
          <div className="mb-8">
            <NearbyRestaurants categoryId={selectedCategory} maxDistance={10} />
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${product.name}`}
                onClick={() => handleProductClick(product)}
                onKeyDown={(e) => e.key === "Enter" && handleProductClick(product)}
                className="cursor-pointer"
              >
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

        {selectedProduct && (
          <ProductDetailsSheet
            product={selectedProduct}
            isOpen={isProductDetailsOpen}
            onClose={handleCloseProductDetails}
          />
        )}
      </main>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        categories={categories}
        initialFilters={activeFilters}
        onApplyFilters={(filters) => setActiveFilters(filters)}
      />

      <BottomNavigation />
      <FloatingCart />
    </div>
  )
}
