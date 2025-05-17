"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Package,
  MapPin,
  CheckCircle,
  XCircle,
  User,
  Bell,
  AlertTriangle,
  Clock,
  DollarSign,
  Loader2,
  Wallet,
  Navigation,
  MessageSquare,
  Globe
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import Link from "next/link"
import { getAvailableOrdersForDriver, updateOrder } from "@/lib/mock-orders"
import { toast } from "@/components/ui/use-toast"
import { mockOrders } from "@/lib/mock-orders"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChatDialog, Message } from "@/components/chat/chat-dialog"
import { getMessagesForOrder, sendMessage } from "@/lib/mock-chat"

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
  price?: number
  estimatedTime?: string
  created_at?: string
  total_amount?: number
  payment_method?: string
  priority?: 'normal' | 'high' | 'urgent'
  customerPhone?: string
  customerEmail?: string
}

// Add these state variables at the top of the component
const initialAvailableOrders: Order[] = []
const initialDriverLocation = { lat: 40.7128, lng: -74.006 } // Default to NYC

// Mock data for active deliveries
const mockActiveDeliveriesData = [

]

export default function DriverDashboard() {
  const router = useRouter()
  const { t, dir, isRTL } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [activeDeliveries, setActiveDeliveries] = useState<Order[]>([])
  const [availableOrders, setAvailableOrders] = useState<Order[]>(initialAvailableOrders)
  const [broadcastedOrders, setBroadcastedOrders] = useState<Order[]>([])
  const [pendingOrders, setPendingOrders] = useState<Order[]>([])
  const [driverLocation, setDriverLocation] = useState(initialDriverLocation)
  const [activeTab, setActiveTab] = useState("nearby")
  const [isFetchingBroadcasts, setIsFetchingBroadcasts] = useState(false)
  const [isFetchingPending, setIsFetchingPending] = useState(false)
  const [isFetchingActive, setIsFetchingActive] = useState(false)
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null)
  const [lastBroadcastCheck, setLastBroadcastCheck] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [earnings, setEarnings] = useState({ today: 0, week: 0, total: 0 })
  const [locationName, setLocationName] = useState("Current Location")

  // Chat related state
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentChatOrderId, setCurrentChatOrderId] = useState<string | null>(null)
  const [currentChatCustomerName, setCurrentChatCustomerName] = useState("")
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  // Define fetchBroadcastedOrders at the component level
  const fetchBroadcastedOrders = useCallback(async (silent = false) => {
    if (!userId) return

    if (!silent) {
      setIsFetchingBroadcasts(true)
    }

    try {
      const response = await fetch(`/api/orders/broadcast?driver_id=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.orders && Array.isArray(data.orders)) {
          // Convert the API response to our Order type
          const formattedOrders: Order[] = data.orders.map((order: any) => ({
            id: order.id.toString(),
            pickupAddress: order.pickup_address || "Unknown pickup location",
            deliveryAddress: order.delivery_address?.street_address || "Unknown delivery location",
            packageDetails: order.package_details || "Package details not available",
            customerName: order.customer_name || "Customer",
            distance: order.distance || Math.floor(1 + Math.random() * 5),
            status: order.status,
            total_amount: order.total_amount,
            created_at: order.created_at,
            payment_method: order.payment_method || "Cash",
            estimatedTime: `${Math.floor(5 + Math.random() * 15)} min`,
            priority: order.priority || "normal"
          }))

          // Check if we have new orders
          if (broadcastedOrders.length < formattedOrders.length && lastBroadcastCheck) {
            // Only show notification if this isn't the first load
            toast({
              title: "New broadcast order available!",
              description: "You have a new delivery opportunity.",
              variant: "default",
            })

            // Switch to the broadcasted tab if there are new orders
            if (formattedOrders.length > 0) {
              setActiveTab("broadcasted")
            }
          }

          setBroadcastedOrders(formattedOrders)
          setLastBroadcastCheck(new Date())
        }
      }
    } catch (error) {
      console.error("Error fetching broadcasted orders:", error)
    } finally {
      if (!silent) {
        setIsFetchingBroadcasts(false)
      }
    }
  }, [userId, broadcastedOrders.length, lastBroadcastCheck, toast, setActiveTab, setIsFetchingBroadcasts, setBroadcastedOrders, setLastBroadcastCheck])

  // Define fetchPendingOrders at the component level
  const fetchPendingOrders = useCallback(async (silent = false) => {
    if (!userId) return

    if (!silent) {
      setIsFetchingPending(true)
    }

    try {
      const response = await fetch('/api/orders/pending')
      if (response.ok) {
        const data = await response.json()
        if (data.orders && Array.isArray(data.orders)) {
          // Convert the API response to our Order type
          const formattedOrders: Order[] = data.orders.map((order: any) => ({
            id: order.id.toString(),
            pickupAddress: order.pickup_address || "Unknown pickup location",
            deliveryAddress: order.delivery_address?.street_address || "Unknown delivery location",
            packageDetails: order.package_details || "Package details not available",
            customerName: order.customer_name || "Customer",
            distance: order.distance || Math.floor(1 + Math.random() * 5),
            status: order.status,
            total_amount: order.total_amount,
            created_at: order.created_at,
            payment_method: order.payment_method || "Cash",
            estimatedTime: `${Math.floor(5 + Math.random() * 15)} min`,
            priority: order.priority || "normal"
          }))

          setPendingOrders(formattedOrders)
        }
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error)
    } finally {
      if (!silent) {
        setIsFetchingPending(false)
      }
    }
  }, [userId, setIsFetchingPending, setPendingOrders])

  // Define fetchActiveDeliveries at the component level
  const fetchActiveDeliveries = useCallback(async (silent = false) => {
    if (!userId) return

    if (!silent) {
      setIsFetchingActive(true)
    }

    try {
      const response = await fetch(`/api/orders/driver?driver_id=${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.orders && Array.isArray(data.orders)) {
          // Convert the API response to our Order type
          const formattedOrders: Order[] = data.orders.map((order: any) => ({
            id: order.id.toString(),
            pickupAddress: order.pickup_address || "Unknown pickup location",
            deliveryAddress: order.delivery_address?.street_address || "Unknown delivery location",
            packageDetails: order.package_details || "Package details not available",
            customerName: order.customer_name || "Customer",
            distance: order.distance || Math.floor(1 + Math.random() * 5),
            status: order.status,
            total_amount: order.total_amount,
            created_at: order.created_at,
            payment_method: order.payment_method || "Cash",
            estimatedTime: `${Math.floor(5 + Math.random() * 15)} min`,
            estimatedDelivery: "Today, " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          }))

          // Filter out delivered and cancelled orders
          const activeOrders = formattedOrders.filter(
            order => order.status !== 'delivered' && order.status !== 'cancelled'
          )

          setActiveDeliveries(activeOrders)
        }
      }
    } catch (error) {
      console.error("Error fetching active deliveries:", error)
    } finally {
      if (!silent) {
        setIsFetchingActive(false)
      }
    }
  }, [userId, setIsFetchingActive, setActiveDeliveries])

  // Function to toggle online status
  const toggleOnlineStatus = async () => {
    try {
      // In a real app, this would update the driver's status in the database
      setIsOnline(!isOnline)

      toast({
        title: isOnline ? "You are now offline" : "You are now online",
        description: isOnline
          ? "You won't receive new order requests"
          : "You'll now receive order requests",
        variant: isOnline ? "destructive" : "default",
      })

      // In a real implementation, we would make an API call here
      // For now, we'll just simulate the behavior
      if (!isOnline) {
        // If going online, refresh available orders
        const orders = getAvailableOrdersForDriver(driverLocation.lat, driverLocation.lng, 5)
        setAvailableOrders(orders)
        fetchBroadcastedOrders()
        fetchPendingOrders()
        fetchActiveDeliveries()
      } else {
        // If going offline, clear available orders
        setAvailableOrders([])
        setBroadcastedOrders([])
        setPendingOrders([])
        setActiveDeliveries([])
      }
    } catch (error) {
      console.error("Error toggling online status:", error)
      toast({
        title: "Error",
        description: "Failed to update your status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to fetch driver earnings
  const fetchDriverEarnings = async (driverId: string) => {
    try {
      // In a real app, this would fetch from the API
      // For now, we'll use mock data
      setEarnings({
        today: 45.50,
        week: 325.75,
        total: 1250.00
      })

      // Simulate getting the current location
      setLocationName("Downtown, New York")
    } catch (error) {
      console.error("Error fetching earnings:", error)
    }
  }

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const userRole = localStorage.getItem("user_role")
    const email = localStorage.getItem("user_email") || ""

    // Extract name from email (in a real app, you'd get this from the user profile)
    const name = email.split("@")[0]
    setUserName(name.charAt(0).toUpperCase() + name.slice(1))

    // Get user ID from localStorage (for API calls)
    const storedUserId = localStorage.getItem("user_id")
    setUserId(storedUserId)

    setIsAuthenticated(authStatus)
    setIsLoading(false)

    // Redirect if not authenticated or wrong role
    if (!authStatus || userRole !== "driver") {
      router.push("/auth/login?role=driver")
      return
    }

    // In a real app, we would get the driver's location
    // For now, we'll use a mock location

    // Get available orders within 5km of the driver
    const orders = getAvailableOrdersForDriver(driverLocation.lat, driverLocation.lng, 5)
    setAvailableOrders(orders)

    // Fetch driver earnings if we have a user ID
    if (storedUserId) {
      fetchDriverEarnings(storedUserId)
    }

    // Get the driver's online status from localStorage or default to online
    const savedOnlineStatus = localStorage.getItem("driver_online_status")
    if (savedOnlineStatus !== null) {
      setIsOnline(savedOnlineStatus === "true")
    }
  }, [router, driverLocation])

  // Separate useEffect for fetching broadcast orders
  useEffect(() => {
    if (!userId || !isAuthenticated || !isOnline) return

    // Initial fetch
    fetchBroadcastedOrders()

    // Set up polling for broadcast orders every 30 seconds
    const broadcastInterval = setInterval(() => {
      fetchBroadcastedOrders(true) // Silent update
    }, 30000)

    return () => {
      clearInterval(broadcastInterval)
    }
  }, [userId, isAuthenticated, isOnline, fetchBroadcastedOrders])

  // Separate useEffect for fetching pending orders
  useEffect(() => {
    if (!userId || !isAuthenticated || !isOnline) return

    // Initial fetch
    fetchPendingOrders()

    // Set up polling for pending orders every 30 seconds
    const pendingInterval = setInterval(() => {
      fetchPendingOrders(true) // Silent update
    }, 30000)

    return () => {
      clearInterval(pendingInterval)
    }
  }, [userId, isAuthenticated, isOnline, fetchPendingOrders])

  // Separate useEffect for fetching active deliveries
  useEffect(() => {
    if (!userId || !isAuthenticated) return

    // Initial fetch
    fetchActiveDeliveries()

    // Set up polling for active deliveries every 30 seconds
    const activeInterval = setInterval(() => {
      fetchActiveDeliveries(true) // Silent update
    }, 30000)

    return () => {
      clearInterval(activeInterval)
    }
  }, [userId, isAuthenticated, fetchActiveDeliveries])

  // Save online status to localStorage when it changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("driver_online_status", isOnline.toString())
    }
  }, [isOnline, isAuthenticated])

  // Chat related functions
  const handleOpenChat = (orderId: string, customerName: string) => {
    setCurrentChatOrderId(orderId)
    setCurrentChatCustomerName(customerName)
    setChatMessages(getMessagesForOrder(orderId))
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
  }

  const handleSendMessage = async (text: string) => {
    if (!currentChatOrderId) return

    setIsSendingMessage(true)
    try {
      const newMessage = await sendMessage(currentChatOrderId, text, 'driver')
      setChatMessages(getMessagesForOrder(currentChatOrderId))

      toast({
        title: "Message sent",
        description: "Your message has been sent to the customer.",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Failed to send message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleAcceptOrder = async (orderId: string, isBroadcasted = false) => {
    try {
      // Set the processing state to show loading indicator
      setProcessingOrderId(orderId);

      if (isBroadcasted && userId) {
        // For broadcasted orders, use the API
        const response = await fetch('/api/orders/broadcast/accept', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: orderId,
            driver_id: userId
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to accept broadcasted order');
        }

        // Find and remove the order from broadcasted orders

        // Remove the order from broadcasted orders
        setBroadcastedOrders(prev => prev.filter(order => order.id.toString() !== orderId.toString()));

        // Refresh active deliveries after a short delay
        setTimeout(() => {
          fetchActiveDeliveries(true);
        }, 1000);

        // Refresh the broadcast orders list after a short delay
        setTimeout(() => {
          fetchBroadcastedOrders(true);
        }, 1000);
      } else {
        // For regular nearby orders, use the mock function
        updateOrder(orderId, {
          status: "In Transit",
          driverName: userName,
          driverPhone: "+1 (555) 123-4567", // Mock phone number
        });

        // Refresh the available orders
        const updatedOrders = getAvailableOrdersForDriver(driverLocation.lat, driverLocation.lng, 5);
        setAvailableOrders(updatedOrders);

        // Refresh active deliveries after a short delay
        setTimeout(() => {
          fetchActiveDeliveries(true);
        }, 1000);
      }

      toast({
        title: "Order accepted",
        description: "You have successfully accepted the delivery order.",
      });
    } catch (error) {
      console.error("Error accepting order:", error);
      toast({
        title: "Failed to accept order",
        description: "There was a problem accepting the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clear the processing state
      setProcessingOrderId(null);
    }
  }

  const handleAssignOrder = async (orderId: string) => {
    try {
      // Set the processing state to show loading indicator
      setProcessingOrderId(orderId);

      if (!userId) {
        throw new Error('User ID is required');
      }

      // Call the API to assign the order to this driver
      const response = await fetch('/api/orders/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          driver_id: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign order');
      }

      // Find and remove the order from pending orders

      // Remove the order from pending orders
      setPendingOrders(prev => prev.filter(order => order.id.toString() !== orderId.toString()));

      // Refresh the active deliveries and pending orders lists after a short delay
      setTimeout(() => {
        fetchActiveDeliveries(true);
        fetchPendingOrders(true);
      }, 1000);

      toast({
        title: "Order assigned",
        description: "You have successfully assigned the order to yourself.",
      });
    } catch (error) {
      console.error("Error assigning order:", error);
      toast({
        title: "Failed to assign order",
        description: "There was a problem assigning the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clear the processing state
      setProcessingOrderId(null);
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Set the processing state to show loading indicator
      setProcessingOrderId(orderId);

      if (!userId) {
        throw new Error('User ID is required');
      }

      // Call the API to update the order status
      const response = await fetch('/api/orders/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          status: newStatus.toLowerCase(),
          driver_id: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }

      // If the status is "delivered" or "cancelled", remove the order from active deliveries immediately
      if (newStatus.toLowerCase() === 'delivered' || newStatus.toLowerCase() === 'cancelled') {
        // Remove the order from active deliveries
        setActiveDeliveries(prevDeliveries =>
          prevDeliveries.filter(delivery => delivery.id.toString() !== orderId.toString())
        );

        // Also refresh active deliveries from the server after a short delay
        setTimeout(() => {
          fetchActiveDeliveries(true);
        }, 1000);
      } else {
        // For other statuses, just update the status in the active deliveries list
        setActiveDeliveries(prevDeliveries =>
          prevDeliveries.map(delivery =>
            delivery.id.toString() === orderId.toString()
              ? { ...delivery, status: newStatus.toLowerCase() }
              : delivery
          )
        );
      }

      // Show appropriate toast message based on status
      let toastTitle = "Status Updated";
      let toastDescription = `Order status updated to ${newStatus}`;
      let toastVariant: "default" | "destructive" = "default";

      // Find the delivery in the active deliveries list
      const delivery = activeDeliveries.find(d => d.id.toString() === orderId.toString());

      switch(newStatus.toLowerCase()) {
        case "in_transit":
          // Handle both "Picked Up" and "In Transit" cases
          if (delivery && delivery.status === 'pending') {
            toastTitle = "Order Picked Up";
            toastDescription = "You've confirmed pickup from the restaurant";
          } else {
            toastTitle = "Order In Transit";
            toastDescription = "You're now delivering the order";
          }
          break;
        case "delivered":
          toastTitle = "Order Delivered";
          toastDescription = "Delivery completed successfully!";
          break;
        case "cancelled":
          toastTitle = "Order Cancelled";
          toastDescription = "The order has been cancelled";
          toastVariant = "destructive";
          break;
      }

      toast({
        title: toastTitle,
        description: toastDescription,
        variant: toastVariant,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Failed to update status",
        description: "There was a problem updating the order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clear the processing state
      setProcessingOrderId(null);
    }
  }

  const handleRejectOrder = async (orderId: string, isBroadcasted = false) => {
    try {
      // Set the processing state to show loading indicator
      setProcessingOrderId(orderId);

      if (isBroadcasted && userId) {
        // For broadcasted orders, use the API
        const response = await fetch('/api/orders/broadcast/reject', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: orderId,
            driver_id: userId
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to reject broadcasted order');
        }

        // Remove the order from broadcasted orders
        setBroadcastedOrders(prev => prev.filter(order => order.id.toString() !== orderId.toString()));

        // Refresh the broadcast orders list after a short delay
        setTimeout(() => {
          fetchBroadcastedOrders(true);
        }, 1000);
      } else {
        // For regular nearby orders, just remove from the list
        setAvailableOrders(prev => prev.filter(order => order.id !== orderId));
      }

      toast({
        title: "Order rejected",
        description: "You have declined this delivery order.",
      });
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast({
        title: "Failed to reject order",
        description: "There was a problem rejecting the order. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clear the processing state
      setProcessingOrderId(null);
    }
  }

  // This is where we would define additional state or functions if needed

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="flex h-16 items-center px-4">
          <MobileNav role="driver" />
          <div className="ml-auto flex items-center space-x-4">
            <LanguageSelector size="sm" variant="ghost" />
            <span className="text-sm font-medium">{t("common.greeting") || `Hi, ${userName}`}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Driver Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <Switch
              checked={isOnline}
              onCheckedChange={toggleOnlineStatus}
              className={isOnline ? 'bg-green-600' : 'bg-slate-200'}
            />
          </div>
        </div>

        {/* Driver Status and Earnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Card */}
          <Card className="card-enhanced bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-holographic animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    <h3 className="font-medium">Current Location</h3>
                  </div>
                  <Badge variant="outline" className="status-badge bg-white/20 text-white border-white/10">
                    {isOnline ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-lg font-bold">{locationName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Earnings Card */}
          <Card className="card-enhanced accent-purple shadow-holographic animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-5 w-5" />
                  <h3 className="font-medium">Earnings</h3>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs opacity-80">Today</p>
                    <p className="text-lg font-bold">${earnings.today.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">This Week</p>
                    <p className="text-lg font-bold">${earnings.week.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Total</p>
                    <p className="text-lg font-bold">${earnings.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available deliveries with tabs */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Available Deliveries</h2>

          <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
                {pendingOrders.length > 0 && (
                  <span className="ml-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingOrders.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Active
                {activeDeliveries.length > 0 && (
                  <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeDeliveries.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="nearby">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">
                    {availableOrders.length > 0
                      ? `${availableOrders.length} nearby order${availableOrders.length > 1 ? 's' : ''} available`
                      : 'No nearby orders available'}
                  </span>
                </div>
              </div>

              {availableOrders.length > 0 ? (
                <div className="grid gap-4">
                  {availableOrders.map((order) => (
                    <Card key={order.id} className="card-enhanced overflow-hidden border border-green-100 dark:border-green-900 animate-fade-in">
                      <CardHeader className="pb-2 bg-green-50 dark:bg-green-950/50">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-green-500" />
                            Order #{order.id}
                          </CardTitle>
                          <div className="flex items-center gap-1">
                            <span className="status-badge status-badge-info">{order.distance} km</span>
                            <span className="text-xs text-slate-500">
                              ({order.estimatedTime || `${Math.floor((order.distance ?? 0) * 5)} min`})
                            </span>
                          </div>
                        </div>
                        <CardDescription>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-green-600 dark:text-green-400">
                              Nearby Order
                            </span>
                            {order.price && (
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                ${order.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="grid gap-3">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="font-medium">From: {order.pickupAddress}</p>
                              <p className="font-medium">To: {order.deliveryAddress}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-slate-500" />
                              <span>Customer: {order.customerName}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Package className="h-4 w-4 text-slate-500" />
                              <span>Package: {order.packageDetails.substring(0, 20)}{order.packageDetails.length > 20 ? '...' : ''}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-sm hover:shadow-md"
                            onClick={() => handleAcceptOrder(order.id)}
                            disabled={processingOrderId === order.id}
                          >
                            {processingOrderId === order.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950 transition-all duration-300"
                            onClick={() => handleRejectOrder(order.id)}
                            disabled={processingOrderId === order.id}
                          >
                            {processingOrderId === order.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Decline
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="card-enhanced animate-fade-in">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No nearby deliveries at the moment</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      Check back later for new orders in your area
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pending">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium">
                    {pendingOrders.length > 0
                      ? `${pendingOrders.length} pending order${pendingOrders.length > 1 ? 's' : ''} available`
                      : 'No pending orders available'}
                  </span>
                </div>
                {isFetchingPending && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Refreshing...
                  </div>
                )}
              </div>

              {pendingOrders.length > 0 ? (
                <div className="grid gap-4">
                  {pendingOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="card-enhanced overflow-hidden border border-amber-100 dark:border-amber-900 animate-fade-in"
                    >
                      <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950/50">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            Order #{order.id}
                          </CardTitle>
                          <div className="flex items-center gap-1">
                            <span className="status-badge status-badge-warning">{order.distance} km</span>
                            <span className="text-xs text-slate-500">({order.estimatedTime})</span>
                          </div>
                        </div>
                        <CardDescription>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-amber-600 dark:text-amber-400">
                              Pending Order
                            </span>
                            {order.created_at && (
                              <span className="text-xs text-slate-500">
                                {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            )}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="grid gap-3">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="font-medium">From: {order.pickupAddress}</p>
                              <p className="font-medium">To: {order.deliveryAddress}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-slate-500" />
                              <span>Customer: {order.customerName}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-slate-500" />
                              <span>{order.estimatedTime}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <Package className="h-4 w-4 text-slate-500" />
                              <span>{order.packageDetails}</span>
                            </div>

                            {order.total_amount && (
                              <div className="flex items-center gap-1 text-sm font-medium">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 dark:text-green-400">${parseFloat(order.total_amount.toString()).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            className="flex-1 accent-gold hover:bg-amber-600 transition-all duration-300 shadow-sm hover:shadow-md"
                            onClick={() => handleAssignOrder(order.id)}
                            disabled={processingOrderId === order.id}
                          >
                            {processingOrderId === order.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Assign
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="card-enhanced animate-fade-in">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Clock className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No pending orders at the moment</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      Check back later for new pending orders
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="broadcasted">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium">
                    {broadcastedOrders.length > 0
                      ? `${broadcastedOrders.length} broadcast order${broadcastedOrders.length > 1 ? 's' : ''} available`
                      : 'No broadcast orders available'}
                  </span>
                </div>
                {isFetchingBroadcasts && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Refreshing...
                  </div>
                )}
              </div>

              {broadcastedOrders.length > 0 ? (
                <div className="grid gap-4">
                  {broadcastedOrders.map((order) => (
                    <Card
                      key={order.id}
                      className={`card-enhanced overflow-hidden border animate-fade-in ${
                        order.priority === 'urgent'
                          ? 'border-red-100 dark:border-red-900'
                          : order.priority === 'high'
                            ? 'border-amber-100 dark:border-amber-900'
                            : 'border-indigo-100 dark:border-indigo-900'
                      }`}
                    >
                      <CardHeader className={`pb-2 ${
                        order.priority === 'urgent'
                          ? 'bg-red-50 dark:bg-red-950/50'
                          : order.priority === 'high'
                            ? 'bg-amber-50 dark:bg-amber-950/50'
                            : 'bg-indigo-50 dark:bg-indigo-950/50'
                      }`}>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Bell className={`h-4 w-4 ${
                              order.priority === 'urgent'
                                ? 'text-red-500'
                                : order.priority === 'high'
                                  ? 'text-amber-500'
                                  : 'text-indigo-500'
                            }`} />
                            Order #{order.id}
                            {order.priority === 'urgent' && (
                              <Badge variant="destructive" className="status-badge ml-2 text-xs">Urgent</Badge>
                            )}
                            {order.priority === 'high' && (
                              <Badge variant="outline" className="status-badge ml-2 text-xs border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Priority</Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-1">
                            <span className={`status-badge ${
                              order.priority === 'urgent'
                                ? 'status-badge-danger'
                                : order.priority === 'high'
                                  ? 'status-badge-warning'
                                  : 'status-badge-info'
                            }`}>{order.distance} km</span>
                            <span className="text-xs text-slate-500">({order.estimatedTime})</span>
                          </div>
                        </div>
                        <CardDescription>
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${
                              order.priority === 'urgent'
                                ? 'text-red-600 dark:text-red-400'
                                : order.priority === 'high'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-indigo-600 dark:text-indigo-400'
                            }`}>
                              Broadcast Order
                            </span>
                            {order.created_at && (
                              <span className="text-xs text-slate-500">
                                {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            )}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="grid gap-3">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="font-medium">From: {order.pickupAddress}</p>
                              <p className="font-medium">To: {order.deliveryAddress}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-slate-500" />
                              <span>Customer: {order.customerName}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-slate-500" />
                              <span>{order.estimatedTime}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <Package className="h-4 w-4 text-slate-500" />
                              <span>{order.packageDetails}</span>
                            </div>

                            {order.total_amount && (
                              <div className="flex items-center gap-1 text-sm font-medium">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 dark:text-green-400">${parseFloat(order.total_amount.toString()).toFixed(2)}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-sm mt-1 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md shadow-sm">
                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                            <span className="text-amber-600 dark:text-amber-400 text-xs">
                              This order is available to all drivers. Accept quickly to claim it!
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            className={`flex-1 transition-all duration-300 shadow-sm hover:shadow-md ${
                              order.priority === 'urgent'
                                ? 'bg-red-600 hover:bg-red-700'
                                : order.priority === 'high'
                                  ? 'bg-amber-600 hover:bg-amber-700'
                                  : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                            onClick={() => handleAcceptOrder(order.id, true)}
                            disabled={processingOrderId === order.id}
                          >
                            {processingOrderId === order.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950 transition-all duration-300"
                            onClick={() => handleRejectOrder(order.id, true)}
                            disabled={processingOrderId === order.id}
                          >
                            {processingOrderId === order.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Decline
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="card-enhanced animate-fade-in">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No broadcasted orders at the moment</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      New orders will appear here automatically
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* Active deliveries */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Active Deliveries</h2>
            <div className="flex items-center gap-4">
              {isFetchingActive && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Refreshing...
                </div>
              )}
              <Button variant="outline" size="sm" asChild className="flex items-center gap-1">
                <Link href="/driver/history">
                  <Clock className="h-4 w-4 mr-1" />
                  View History
                </Link>
              </Button>
            </div>
          </div>

          {activeDeliveries.length > 0 ? (
            <div className="grid gap-4">
              {activeDeliveries.map((delivery) => (
                <Card key={delivery.id} className="card-enhanced overflow-hidden border border-blue-100 dark:border-blue-900 animate-fade-in">
                  <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950/50">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        Order #{delivery.id}
                      </CardTitle>
                      <span className={`status-badge ${
                        delivery.status === 'delivered'
                          ? 'status-badge-success'
                          : delivery.status === 'cancelled'
                            ? 'status-badge-danger'
                            : delivery.status === 'in_transit'
                              ? 'status-badge-info'
                              : 'status-badge-warning'
                      }`}>
                        {delivery.status
                          ? delivery.status === 'in_transit'
                            ? 'In Transit'
                            : delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)
                          : 'Pending'}
                      </span>
                    </div>
                    <CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          Active Delivery
                        </span>
                        {delivery.created_at && (
                          <span className="text-xs text-slate-500">
                            {new Date(delivery.created_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid gap-3">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium">From: {delivery.pickupAddress}</p>
                          <p className="font-medium">To: {delivery.deliveryAddress}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-slate-500" />
                          <span>Customer: {delivery.customerName}</span>
                        </div>

                        {delivery.estimatedTime && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-slate-500" />
                            <span>{delivery.estimatedTime}</span>
                          </div>
                        )}
                      </div>

                      {delivery.total_amount && (
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 dark:text-green-400">
                            ${parseFloat(delivery.total_amount.toString()).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 mt-4">
                      <div className="flex gap-2">
                        <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md">
                          <Link href={`/driver/navigation?id=${delivery.id}`}>Navigate</Link>
                        </Button>

                        <Button
                          variant="outline"
                          className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-900 dark:hover:bg-blue-950 transition-all duration-300"
                          onClick={() => handleOpenChat(delivery.id, delivery.customerName)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-medium text-slate-500">Update Status:</h4>
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(value) => handleUpdateOrderStatus(delivery.id, value)}
                            disabled={processingOrderId === delivery.id}
                            defaultValue={delivery.status}
                          >
                            <SelectTrigger className="w-full shadow-sm border-accent-purple/20">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in_transit">Picked Up</SelectItem>
                              <SelectItem value="in_transit">In Transit</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          {processingOrderId === delivery.id && (
                            <div className="flex items-center">
                              <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-enhanced animate-fade-in">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No active deliveries at the moment</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Accept orders to see them here
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      {/* Bottom Taskbar */}
      <footer className="sticky bottom-0 z-10 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-holographic">
        <div className="flex justify-around items-center h-16">
          <Button asChild variant="ghost" size="icon" className="transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link href="/driver/profile">
              <User className="h-6 w-6" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link href="/driver/wallet">
              <Wallet className="h-6 w-6" />
              <span className="sr-only">Wallet</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link href="/driver/history">
              <Clock className="h-6 w-6" />
              <span className="sr-only">History</span>
            </Link>
          </Button>
        </div>
      </footer>

      {/* Chat Dialog */}
      <ChatDialog
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        orderId={currentChatOrderId || ""}
        customerName={currentChatCustomerName}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isSending={isSendingMessage}
      />
    </div>
  )
}
