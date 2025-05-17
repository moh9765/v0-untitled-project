"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ShoppingBag, MapPin, ChevronDown, AlertCircle } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AddressSelector } from "@/components/address-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAddress } from "@/lib/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Checkout() {
  const { items, subtotal } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null)
  const [addressSectionComplete, setAddressSectionComplete] = useState(false)
  const [showAddressError, setShowAddressError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get user email from localStorage
    const email = localStorage.getItem("user_email")
    setUserEmail(email)
  }, [])

  const handleAddressSelected = (address: UserAddress) => {
    setSelectedAddress(address)
    setShowAddressError(false)
  }

  const handleContinue = () => {
    if (!selectedAddress) {
      setShowAddressError(true)
      return
    }

    setAddressSectionComplete(true)
    setShowAddressError(false)
  }

  const placeOrder = async () => {
    if (items.length === 0) return

    // Validate address selection
    if (!selectedAddress) {
      setShowAddressError(true)
      setAddressSectionComplete(false)

      toast({
        title: "Address Required",
        description: "Please select or add a delivery address",
        variant: "destructive",
      })

      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: userEmail || "",
          driver_id: null,
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
          address: selectedAddress
        }),
      });

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.")
      }

      toast({
        title: "Order Placed",
        description: `Order #${data.order_id} confirmed.`,
      })

      router.push(`/customer/track?id=${data.order_id}`)
    } catch (error: any) {
      console.error("Checkout error:", error.message)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center text-center py-10 text-muted-foreground">
          <ShoppingBag className="w-12 h-12 mb-4" />
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <>
          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <span>
                      ${(item.quantity * item.product.price).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between font-medium text-lg mt-4 pt-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Address
                {selectedAddress && addressSectionComplete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-xs"
                    onClick={() => setAddressSectionComplete(false)}
                  >
                    Change
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!addressSectionComplete ? (
                <>
                  {showAddressError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Required</AlertTitle>
                      <AlertDescription>
                        Please select or add a delivery address to continue
                      </AlertDescription>
                    </Alert>
                  )}

                  {userEmail ? (
                    <AddressSelector
                      userId={userEmail}
                      onAddressSelected={handleAddressSelected}
                      selectedAddressId={selectedAddress?.id}
                    />
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Loading...</p>
                    </div>
                  )}

                  <Button
                    onClick={handleContinue}
                    className="w-full mt-4"
                    disabled={!selectedAddress}
                  >
                    Continue
                  </Button>
                </>
              ) : (
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-medium">
                    {selectedAddress?.street_address}
                    {selectedAddress?.apartment ? `, ${selectedAddress.apartment}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.zip_code}
                  </p>
                  {selectedAddress?.special_instructions && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Note: {selectedAddress.special_instructions}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Confirmation */}
          {addressSectionComplete && (
            <Button
              onClick={placeOrder}
              disabled={loading || !selectedAddress}
              className="w-full"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          )}
        </>
      )}

      <BottomNavigation />
    </div>
  )
}
