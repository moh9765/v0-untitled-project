"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { CartPreview } from "./cart-preview"

export function FloatingCart() {
  const { t, isRTL } = useLanguage()
  const { items, totalPrice } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  if (items.length === 0) {
    return null
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <>
      <div className="fixed bottom-20 right-4 z-20">
        <Button
          onClick={toggleCart}
          className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center relative"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        </Button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-30" onClick={toggleCart} />
          <CartPreview onClose={toggleCart} />
        </>
      )}

      <div className="fixed bottom-20 left-4 right-4 z-10 max-w-md mx-auto">
        <Button
          onClick={toggleCart}
          className="w-full h-12 rounded-full shadow-lg flex items-center justify-between px-4"
        >
          <span className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>
              {totalItems} {t("cart.items")}
            </span>
          </span>
          <span>${totalPrice.toFixed(2)}</span>
        </Button>
      </div>
    </>
  )
}
