"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Product } from "@/lib/types/product"
import { useRecommendations } from "@/hooks/use-recommendations"

export type CartItem = {
  product: Product
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  checkout: () => Promise<boolean>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[]
        setItems(parsedCart)
      } catch (e) {
        console.error("Failed to parse saved cart", e)
      }
    }
  }, [])

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))

    // Calculate item count and subtotal
    const count = items.reduce((total, item) => total + item.quantity, 0)
    const total = items.reduce((total, item) => total + item.product.price * item.quantity, 0)

    setItemCount(count)
    setSubtotal(total)
  }, [items])

  const addToCart = (product: Product, quantity: number) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id)

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, { product, quantity }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity }
        }
        return item
      })
    })
  }

  const clearCart = () => {
    setItems([])
  }

  const userId = typeof window !== "undefined" ? localStorage.getItem("user_email") : null
  const { trackUserBehavior } = useRecommendations(userId)

  const checkout = useCallback(async () => {
    // Process the checkout (in a real app, this would call an API)

    // Track purchases for recommendation system
    for (const item of items) {
      await trackUserBehavior("purchase", {
        productId: item.product.id,
        categoryId: item.product.categoryId,
        subcategoryId: item.product.subcategoryId,
        quantity: item.quantity,
        tags: item.product.tags,
      })
    }

    // Clear the cart after successful checkout
    clearCart()

    return true
  }, [items, trackUserBehavior])

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
