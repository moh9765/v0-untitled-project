"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useFavorites } from "@/hooks/useFavorites"
import type { Product } from "@/lib/types/product"

interface ProductDetailsSheetProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailsSheet({
  product,
  isOpen,
  onClose
}: ProductDetailsSheetProps) {
  const { t, isRTL } = useLanguage()
  const { toggleFavorite, favorites } = useFavorites()

  // Determine which text to display based on language
  const displayName = isRTL && product.nameAr ? product.nameAr : product.name
  const displayDescription = isRTL && product.descriptionAr ? product.descriptionAr : product.description

  // Check if product is in favorites
  const isFavorited = favorites.some(f =>
    f.type === "product" && f.id === product.id
  )

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    toggleFavorite({
      ...product,
      type: "product"
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-sm"
        dir={isRTL ? "rtl" : "ltr"}  // Set text direction
      >
        <DialogHeader className={`${isRTL ? "text-right" : "text-left"} flex items-center justify-between`}>
          <DialogTitle>{displayName}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleToggleFavorite}
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${
                isFavorited
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-slate-600 hover:scale-110"
              }`}
            />
          </Button>
        </DialogHeader>

        <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
          <div className="relative w-full h-48 rounded overflow-hidden">
            <Image
              src={product.thumbnail || "/placeholder.jpg"}
              alt={displayName}
              fill
              className="object-cover"
              priority
            />
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            {displayDescription}
          </p>

          <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className="text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
              {product.originalPrice && (
                <span className="text-sm text-slate-500 line-through ml-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </span>

            <Button onClick={() => console.log("Add to cart", product.id)}>
              {t("product.add_to_cart")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}