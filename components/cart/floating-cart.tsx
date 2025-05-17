"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useLanguage } from "@/contexts/language-context"
import { CartPreview } from "./cart-preview"

export function FloatingCart() {
  const { items } = useCart()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const totalItems = items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0)
  const totalPrice = items.reduce((acc, item) => {
    const price = Number(item.product?.price) || 0
    const quantity = Number(item.quantity) || 0
    return acc + price * quantity
  }, 0)

  // Detect item added
  useEffect(() => {
    if (totalItems > 0) {
      setJustAdded(true)
      const timer = setTimeout(() => setJustAdded(false), 3000) // Animate for 3s
      return () => clearTimeout(timer)
    }
  }, [totalItems])

  const toggleCart = () => setIsOpen((prev) => !prev)

  if (totalItems === 0) return null

  return (
    <>
      <AnimatePresence>
        {justAdded && (
          <motion.div
            key="cart-bar"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 max-w-md w-[90%]"
          >
            <motion.div
              animate={{ scale: 1, x: 0, y: 0 }}
              exit={{ scale: 0.5, x: 160, y: 100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="bg-green-600 text-white rounded-full p-3 shadow-lg flex items-center justify-between px-6 cursor-pointer"
              onClick={toggleCart}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5" />
                <span>{totalItems} {t("cart.items")}</span>
              </div>
              <span className="font-bold">${totalPrice.toFixed(2)}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner Cart Icon */}
      <motion.div
        className="fixed bottom-5 right-5 z-50"
        animate={{ scale: isOpen ? 1.1 : 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05, y: -2 }}
      >
        <Button
          onClick={toggleCart}
          className="h-16 w-16 rounded-full relative backdrop-blur-md bg-primary/80 text-white border border-white/20 shadow-[0_0_15px_rgba(46,125,50,0.5)] hover:shadow-[0_0_20px_rgba(46,125,50,0.7)] transition-all duration-300"
        >
          <ShoppingCart className="h-7 w-7" />
          <motion.span
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border border-white/30"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={totalItems} // This forces animation to run when totalItems changes
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {totalItems}
          </motion.span>
        </Button>
      </motion.div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleCart} />
          <CartPreview isOpen={isOpen} onClose={toggleCart} />
        </>
      )}
    </>
  )
}
