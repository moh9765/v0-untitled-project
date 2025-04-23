"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MobileNav } from "@/components/mobile-nav"
import { ArrowLeft, Loader2, MapPin, Package } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { addOrder } from "@/lib/mock-orders"

export default function NewDeliveryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    packageDetails: "",
    notes: "",
    preferredTime: "",
  })

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const userRole = localStorage.getItem("user_role")
    const userName = localStorage.getItem("user_name")

    setIsAuthenticated(authStatus)
    setIsLoading(false)
    setUserName(userName)

    // Redirect if not authenticated or wrong role
    if (!authStatus || userRole !== "customer") {
      router.push("/auth/login?role=customer")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Generate a random order ID
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`

      // Create a new order
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        status: "Pending" as const,
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        packageDetails: formData.packageDetails,
        notes: formData.notes,
        estimatedDelivery: "Estimating...",
        customerName: userName || "Customer",
        customerPhone: "+1 (555) 987-6543", // Mock phone number
        price: Math.floor(10 + Math.random() * 30), // Random price between 10 and 40
        distance: Math.floor(1 + Math.random() * 5), // Random distance between 1 and 6 km
      }

      // Add the order to our mock database
      addOrder(newOrder)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Delivery request submitted",
        description: "Your delivery request has been successfully submitted.",
      })

      // Redirect to dashboard
      router.push("/customer/dashboard")
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your delivery request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="flex h-16 items-center px-4">
          <MobileNav role="customer" />
          <div className="ml-4 flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-medium">New Delivery</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Create a new delivery request</CardTitle>
              <CardDescription>Fill in the details for your delivery request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Pickup Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="pickupAddress"
                    name="pickupAddress"
                    placeholder="Enter pickup address"
                    className="pl-9"
                    required
                    value={formData.pickupAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="deliveryAddress"
                    name="deliveryAddress"
                    placeholder="Enter delivery address"
                    className="pl-9"
                    required
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packageDetails">Package Details</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="packageDetails"
                    name="packageDetails"
                    placeholder="What are you sending?"
                    className="pl-9"
                    required
                    value={formData.packageDetails}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Delivery Time</Label>
                <Input
                  id="preferredTime"
                  name="preferredTime"
                  type="datetime-local"
                  required
                  value={formData.preferredTime}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any special instructions for the delivery"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Delivery Request"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
