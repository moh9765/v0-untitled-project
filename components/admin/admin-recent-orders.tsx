"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  customer: string
  status: string
  date: string
  total: number
  items: number
  vendor: string
  city: string
}

export function AdminRecentOrders() {
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)

      try {
        const response = await fetch('/api/admin/recent-orders?limit=5')

        if (!response.ok) {
          throw new Error(`Error fetching recent orders: ${response.statusText}`)
        }

        const result = await response.json()

        if (result.orders && Array.isArray(result.orders)) {
          // Format the data
          const formattedOrders = result.orders.map((order: any) => ({
            id: order.id.toString(),
            customer: order.customer || 'Unknown Customer',
            status: order.status || 'pending',
            date: order.date,
            total: parseFloat(order.total) || 0,
            items: parseInt(order.items) || 0,
            vendor: order.vendor || 'Unknown Vendor',
            city: order.city || 'Unknown Location'
          }))

          setOrders(formattedOrders)
        } else {
          // If no data or invalid format, set empty array
          setOrders([])
        }
      } catch (error) {
        console.error("Failed to fetch recent orders:", error)
        toast({
          title: "Error",
          description: "Failed to fetch recent orders. Please try again.",
          variant: "destructive",
        })

        // Set empty array
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [toast])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"
      case "in_transit":
        return "default"
      case "delivered":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    }).format(date)
  }

  const handleViewOrder = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(order.date)}</TableCell>
              <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewOrder(order.id)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View order</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
