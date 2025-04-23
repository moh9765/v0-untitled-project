"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types/product"
import { useTranslation } from "@/contexts/language-context"
import Image from "next/image"
import { Minus, Plus, Star } from "lucide-react"

interface ProductDetailsSheetProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  userId?: string | null
}

export function ProductDetailsSheet({ product, isOpen, onClose, userId }: ProductDetailsSheetProps) {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1)
  }, [product])

  // Track user behavior when viewing product details
  useEffect(() => {
    if (isOpen && product && userId) {
      try {
        fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            eventType: "view_product",
            data: {
              productId: product.id,
              categoryId: product.categoryId,
              subcategoryId: product.subcategoryId,
              tags: product.tags,
            },
          }),
        }).catch((err) => {
          console.error("Error tracking product view:", err)
          // Silently fail - tracking errors shouldn't affect the user experience
        })
      } catch (error) {
        console.error("Error tracking product view:", error)
      }
    }
  }, [isOpen, product, userId])

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity,
      })

      // Track user behavior when adding to cart
      if (userId) {
        try {
          fetch("/api/track", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              eventType: "add_to_cart",
              data: {
                productId: product.id,
                quantity,
                categoryId: product.categoryId,
                subcategoryId: product.subcategoryId,
                tags: product.tags,
              },
            }),
          }).catch((err) => {
            console.error("Error tracking add to cart:", err)
            // Silently fail - tracking errors shouldn't affect the user experience
          })
        } catch (error) {
          console.error("Error tracking add to cart:", error)
        }
      }

      onClose()
    }
  }

  if (!product) return null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-xl overflow-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{product.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div className="relative h-64 w-full overflow-hidden rounded-lg">
            <Image
              src={product.image || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm font-medium">{product.rating}</span>
              <span className="ml-1 text-sm text-gray-500">
                ({product.reviews} {t("reviews")})
              </span>
            </div>
            <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
          </div>

          <p className="text-gray-700">{product.description}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                aria-label={t("Decrease quantity")}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                aria-label={t("Increase quantity")}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={handleAddToCart} className="px-6">
              {t("Add to Cart")} - ${(product.price * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
