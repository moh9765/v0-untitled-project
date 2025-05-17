"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Map,
  CreditCard,
  Wallet,
  Truck
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { DateRangePicker } from "@/components/admin/date-range-picker"
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart"
import { AdminMetricCard } from "@/components/admin/admin-metric-card"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts"

export default function SalesAnalyticsPage() {
  const { toast } = useToast()
  const [timeframe, setTimeframe] = useState("month")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    deliveryFees: 0,
    commissions: 0,
    refunds: 0,
    growth: {
      revenue: 0,
      orders: 0,
      aov: 0
    }
  })
  const [salesByCategory, setSalesByCategory] = useState<any[]>([])
  const [salesByPaymentMethod, setSalesByPaymentMethod] = useState<any[]>([])
  const [salesByTime, setSalesByTime] = useState<any[]>([])
  const [salesByCity, setSalesByCity] = useState<any[]>([])

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        // Build query parameters
        const params = new URLSearchParams()
        params.append('timeframe', timeframe)

        if (dateRange.from && dateRange.to) {
          params.append('from', dateRange.from.toISOString())
          params.append('to', dateRange.to.toISOString())
        }

        // Fetch data from API
        const response = await fetch(`/api/admin/analytics/sales?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Error fetching sales analytics: ${response.statusText}`)
        }

        const data = await response.json()

        // Update state with fetched data
        setMetrics(data.metrics)
        setSalesByCategory(data.salesByCategory)
        setSalesByPaymentMethod(data.salesByPaymentMethod)
        setSalesByTime(data.salesByTime)
        setSalesByCity(data.salesByCity)

        // If there was an error but we got fallback data, show a toast
        if (data.error) {
          toast({
            title: "Using fallback data",
            description: "Could not fetch real data. Showing mock data instead.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to fetch sales analytics:", error)
        toast({
          title: "Error",
          description: "Failed to fetch sales analytics. Using mock data instead.",
          variant: "destructive",
        })

        // Set fallback data
        setMetrics({
          totalRevenue: 456789.45,
          totalOrders: 12458,
          averageOrderValue: 36.67,
          deliveryFees: 45678.90,
          commissions: 91357.89,
          refunds: 4567.89,
          growth: {
            revenue: 15.7,
            orders: 12.3,
            aov: 3.2
          }
        })

        setSalesByCategory([
          { name: "Food", value: 245000 },
          { name: "Grocery", value: 120000 },
          { name: "Pharmacy", value: 45000 },
          { name: "Convenience", value: 35000 },
          { name: "Other", value: 11789.45 }
        ])

        setSalesByPaymentMethod([
          { name: "Credit Card", value: 296912.14 },
          { name: "Cash", value: 91357.89 },
          { name: "Wallet", value: 68519.42 }
        ])

        // Generate mock time data based on timeframe
        const timeData = []
        if (timeframe === "day") {
          for (let i = 0; i < 24; i++) {
            timeData.push({
              name: `${i}:00`,
              revenue: Math.floor(Math.random() * 5000) + 1000,
              orders: Math.floor(Math.random() * 50) + 10
            })
          }
        } else if (timeframe === "week") {
          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          for (let i = 0; i < 7; i++) {
            timeData.push({
              name: days[i],
              revenue: Math.floor(Math.random() * 20000) + 5000,
              orders: Math.floor(Math.random() * 200) + 50
            })
          }
        } else if (timeframe === "month") {
          for (let i = 1; i <= 30; i++) {
            timeData.push({
              name: i.toString(),
              revenue: Math.floor(Math.random() * 10000) + 2000,
              orders: Math.floor(Math.random() * 100) + 20
            })
          }
        } else {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          for (let i = 0; i < 12; i++) {
            timeData.push({
              name: months[i],
              revenue: Math.floor(Math.random() * 500000) + 100000,
              orders: Math.floor(Math.random() * 5000) + 1000
            })
          }
        }
        setSalesByTime(timeData)

        setSalesByCity([
          { name: "New York", value: 145000 },
          { name: "Los Angeles", value: 98000 },
          { name: "Chicago", value: 76000 },
          { name: "Houston", value: 65000 },
          { name: "Miami", value: 45000 },
          { name: "Other", value: 27789.45 }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeframe, dateRange, toast])

  const handleExportData = () => {
    // This would be replaced with actual export functionality
    toast({
      title: "Export Started",
      description: "Sales analytics data export has started. You will be notified when it's ready.",
    })
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
        <div className="flex items-center gap-2">
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="day" className="flex items-center gap-2">
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="flex items-center gap-2">
            This Week
          </TabsTrigger>
          <TabsTrigger value="month" className="flex items-center gap-2">
            This Month
          </TabsTrigger>
          <TabsTrigger value="year" className="flex items-center gap-2">
            This Year
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminMetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          description={`+${metrics.growth.revenue}% from last period`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          loading={loading}
        />
        <AdminMetricCard
          title="Total Orders"
          value={metrics.totalOrders.toLocaleString()}
          description={`+${metrics.growth.orders}% from last period`}
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          loading={loading}
        />
        <AdminMetricCard
          title="Average Order Value"
          value={`$${metrics.averageOrderValue.toFixed(2)}`}
          description={`+${metrics.growth.aov}% from last period`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          loading={loading}
        />
        <AdminMetricCard
          title="Refunds"
          value={`$${metrics.refunds.toLocaleString()}`}
          description="1.0% of total revenue"
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          trend="neutral"
          loading={loading}
        />
      </div>

      {/* Revenue Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>
            Revenue and order trends for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesByTime}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `$${value.toLocaleString()}`} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => [name === 'revenue' ? `$${Number(value).toLocaleString()}` : value, name === 'revenue' ? 'Revenue' : 'Orders']} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Revenue distribution across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesByCategory}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="value" name="Revenue" fill="#8884d8">
                      {salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Payment Method</CardTitle>
            <CardDescription>
              Revenue distribution across payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={salesByPaymentMethod}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {salesByPaymentMethod.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivery Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.deliveryFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(metrics.deliveryFees / metrics.totalRevenue * 100).toFixed(1)}% of total revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.commissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {(metrics.commissions / metrics.totalRevenue * 100).toFixed(1)}% of total revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(metrics.deliveryFees + metrics.commissions).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((metrics.deliveryFees + metrics.commissions) / metrics.totalRevenue * 100).toFixed(1)}% of total revenue
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
