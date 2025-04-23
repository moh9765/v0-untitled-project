"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { Package, MapPin, CheckCircle, XCircle, User } from "lucide-react"
import Link from "next/link"
import { getAvailableOrdersForDriver, updateOrder } from "@/lib/mock-orders"
import { toast } from "@/components/ui/use-toast"
import { mockOrders } from "@/lib/mock-orders"

// Define the Order type
type Order = {
  id: string
  pickupAddress: string
  deliveryAddress: string
  distance?: number
  packageDetails: string
  customerName: string
  status?: string
  driverName?: string
  driverPhone?: string
}

// Add these state variables at the top of the component
const initialAvailableOrders: Order[] = []
const initialDriverLocation = { lat: 40.7128, lng: -74.006 } // Default to NYC

// Mock data for active deliveries
const mockActiveDeliveriesData = [
  {
    id: "DEL-9012",
    status: "Picked Up",
    pickupAddress: "555 Madison Ave, New York",
    deliveryAddress: "777 Lexington Ave, New York",
    estimatedDelivery: "Today, 3:15 PM",
    customerName: "Alice Johnson",
  },
]

export default function DriverDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [mockActiveDeliveries, setMockActiveDeliveries] = useState(mockActiveDeliveriesData)
  const [availableOrders, setAvailableOrders] = useState<Order[]>(initialAvailableOrders)
  const [driverLocation, setDriverLocation] = useState(initialDriverLocation)

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const userRole = localStorage.getItem("user_role")
    const email = localStorage.getItem("user_email") || ""

    // Extract name from email (in a real app, you'd get this from the user profile)
    const name = email.split("@")[0]
    setUserName(name.charAt(0).toUpperCase() + name.slice(1))

    setIsAuthenticated(authStatus)
    setIsLoading(false)

    // Redirect if not authenticated or wrong role
    if (!authStatus || userRole !== "driver") {
      router.push("/auth/login?role=driver")
    }

    // In a real app, we would get the driver's location
    // For now, we'll use a mock location

    // Get available orders within 5km of the driver
    const orders = getAvailableOrdersForDriver(driverLocation.lat, driverLocation.lng, 5)
    setAvailableOrders(orders)
  }, [router, driverLocation, userName])

  const handleAcceptOrder = async (orderId: string) => {
    try {
      // Update the order status and assign the driver
      updateOrder(orderId, {
        status: "In Transit",
        driverName: userName,
        driverPhone: "+1 (555) 123-4567", // Mock phone number
      })

      // Refresh the available orders
      const updatedOrders = getAvailableOrdersForDriver(driverLocation.lat, driverLocation.lng, 5)
      setAvailableOrders(updatedOrders)

      // Refresh active deliveries
      const activeDelivery = mockActiveDeliveries.find((d) => d.id === orderId)
      if (!activeDelivery) {
        // Add to active deliveries if not already there
        const order = mockOrders.find((o) => o.id === orderId)
        if (order) {
          setMockActiveDeliveries([
            ...mockActiveDeliveries,
            {
              id: order.id,
              status: "Picked Up",
              pickupAddress: order.pickupAddress,
              deliveryAddress: order.deliveryAddress,
              estimatedDelivery: "Today, 3:15 PM",
              customerName: order.customerName,
            },
          ])
        }
      }

      toast({
        title: "Order accepted",
        description: "You have successfully accepted the delivery order.",
      })
    } catch (error) {
      toast({
        title: "Failed to accept order",
        description: "There was a problem accepting the order. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Replace the mockDeliveries array with this
  const [mockDeliveries, setMockDeliveries] = useState(
    availableOrders.map((order) => ({
      id: order.id,
      pickupAddress: order.pickupAddress,
      deliveryAddress: order.deliveryAddress,
      distance: order.distance || Math.floor(1 + Math.random() * 5),
      estimatedTime: `${Math.floor(10 + Math.random() * 20)} min`,
      packageDetails: order.packageDetails,
      customerName: order.customerName,
    })),
  )

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
          <MobileNav role="driver" />
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium">Hi, {userName}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        </div>

        {/* Active deliveries */}
        {mockActiveDeliveries.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Active Deliveries</h2>
            <div className="grid gap-4">
              {mockActiveDeliveries.map((delivery) => (
                <Card key={delivery.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{delivery.id}</CardTitle>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        {delivery.status}
                      </span>
                    </div>
                    <CardDescription>Estimated delivery: {delivery.estimatedDelivery}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid gap-2">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium">From: {delivery.pickupAddress}</p>
                          <p className="font-medium">To: {delivery.deliveryAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-slate-500" />
                        <span>Customer: {delivery.customerName}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button asChild className="flex-1">
                        <Link href={`/driver/navigation?id=${delivery.id}`}>Navigate</Link>
                      </Button>
                      <Button variant="outline" asChild className="flex-1">
                        <Link href={`/driver/deliveries?id=${delivery.id}`}>Update Status</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Available deliveries */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Available Deliveries</h2>
          {availableOrders.length > 0 ? (
            <div className="grid gap-4">
              {availableOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{order.distance} km</span>
                        <span className="text-xs text-slate-500">({Math.floor(order.distance * 5)} min)</span>
                      </div>
                    </div>
                    <CardDescription>Package: {order.packageDetails}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid gap-2">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium">From: {order.pickupAddress}</p>
                          <p className="font-medium">To: {order.deliveryAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-slate-500" />
                        <span>Customer: {order.customerName}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleAcceptOrder(order.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No available deliveries at the moment</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  )
}
