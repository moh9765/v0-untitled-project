"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Heart, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types/product"
import { useFavorites } from "@/hooks/useFavorites"

interface ProductCardProps {
  product: Product
  layout?: "grid" | "list"
}


export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const { t, isRTL } = useLanguage()
  const { addToCart } = useCart()
  const [isImageLoaded, setIsImageLoaded] = useState(false)
    const { toggleFavorite, favorites } = useFavorites()

  const isGrid = layout === "grid"
  const displayName = isRTL && product.nameAr ? product.nameAr : product.name || "Unnamed Product"
  const displayDescription = isRTL && product.descriptionAr ? product.descriptionAr : product.description || "No description available"

  const isFavorited = favorites.some(f =>
    f.type === "product" && f.id === product.id
  )
  const handleToggleFavorite = (e: React.MouseEvent) => {
  e.stopPropagation()
  toggleFavorite({
    ...product,
    type: "product"
  })
}
  const handleAddToCart = () => {
    addToCart(product, 1)
  }




  return (
    <Card
      className={`overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl ${isGrid ? "" : "flex"} cursor-default backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-white/20 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:translate-y-[-2px]`}
    >
      <div className={`relative ${isGrid ? "w-full" : "w-1/3"}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.thumbnail || "/placeholder.svg"}
            alt={displayName}
            fill
            className={`object-cover transition-all duration-300 ${isImageLoaded ? "blur-0" : "blur-sm scale-110"}`}
            onLoad={() => setIsImageLoaded(true)}
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
          />
        </div>

        {product.discount && (
          <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground rounded-full">
            {product.discount}% {t("common.off")}
          </Badge>
        )}

        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {product.tags.includes("vegan") && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 rounded-full">
              {t("product.vegan")}
            </Badge>
          )}
          {product.tags.includes("organic") && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 rounded-full">
              {t("product.organic")}
            </Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white rounded-full"
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
      </div>

      <CardContent className={`p-3 ${isGrid ? "" : "w-2/3"} bg-transparent`}>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium line-clamp-2 text-foreground">{displayName}</h3>
          <div className="flex items-center ml-2 shrink-0">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm">{product.rating || "N/A"}</span>
          </div>
        </div>

        {!isGrid && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-2">
            {displayDescription}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline">
            <span className="font-semibold text-primary">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-slate-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
            )}
            <span className="text-xs text-slate-500 ml-1">/{product.unit || "unit"}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full bg-primary/10 hover:bg-primary/20"
            onClick={handleAddToCart}
          >
            <Plus className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}