"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ActionButton } from "@/components/ui/action-button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface CartPreviewProps {
  isOpen: boolean
  onClose: () => void
}

export function CartPreview({ isOpen, onClose }: CartPreviewProps) {
  const { t, isRTL } = useLanguage()
  const { items, subtotal, updateQuantity, removeFromCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const cartRef = useRef<HTMLDivElement>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const confirmOrder = async () => {
    if (!items || items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before confirming.",
        variant: "destructive",
      })
      return
    }
    setIsConfirming(true)
    try {
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
      await new Promise((resolve) => setTimeout(resolve, 1000))
      for (const item of items) removeFromCart(item.product.id)
      toast({
        title: "Order Confirmed!",
        description: `Your order #${orderId} has been placed successfully.`,
      })
      onClose()
      router.push(`/customer/track?id=${orderId}`)
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was a problem placing your order.",
        variant: "destructive",
      })
    } finally {
      setIsConfirming(false)
    }
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Empty Promo Code",
        description: "Please enter a promo code.",
        variant: "destructive",
      })
      return
    }
    setIsApplyingPromo(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      if (promoCode.toUpperCase() === "DISCOUNT10") {
        toast({ title: "Promo Code Applied!", description: "You got 10% discount." })
      } else {
        toast({ title: "Invalid Promo Code", description: "Code invalid or expired.", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to apply promo code.", variant: "destructive" })
    } finally {
      setIsApplyingPromo(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            ref={cartRef}
            initial={{ y: 100, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-0 ${isRTL ? "left-0" : "right-0"} z-50 w-full max-w-md h-[85vh] bg-white dark:bg-slate-950 rounded-t-xl shadow-xl p-4 overflow-y-auto`}
          >
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-semibold">{t("cart.yourCart")}</h2>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close cart">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {!items || items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-500 dark:text-slate-400 mb-4">{t("cart.empty")}</p>
                <Button asChild onClick={onClose}>
                  <Link href="/marketplace">{t("cart.startShopping")}</Link>
                </Button>
              </div>
            ) : (
              <>
                <ul className="space-y-4 mt-4">
                  {items.map((item) => (
                    <li key={item.product.id} className="flex gap-3">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={item.product.thumbnail || "/placeholder.svg?height=80&width=80"}
                          alt={isRTL && item.product.nameAr ? item.product.nameAr : item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium">
                          <h3>{isRTL && item.product.nameAr ? item.product.nameAr : item.product.name}</h3>
                          <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          ${item.product.price.toFixed(2)} / {item.product.unit}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.product.id, Math.max(1, Number.parseInt(e.target.value) || 1))
                              }
                              className="h-8 w-12 border-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              aria-label="Item quantity"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-8"
                            onClick={() => removeFromCart(item.product.id)}
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            {t("cart.remove")}
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t mt-4 pt-4 space-y-4">
                  <div className="flex justify-between text-base font-medium">
                    <p>{t("cart.subtotal")}</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <Input
                      placeholder={t("cart.promoCode")}
                      className="rounded-r-none"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <ActionButton
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      onClick={handleApplyPromo}
                      isLoading={isApplyingPromo}
                      loadingText="Applying..."
                    >
                      {t("cart.apply")}
                    </ActionButton>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 gap-2">
                    <ActionButton
                      onClick={confirmOrder}
                      className="w-full flex items-center justify-center"
                      isLoading={isConfirming}
                      loadingText="Processing..."
                      trackingId="confirm-order"
                      analyticsEvent="order_confirmation"
                    >
                      Confirm Order
                      <ShoppingBag className="ml-2 h-4 w-4" />
                    </ActionButton>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/checkout" className="flex items-center justify-center">
                      Go to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
