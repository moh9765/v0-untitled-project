import { useCart as useCartContext } from "@/contexts/cart-context"

export function useCart() {
  return useCartContext()
}
