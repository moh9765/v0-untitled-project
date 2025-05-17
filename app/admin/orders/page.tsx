"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MoreHorizontal,
  Search,
  Download,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  DollarSign,
  MapPin,
  CreditCard
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRangePicker } from "@/components/admin/date-range-picker"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerId: string
  customerName: string
  driverId?: string
  driverName?: string
  status: "pending" | "accepted" | "preparing" | "ready" | "picked_up" | "in_transit" | "delivered" | "cancelled"
  date: string
  total: number
  items: OrderItem[]
  paymentMethod: "credit_card" | "cash" | "wallet"
  paymentStatus: "paid" | "pending" | "failed" | "refunded"
  vendorId: string
  vendorName: string
  city: string
  deliveryAddress: string
  pickupAddress: string
  deliveryFee: number
  estimatedDeliveryTime?: string
  actualDeliveryTime?: string
  notes?: string
  issueReported?: boolean
  issueDescription?: string
}

export default function OrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [activeTab, setActiveTab] = useState("all")

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        // Map the activeTab to status for API filtering
        let statusParam = "all";
        if (activeTab === "active") {
          statusParam = "pending"; // We'll filter more on the client side
        } else if (activeTab === "completed") {
          statusParam = "delivered";
        } else if (activeTab === "cancelled") {
          statusParam = "cancelled";
        }

        const response = await fetch(`/api/admin/orders?status=${statusParam}&limit=50`)

        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`)
        }

        const data = await response.json()

        // Add default values for fields that might not be in our DB yet
        const ordersWithDefaults = data.orders.map((order: any) => ({
          ...order,
          driverId: order.driverId || undefined,
          driverName: order.driverName || undefined,
          paymentMethod: order.paymentMethod || "credit_card",
          paymentStatus: order.paymentStatus || "paid",
          city: order.city || "Local Area",
          items: order.items || [],
          estimatedDeliveryTime: order.estimatedDeliveryTime || undefined,
          actualDeliveryTime: order.actualDeliveryTime || undefined,
          issueReported: order.issueReported || false,
          issueDescription: order.issueDescription || undefined
        }))

        setOrders(ordersWithDefaults)
        setFilteredOrders(ordersWithDefaults)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive",
        })

        // Set empty array on error
        setOrders([])
        setFilteredOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [activeTab, toast])

  // Apply filters
  useEffect(() => {
    let result = orders

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter)
    }

    // Apply payment method filter
    if (paymentMethodFilter !== "all") {
      result = result.filter(order => order.paymentMethod === paymentMethodFilter)
    }

    // Apply city filter
    if (cityFilter !== "all") {
      result = result.filter(order => order.city === cityFilter)
    }

    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      result = result.filter(order => {
        const orderDate = new Date(order.date)
        return orderDate >= dateRange.from! && orderDate <= dateRange.to!
      })
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        order =>
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          (order.driverName && order.driverName.toLowerCase().includes(query)) ||
          order.vendorName.toLowerCase().includes(query) ||
          order.deliveryAddress.toLowerCase().includes(query)
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "active") {
        result = result.filter(order =>
          ["pending", "accepted", "preparing", "ready", "picked_up", "in_transit"].includes(order.status)
        )
      } else if (activeTab === "completed") {
        result = result.filter(order => order.status === "delivered")
      } else if (activeTab === "cancelled") {
        result = result.filter(order => order.status === "cancelled")
      } else if (activeTab === "issues") {
        result = result.filter(order => order.issueReported)
      }
    }

    setFilteredOrders(result)
  }, [orders, searchQuery, statusFilter, paymentMethodFilter, cityFilter, dateRange, activeTab])

  const handleViewOrder = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`)
  }

  const handleEditOrder = (orderId: string) => {
    router.push(`/admin/orders/${orderId}/edit`)
  }

  const handleCancelOrder = (orderId: string) => {
    // This would be replaced with actual API calls
    toast({
      title: "Order Cancelled",
      description: `Order ${orderId} has been cancelled.`,
      variant: "destructive",
    })

    // Update local state
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: "cancelled" }
        : order
    ))
  }

  const handleExportOrders = () => {
    // This would be replaced with actual export functionality
    toast({
      title: "Export Started",
      description: "Order data export has started. You will be notified when it's ready.",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "success"
      case "cancelled":
        return "destructive"
      case "pending":
      case "accepted":
        return "warning"
      case "preparing":
      case "ready":
      case "picked_up":
      case "in_transit":
        return "default"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    }).format(date)
  }

  // Get unique cities for filter
  const cities = ["all", ...new Set(orders.map(order => order.city))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportOrders} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            View and manage all orders across your platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                All Orders
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Active
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Completed
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Cancelled
              </TabsTrigger>
              <TabsTrigger value="issues" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Issues
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4 my-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="picked_up">Picked Up</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city === "all" ? "All Cities" : city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <DateRangePicker
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                            No orders found matching the current filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.slice(0, 10).map((order) => (
                          <TableRow key={order.id} className={order.issueReported ? "bg-red-50 dark:bg-red-950/20" : ""}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(order.status)}>
                                {order.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(order.date)}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {order.paymentMethod === "credit_card" && <CreditCard className="h-3 w-3" />}
                                {order.paymentMethod === "cash" && <DollarSign className="h-3 w-3" />}
                                {order.paymentMethod === "wallet" && <DollarSign className="h-3 w-3" />}
                                <span>{order.paymentMethod.replace("_", " ")}</span>
                              </div>
                            </TableCell>
                            <TableCell>{order.vendorName}</TableCell>
                            <TableCell>{order.city}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleViewOrder(order.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditOrder(order.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Order
                                  </DropdownMenuItem>
                                  {order.status !== "delivered" && order.status !== "cancelled" && (
                                    <DropdownMenuItem onClick={() => handleCancelOrder(order.id)}>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Cancel Order
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
