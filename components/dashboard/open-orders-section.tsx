"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Clock, User, Phone, Mail, ShoppingBag, Filter, ArrowUpDown, AlertTriangle } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Define the OrderItem type
interface OrderItem {
  id: number
  product_id: string
  quantity: number
  price: number
  product_name: string
  product_name_ar: string
  product_thumbnail?: string
}

// Define the Order type
interface Order {
  id: number
  customer_id: number
  status: string
  total_amount: number
  created_at: string
  driver_id?: number
  customer_name: string
  customer_email: string
  customer_phone?: string
  items: OrderItem[]
  delivery_address?: any
  estimated_delivery_time?: string
}

export function OpenOrdersSection() {
  const { t, isRTL } = useLanguage()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")

  // Fetch open orders
  useEffect(() => {
    const fetchOpenOrders = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/orders/open")

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setOrders(data.orders || [])
        setError(null)
      } catch (err) {
        console.error("Failed to fetch open orders:", err)
        setError(t("errors.fetchFailed"))
        toast({
          title: t("errors.error"),
          description: t("errors.fetchFailed"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOpenOrders()
  }, [t, toast])

  // Sort orders based on the selected sort option
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    } else {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    }
  })

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortBy(sortBy === "newest" ? "oldest" : "newest")
  }

  // Render loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t("dashboard.openOrders")}</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium mb-2">{t("errors.error")}</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            {t("common.retry")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("dashboard.openOrders")}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          className="flex items-center gap-1"
        >
          <ArrowUpDown className="h-4 w-4" />
          {sortBy === "newest" ? t("common.newest") : t("common.oldest")}
        </Button>
      </div>

      {sortedOrders.length > 0 ? (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      {t("orders.orderId")}: #{order.id}
                    </h4>
                    <p className="text-xs text-slate-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    {t("orders.statusOpen")}
                  </Badge>
                </div>

                {/* Customer details */}
                <div className="mb-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md">
                  <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {t("orders.customerDetails")}
                  </h5>
                  <p className="text-xs">{order.customer_name}</p>
                  {order.customer_phone ? (
                    <p className="text-xs flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {order.customer_phone}
                    </p>
                  ) : (
                    <p className="text-xs flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {order.customer_email}
                    </p>
                  )}
                </div>

                {/* Order items */}
                <div className="mb-3">
                  <h5 className="text-sm font-medium mb-1 flex items-center gap-1">
                    <ShoppingBag className="h-3 w-3" />
                    {t("orders.items")}
                  </h5>
                  <div className="space-y-1">
                    {order.items && order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span>
                          {item.quantity}x {item.product_name}
                        </span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-medium text-sm mt-2 pt-2 border-t">
                    <span>{t("orders.total")}</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>

                {/* Delivery address if available */}
                {order.delivery_address && (
                  <div className="text-xs text-slate-500 mb-3">
                    <strong>{t("orders.deliveryAddress")}:</strong> {
                      typeof order.delivery_address === 'string'
                        ? order.delivery_address
                        : order.delivery_address.street_address
                    }
                  </div>
                )}

                {/* Estimated delivery time if available */}
                {order.estimated_delivery_time && (
                  <div className="text-xs text-slate-500 mb-3">
                    <strong>{t("orders.estimatedDelivery")}:</strong> {order.estimated_delivery_time}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end gap-2 mt-2">
                  <Button size="sm" variant="outline">
                    {t("common.details")}
                  </Button>
                  <Button size="sm" variant="default">
                    {t("common.process")}
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
            <p className="text-slate-500 dark:text-slate-400 mb-2">{t("dashboard.noOpenOrders")}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center max-w-xs">
              {t("dashboard.openOrdersDescription")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
