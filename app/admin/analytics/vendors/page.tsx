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
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Map,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Truck
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { DateRangePicker } from "@/components/admin/date-range-picker"
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
  Area,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts"

export default function VendorPerformanceAnalyticsPage() {
  const { toast } = useToast()
  const [timeframe, setTimeframe] = useState("month")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalVendors: 0,
    activeVendors: 0,
    averageRating: 0,
    totalRevenue: 0,
    averageOrdersPerVendor: 0,
    averagePreparationTime: 0,
    topPerformingCategories: [],
    growth: {
      vendors: 0,
      revenue: 0,
      orders: 0
    }
  })
  const [topVendors, setTopVendors] = useState<any[]>([])
  const [vendorsByCategory, setVendorsByCategory] = useState<any[]>([])
  const [vendorPerformanceData, setVendorPerformanceData] = useState<any[]>([])
  const [vendorRatingDistribution, setVendorRatingDistribution] = useState<any[]>([])
  const [vendorRevenueByTime, setVendorRevenueByTime] = useState<any[]>([])

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
        const response = await fetch(`/api/admin/analytics/vendors?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Error fetching vendor performance analytics: ${response.statusText}`)
        }

        const data = await response.json()

        // Update state with fetched data
        setMetrics(data.metrics)
        setTopVendors(data.topVendors)
        setVendorsByCategory(data.vendorsByCategory)
        setVendorRatingDistribution(data.vendorRatingDistribution)
        setVendorPerformanceData(data.vendorPerformanceData)
        setVendorRevenueByTime(data.vendorRevenueByTime)

        // If there was an error but we got fallback data, show a toast
        if (data.error) {
          toast({
            title: "Using fallback data",
            description: "Could not fetch real data. Showing mock data instead.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to fetch vendor performance analytics:", error)
        toast({
          title: "Error",
          description: "Failed to fetch vendor performance analytics. Using mock data instead.",
          variant: "destructive",
        })

        // Set fallback data
        setMetrics({
          totalVendors: 378,
          activeVendors: 187,
          averageRating: 4.3,
          totalRevenue: 456789.45,
          averageOrdersPerVendor: 67.8,
          averagePreparationTime: 18.5,
          topPerformingCategories: ["Food", "Grocery", "Pharmacy"],
          growth: {
            vendors: 5.2,
            revenue: 15.7,
            orders: 12.3
          }
        })

        setTopVendors([
          { name: "Tasty Bites", orders: 1245, revenue: 45678.90, rating: 4.8 },
          { name: "Fresh Grocers", orders: 987, revenue: 38765.43, rating: 4.7 },
          { name: "Quick Pharmacy", orders: 765, revenue: 32456.78, rating: 4.6 },
          { name: "Burger Palace", orders: 654, revenue: 28765.43, rating: 4.5 },
          { name: "Pizza Heaven", orders: 543, revenue: 25432.10, rating: 4.4 }
        ])

        setVendorsByCategory([
          { name: "Food", value: 210 },
          { name: "Grocery", value: 85 },
          { name: "Pharmacy", value: 45 },
          { name: "Convenience", value: 28 },
          { name: "Other", value: 10 }
        ])

        // Generate mock performance data
        const performanceData = []
        for (let i = 0; i < 50; i++) {
          performanceData.push({
            name: `Vendor ${i+1}`,
            rating: 3 + Math.random() * 2, // Rating between 3 and 5
            orders: Math.floor(Math.random() * 1000) + 100, // Orders between 100 and 1100
            revenue: Math.floor(Math.random() * 50000) + 5000, // Revenue between 5000 and 55000
          })
        }
        setVendorPerformanceData(performanceData)

        setVendorRatingDistribution([
          { name: "5 Stars", value: 125 },
          { name: "4 Stars", value: 180 },
          { name: "3 Stars", value: 45 },
          { name: "2 Stars", value: 20 },
          { name: "1 Star", value: 8 }
        ])

        // Generate mock revenue data based on timeframe
        const revenueData = []
        if (timeframe === "day") {
          for (let i = 0; i < 24; i++) {
            revenueData.push({
              name: `${i}:00`,
              revenue: Math.floor(Math.random() * 5000) + 1000,
              orders: Math.floor(Math.random() * 50) + 10
            })
          }
        } else if (timeframe === "week") {
          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          for (let i = 0; i < 7; i++) {
            revenueData.push({
              name: days[i],
              revenue: Math.floor(Math.random() * 20000) + 5000,
              orders: Math.floor(Math.random() * 200) + 50
            })
          }
        } else if (timeframe === "month") {
          for (let i = 1; i <= 30; i++) {
            revenueData.push({
              name: i.toString(),
              revenue: Math.floor(Math.random() * 10000) + 2000,
              orders: Math.floor(Math.random() * 100) + 20
            })
          }
        } else {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          for (let i = 0; i < 12; i++) {
            revenueData.push({
              name: months[i],
              revenue: Math.floor(Math.random() * 500000) + 100000,
              orders: Math.floor(Math.random() * 5000) + 1000
            })
          }
        }
        setVendorRevenueByTime(revenueData)
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
      description: "Vendor performance analytics data export has started. You will be notified when it's ready.",
    })
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Vendor Performance</h1>
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
          title="Total Vendors"
          value={metrics.totalVendors.toLocaleString()}
          description={`+${metrics.growth.vendors}% from last period`}
          icon={<Store className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          loading={loading}
        />
        <AdminMetricCard
          title="Active Vendors"
          value={metrics.activeVendors.toLocaleString()}
          description={`${(metrics.activeVendors / metrics.totalVendors * 100).toFixed(1)}% of total vendors`}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          trend="neutral"
          loading={loading}
        />
        <AdminMetricCard
          title="Average Rating"
          value={metrics.averageRating.toFixed(1)}
          description="Out of 5 stars"
          icon={<Star className="h-4 w-4 text-muted-foreground" />}
          trend="neutral"
          loading={loading}
        />
        <AdminMetricCard
          title="Avg. Preparation Time"
          value={`${metrics.averagePreparationTime.toFixed(1)} min`}
          description="Per order"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          trend="neutral"
          loading={loading}
        />
      </div>

      {/* Vendor Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Revenue Over Time</CardTitle>
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
                  data={vendorRevenueByTime}
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

      {/* Vendor Performance Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Performance Matrix</CardTitle>
          <CardDescription>
            Relationship between ratings, orders, and revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis type="number" dataKey="rating" name="Rating" domain={[3, 5]} tickCount={5} />
                  <YAxis type="number" dataKey="orders" name="Orders" />
                  <ZAxis type="number" dataKey="revenue" name="Revenue" range={[50, 500]} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name) => {
                      if (name === 'Revenue') return [`$${Number(value).toLocaleString()}`, name]
                      return [value, name]
                    }}
                  />
                  <Legend />
                  <Scatter name="Vendors" data={vendorPerformanceData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Vendors</CardTitle>
          <CardDescription>
            Vendors with highest revenue and ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Vendor Name</th>
                    <th className="text-right py-3 px-4">Orders</th>
                    <th className="text-right py-3 px-4">Revenue</th>
                    <th className="text-right py-3 px-4">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topVendors.map((vendor, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{vendor.name}</td>
                      <td className="text-right py-3 px-4">{vendor.orders.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">${vendor.revenue.toLocaleString()}</td>
                      <td className="text-right py-3 px-4 flex items-center justify-end">
                        {vendor.rating.toFixed(1)}
                        <Star className="h-4 w-4 ml-1 text-yellow-500" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vendor Demographics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendors by Category</CardTitle>
            <CardDescription>
              Distribution of vendors across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vendorsByCategory}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Vendors']} />
                    <Bar dataKey="value" name="Vendors" fill="#8884d8">
                      {vendorsByCategory.map((entry, index) => (
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
            <CardTitle>Vendor Rating Distribution</CardTitle>
            <CardDescription>
              Distribution of vendors by rating
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
                      data={vendorRatingDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vendorRatingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Vendors']} />
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
            <CardTitle className="text-sm font-medium">Avg. Orders Per Vendor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageOrdersPerVendor.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In the selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vendor Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{metrics.growth.revenue}% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium">
              {metrics.topPerformingCategories.join(", ")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              By revenue and order volume
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
