"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  ShoppingBag,
  Truck,
  Store,
  BarChart3,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from "lucide-react"
import { AdminMetricCard } from "@/components/admin/admin-metric-card"
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders"
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart"
import { AdminTopVendors } from "@/components/admin/admin-top-vendors"
import { AdminAlerts } from "@/components/admin/admin-alerts"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const { toast } = useToast()
  const [timeframe, setTimeframe] = useState("today")
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeDrivers: 0,
    activeVendors: 0,
    newUsers: 0,
    pendingOrders: 0,
    avgDeliveryTime: 0,
    issueRate: 0,
    growth: {
      orders: 0,
      revenue: 0
    }
  })

  // Fetch dashboard metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/dashboard?timeframe=${timeframe}`)
        if (!response.ok) {
          throw new Error(`Error fetching dashboard metrics: ${response.statusText}`)
        }
        const data = await response.json()
        setMetrics(data.metrics)
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error)
        toast({
          title: "Error",
          description: "Failed to fetch dashboard metrics. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [timeframe, toast])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Tabs
          value={timeframe}
          onValueChange={setTimeframe}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminMetricCard
          title="Total Orders"
          value={metrics.totalOrders}
          description={`${metrics.growth.orders > 0 ? '+' : ''}${metrics.growth.orders.toFixed(1)}% from last period`}
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
          trend={metrics.growth.orders > 0 ? "up" : metrics.growth.orders < 0 ? "down" : "neutral"}
          loading={loading}
        />
        <AdminMetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          description={`${metrics.growth.revenue > 0 ? '+' : ''}${metrics.growth.revenue.toFixed(1)}% from last period`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend={metrics.growth.revenue > 0 ? "up" : metrics.growth.revenue < 0 ? "down" : "neutral"}
          loading={loading}
        />
        <AdminMetricCard
          title="Active Drivers"
          value={metrics.activeDrivers}
          description="Currently online"
          icon={<Truck className="h-4 w-4 text-muted-foreground" />}
          trend="neutral"
          loading={loading}
        />
        <AdminMetricCard
          title="Active Vendors"
          value={metrics.activeVendors}
          description="With recent orders"
          icon={<Store className="h-4 w-4 text-muted-foreground" />}
          trend="neutral"
          loading={loading}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Daily revenue for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminRevenueChart timeframe={timeframe} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
            <CardDescription>
              Based on order volume and revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminTopVendors />
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Alerts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders across all vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminRecentOrders />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>
              Important notifications requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminAlerts />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
