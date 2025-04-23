"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types/product"

interface ProductCardProps {
  product: Product
  layout?: "grid" | "list"
}

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const { t, isRTL } = useLanguage()
  const { addToCart } = useCart()
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const isGrid = layout === "grid"

  return (
    <Link href={`/product/${product.id}`}>
      <Card className={`overflow-hidden hover:shadow-md transition-shadow rounded-xl ${isGrid ? "" : "flex"}`}>
        <div className={`relative ${isGrid ? "w-full" : "w-1/3"}`}>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.thumbnail || "/placeholder.svg"}
              alt={isRTL && product.nameAr ? product.nameAr : product.name}
              fill
              className={`object-cover transition-all duration-300 ${isImageLoaded ? "blur-0" : "blur-sm scale-110"}`}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>

          {/* Discount badge */}
          {product.discount && (
            <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground rounded-full">
              {product.discount}% {t("common.off")}
            </Badge>
          )}

          {/* Tags */}
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

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white rounded-full"
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
          </Button>
        </div>

        <CardContent className={`p-3 ${isGrid ? "" : "w-2/3"}`}>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium line-clamp-2">{isRTL && product.nameAr ? product.nameAr : product.name}</h3>
            <div className="flex items-center ml-2 shrink-0">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm">{product.rating}</span>
            </div>
          </div>

          {!isGrid && (
            <p className="text-sm text-slate-500 line-clamp-2 mb-2">
              {isRTL && product.descriptionAr ? product.descriptionAr : product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline">
              <span className="font-semibold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-slate-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
              )}
              <span className="text-xs text-slate-500 ml-1">/{product.unit}</span>
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
    </Link>
  )
}
