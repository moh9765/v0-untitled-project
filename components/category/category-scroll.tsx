"use client"

import { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { productCategories } from "@/lib/mock-data/products"
import type { ProductCategory } from "@/lib/types/product"
import type { ProductSubcategory } from "@/lib/types/product"

interface CategoryScrollProps {
  selectedCategory?: string
  onCategoryChange?: (categoryId: string) => void
  selectedSubcategory?: string
  onSubcategoryChange?: (subcategoryId: string) => void
  categories: ProductCategory[];
}

export function CategoryScroll({
  selectedCategory,
  onCategoryChange,
  selectedSubcategory,
  onSubcategoryChange,
}: CategoryScrollProps) {
  const { t, isRTL } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [subcategories, setSubcategories] = useState<ProductSubcategory[]>([])

  // Update subcategories when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = productCategories.find((c) => c.id === selectedCategory)
      setSubcategories(category?.subcategories || [])
    } else {
      setSubcategories([])
    }
  }, [selectedCategory])

  // Check if arrows should be shown
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScroll)
      checkScroll()
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", checkScroll)
      }
    }
  }, [])

  // Scroll to selected category
  useEffect(() => {
    if (selectedCategory && scrollRef.current) {
      const categoryElement = document.getElementById(`category-${selectedCategory}`)
      if (categoryElement) {
        const scrollLeft = categoryElement.offsetLeft - scrollRef.current.offsetLeft - 16
        scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" })
      }
    }
  }, [selectedCategory])

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const { clientWidth } = scrollRef.current
    const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  const handleCategoryClick = (categoryId: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId)
    }
  }

  const handleSubcategoryClick = (subcategoryId: string) => {
    if (onSubcategoryChange) {
      onSubcategoryChange(subcategoryId)
    }
  }

  return (
    <div className="relative">
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 shadow-md"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      <div className="flex items-center mb-4">
        <div ref={scrollRef} className="flex overflow-x-auto py-2 px-1 space-x-2 hide-scrollbar">
          {Array.isArray(productCategories) && productCategories.length > 0 ? (
            productCategories.map((category: ProductCategory) => (
              <Button
                key={category.id}
                id={`category-${category.id}`}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`whitespace-nowrap ${selectedCategory === category.id ? "font-bold" : ""}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {isRTL && category.nameAr ? category.nameAr : category.name}
              </Button>
            ))
          ) : (
            <span className="text-slate-400">No categories</span>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2 flex-shrink-0">
              {t("categories.more")}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {Array.isArray(productCategories) && productCategories.length > 0 ? (
              productCategories.map((category: ProductCategory) => (
                <DropdownMenuItem
                  key={category.id}
                  className={selectedCategory === category.id ? "font-bold bg-muted" : ""}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {isRTL && category.nameAr ? category.nameAr : category.name}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No categories</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 shadow-md"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

      {subcategories.length > 0 && (
        <div className="flex overflow-x-auto py-1 space-x-2 hide-scrollbar">
          {subcategories.map((subcategory) => (
            <Button
              key={subcategory.id}
              variant={selectedSubcategory === subcategory.id ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap rounded-full ${
                selectedSubcategory === subcategory.id ? "font-medium" : ""
              }`}
              onClick={() => handleSubcategoryClick(subcategory.id)}
            >
              {isRTL && subcategory.nameAr ? subcategory.nameAr : subcategory.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
