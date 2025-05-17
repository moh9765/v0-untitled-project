"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  Truck,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Map,
  Activity,
  Repeat,
  Star,
  Clock
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
  Line
} from "recharts"

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [timeframe, setTimeframe] = useState("month")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    newUsers: 0,
    activeVendors: 0,
    activeDrivers: 0,
    deliveryFees: 0,
    commissions: 0,
    growth: {
      orders: 0,
      revenue: 0,
      users: 0
    }
  })
  const [ordersByCity, setOrdersByCity] = useState<any[]>([])
  const [ordersByCategory, setOrdersByCategory] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [hourlyOrders, setHourlyOrders] = useState<any[]>([])

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

        // Fetch dashboard metrics
        const dashboardResponse = await fetch(`/api/admin/dashboard?${params.toString()}`)

        if (!dashboardResponse.ok) {
          throw new Error(`Error fetching dashboard metrics: ${dashboardResponse.statusText}`)
        }

        const dashboardData = await dashboardResponse.json()

        // Fetch sales analytics
        const salesResponse = await fetch(`/api/admin/analytics/sales?${params.toString()}`)

        if (!salesResponse.ok) {
          throw new Error(`Error fetching sales analytics: ${salesResponse.statusText}`)
        }

        const salesData = await salesResponse.json()

        // Fetch user analytics
        const usersResponse = await fetch(`/api/admin/analytics/users?${params.toString()}`)

        if (!usersResponse.ok) {
          throw new Error(`Error fetching user analytics: ${usersResponse.statusText}`)
        }

        const usersData = await usersResponse.json()

        // Fetch vendor analytics
        const vendorsResponse = await fetch(`/api/admin/analytics/vendors?${params.toString()}`)

        if (!vendorsResponse.ok) {
          throw new Error(`Error fetching vendor analytics: ${vendorsResponse.statusText}`)
        }

        const vendorsData = await vendorsResponse.json()

        // Combine data from all sources
        setMetrics({
          totalOrders: dashboardData.metrics?.totalOrders || 0,
          totalRevenue: salesData.metrics?.totalRevenue || 0,
          averageOrderValue: salesData.metrics?.averageOrderValue || 0,
          newUsers: usersData.metrics?.newUsers || 0,
          activeVendors: vendorsData.metrics?.activeVendors || 0,
          activeDrivers: dashboardData.metrics?.activeDrivers || 0,
          deliveryFees: salesData.metrics?.deliveryFees || 0,
          commissions: salesData.metrics?.commissions || 0,
          growth: {
            orders: dashboardData.metrics?.growth?.orders || 0,
            revenue: salesData.metrics?.growth?.revenue || 0,
            users: usersData.metrics?.growth?.users || 0
          }
        })

        // Set orders by city
        if (salesData.salesByCity) {
          setOrdersByCity(salesData.salesByCity.map((item: any) => ({
            name: item.name,
            value: Math.round(item.value / salesData.metrics.averageOrderValue)
          })))
        }

        // Set orders by category
        if (salesData.salesByCategory) {
          setOrdersByCategory(salesData.salesByCategory.map((item: any) => ({
            name: item.name,
            value: Math.round(item.value / salesData.metrics.averageOrderValue)
          })))
        }

        // Set payment methods
        if (salesData.salesByPaymentMethod) {
          setPaymentMethods(salesData.salesByPaymentMethod.map((item: any) => ({
            name: item.name,
            value: Math.round((item.value / salesData.metrics.totalRevenue) * 100)
          })))
        }

        // Generate hourly orders based on sales by time data
        if (salesData.salesByTime && timeframe === 'day') {
          setHourlyOrders(salesData.salesByTime.map((item: any) => {
            const hour = parseInt(item.name.split(':')[0])
            return {
              hour,
              orders: item.orders || Math.round(item.revenue / salesData.metrics.averageOrderValue)
            }
          }))
        } else {
          // Generate mock hourly data for other timeframes
          setHourlyOrders(Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            orders: Math.floor(Math.random() * 100) + (i >= 10 && i <= 20 ? 50 : 10)
          })))
        }

        // If there was an error but we got fallback data, show a toast
        if (dashboardData.error || salesData.error || usersData.error || vendorsData.error) {
          toast({
            title: "Using fallback data",
            description: "Could not fetch real data for some metrics. Showing mock data instead.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch analytics data. Using mock data instead.",
          variant: "destructive",
        })

        // Set fallback data
        setMetrics({
          totalOrders: 12458,
          totalRevenue: 456789.45,
          averageOrderValue: 36.67,
          newUsers: 2345,
          activeVendors: 187,
          activeDrivers: 342,
          deliveryFees: 45678.90,
          commissions: 91357.89,
          growth: {
            orders: 12.3,
            revenue: 15.7,
            users: 8.4
          }
        })

        // Mock orders by city
        setOrdersByCity([
          { name: "New York", value: 4500 },
          { name: "Los Angeles", value: 3200 },
          { name: "Chicago", value: 2100 },
          { name: "Houston", value: 1800 },
          { name: "Miami", value: 1500 },
          { name: "Other", value: 2000 }
        ])

        // Mock orders by category
        setOrdersByCategory([
          { name: "Food", value: 6500 },
          { name: "Grocery", value: 3200 },
          { name: "Pharmacy", value: 1200 },
          { name: "Convenience", value: 1000 },
          { name: "Other", value: 558 }
        ])

        // Mock payment methods
        setPaymentMethods([
          { name: "Credit Card", value: 65 },
          { name: "Cash", value: 20 },
          { name: "Wallet", value: 15 }
        ])

        // Mock hourly orders
        setHourlyOrders(Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          orders: Math.floor(Math.random() * 100) + (i >= 10 && i <= 20 ? 50 : 10)
        })))
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
      description: "Analytics data export has started. You will be notified when it's ready.",
    })
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Vendors
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
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
        </div>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AdminMetricCard
              title="Total Orders"
              value={metrics.totalOrders.toLocaleString()}
              description={`+${metrics.growth.orders}% from last period`}
              icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
              trend="up"
            />
            <AdminMetricCard
              title="Total Revenue"
              value={`$${metrics.totalRevenue.toLocaleString()}`}
              description={`+${metrics.growth.revenue}% from last period`}
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              trend="up"
            />
            <AdminMetricCard
              title="New Users"
              value={metrics.newUsers.toLocaleString()}
              description={`+${metrics.growth.users}% from last period`}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              trend="up"
            />
            <AdminMetricCard
              title="Average Order Value"
              value={`$${metrics.averageOrderValue.toFixed(2)}`}
              description="+3.2% from last period"
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
              trend="up"
            />
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Daily revenue for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <AdminRevenueChart timeframe={timeframe} />
              )}
            </CardContent>
          </Card>

          {/* Orders by City and Category */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Orders by City</CardTitle>
                <CardDescription>
                  Distribution of orders across cities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ordersByCity}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Orders" fill="#8884d8">
                          {ordersByCity.map((entry, index) => (
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
                <CardTitle>Orders by Category</CardTitle>
                <CardDescription>
                  Distribution of orders across categories
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
                          data={ordersByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ordersByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods and Hourly Orders */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Distribution of payment methods used
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
                          data={paymentMethods}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {paymentMethods.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Order Distribution</CardTitle>
                <CardDescription>
                  Number of orders by hour of day
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={hourlyOrders}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis
                          dataKey="hour"
                          tickFormatter={(hour) => `${hour}:00`}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value} orders`, "Orders"]}
                          labelFormatter={(hour) => `${hour}:00 - ${(hour + 1) % 24}:00`}
                        />
                        <Line type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>
                  Detailed sales metrics and trends
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/analytics/sales" className="flex items-center gap-2">
                  View Details
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <AdminMetricCard
                      title="Total Revenue"
                      value={`$${metrics.totalRevenue.toLocaleString()}`}
                      description={`+${metrics.growth.revenue}% from last period`}
                      icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                      trend="up"
                    />
                    <AdminMetricCard
                      title="Total Orders"
                      value={metrics.totalOrders.toLocaleString()}
                      description={`+${metrics.growth.orders}% from last period`}
                      icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
                      trend="up"
                    />
                    <AdminMetricCard
                      title="Average Order Value"
                      value={`$${metrics.averageOrderValue.toFixed(2)}`}
                      description="+3.2% from last period"
                      icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                      trend="up"
                    />
                  </div>
                  <div className="text-center">
                    <Link href="/admin/analytics/sales" className="text-primary hover:underline">
                      View detailed sales analytics
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Analytics</CardTitle>
                <CardDescription>
                  User growth, retention, and behavior metrics
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/analytics/users" className="flex items-center gap-2">
                  View Details
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <AdminMetricCard
                      title="Total Users"
                      value={metrics.newUsers.toLocaleString()}
                      description={`+${metrics.growth.users}% from last period`}
                      icon={<Users className="h-4 w-4 text-muted-foreground" />}
                      trend="up"
                    />
                    <AdminMetricCard
                      title="Active Users"
                      value={(metrics.newUsers * 0.6).toLocaleString()}
                      description="+5.2% from last period"
                      icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                      trend="up"
                    />
                    <AdminMetricCard
                      title="Retention Rate"
                      value="78.5%"
                      description="+1.5% from last period"
                      icon={<Repeat className="h-4 w-4 text-muted-foreground" />}
                      trend="up"
                    />
                  </div>
                  <div className="text-center">
                    <Link href="/admin/analytics/users" className="text-primary hover:underline">
                      View detailed user growth analytics
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vendor Analytics</CardTitle>
                <CardDescription>
                  Vendor performance and revenue metrics
                </CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/analytics/vendors" className="flex items-center gap-2">
                  View Details
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <AdminMetricCard
                      title="Total Vendors"
                      value={metrics.activeVendors.toLocaleString()}
                      description="+5.2% from last period"
                      icon={<Store className="h-4 w-4 text-muted-foreground" />}
                      trend="up"
                    />
                    <AdminMetricCard
                      title="Average Rating"
                      value="4.3"
                      description="Out of 5 stars"
                      icon={<Star className="h-4 w-4 text-muted-foreground" />}
                      trend="neutral"
                    />
                    <AdminMetricCard
                      title="Avg. Preparation Time"
                      value="18.5 min"
                      description="Per order"
                      icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                      trend="neutral"
                    />
                  </div>
                  <div className="text-center">
                    <Link href="/admin/analytics/vendors" className="text-primary hover:underline">
                      View detailed vendor performance analytics
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
