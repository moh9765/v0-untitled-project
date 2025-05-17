"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { X, Check, Star } from "lucide-react"
import type { ProductCategory, ProductTag } from "@/lib/types/product"

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  categories: ProductCategory[]
  onApplyFilters: (filters: FilterOptions) => void
  initialFilters?: FilterOptions
}

export interface FilterOptions {
  categoryId?: string
  priceRange?: [number, number]
  minRating?: number
  tags?: ProductTag[]
  sortBy?: string
  inStock?: boolean
  onSale?: boolean
}

export function FilterPanel({
  isOpen,
  onClose,
  categories,
  onApplyFilters,
  initialFilters = {}
}: FilterPanelProps) {
  const { t, isRTL } = useLanguage()
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    categoryId: initialFilters.categoryId,
    priceRange: initialFilters.priceRange || [0, 100],
    minRating: initialFilters.minRating,
    tags: initialFilters.tags || [],
    sortBy: initialFilters.sortBy,
    inStock: initialFilters.inStock,
    onSale: initialFilters.onSale
  })

  // Available product tags
  const availableTags: { value: ProductTag; label: string }[] = [
    { value: "vegan", label: t("product.vegan") },
    { value: "organic", label: t("product.organic") },
    { value: "gluten-free", label: t("product.glutenFree") },
    { value: "dairy-free", label: t("product.dairyFree") },
    { value: "local", label: t("product.local") },
    { value: "imported", label: t("product.imported") }
  ]

  // Handle tag toggle
  const toggleTag = (tag: ProductTag) => {
    setFilters(prev => {
      const currentTags = prev.tags || []
      return {
        ...prev,
        tags: currentTags.includes(tag)
          ? currentTags.filter(t => t !== tag)
          : [...currentTags, tag]
      }
    })
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      priceRange: [0, 100],
      tags: []
    })
  }

  // Apply filters and close panel
  const applyFilters = () => {
    onApplyFilters(filters)
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{t("filters.title")}</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Category filter */}
          <div className="space-y-2">
            <Label className="text-base font-medium">{t("filters.category")}</Label>
            <Select
              value={filters.categoryId || ""}
              onValueChange={(value) => setFilters(prev => ({ ...prev, categoryId: value || undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("filters.allCategories")}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {isRTL && category.nameAr ? category.nameAr : category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Price range filter */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">{t("filters.priceRange")}</Label>
              <span className="text-sm text-slate-500">
                ${filters.priceRange?.[0]} - ${filters.priceRange?.[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 100]}
              max={100}
              step={1}
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
              className="my-4"
            />
          </div>

          <Separator />

          {/* Rating filter */}
          <div className="space-y-4">
            <Label className="text-base font-medium">{t("filters.minRating")}</Label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <Button
                  key={rating}
                  variant={filters.minRating === rating ? "default" : "outline"}
                  size="sm"
                  className="h-10 w-10 p-0 rounded-full"
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    minRating: prev.minRating === rating ? undefined : rating 
                  }))}
                >
                  <div className="flex items-center">
                    {rating}
                    <Star className="h-3 w-3 ml-0.5" />
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Product tags */}
          <div className="space-y-4">
            <Label className="text-base font-medium">{t("filters.tags")}</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableTags.map(tag => (
                <div key={tag.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.value}`}
                    checked={(filters.tags || []).includes(tag.value)}
                    onCheckedChange={() => toggleTag(tag.value)}
                  />
                  <label
                    htmlFor={`tag-${tag.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tag.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional filters */}
          <div className="space-y-4">
            <Label className="text-base font-medium">{t("filters.additional")}</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, inStock: checked === true }))}
                />
                <label
                  htmlFor="in-stock"
                  className="text-sm font-medium leading-none"
                >
                  {t("filters.inStock")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="on-sale"
                  checked={filters.onSale}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, onSale: checked === true }))}
                />
                <label
                  htmlFor="on-sale"
                  className="text-sm font-medium leading-none"
                >
                  {t("filters.onSale")}
                </label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sort options */}
          <div className="space-y-2">
            <Label className="text-base font-medium">{t("filters.sortBy")}</Label>
            <Select
              value={filters.sortBy || ""}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value || undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.default")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("filters.default")}</SelectItem>
                <SelectItem value="price-asc">{t("filters.priceAsc")}</SelectItem>
                <SelectItem value="price-desc">{t("filters.priceDesc")}</SelectItem>
                <SelectItem value="rating-desc">{t("filters.ratingDesc")}</SelectItem>
                <SelectItem value="name-asc">{t("filters.nameAsc")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex flex-row gap-3 pt-2">
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            {t("filters.reset")}
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            <Check className="h-4 w-4 mr-2" />
            {t("filters.apply")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
