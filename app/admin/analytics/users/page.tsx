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
  UserPlus,
  UserMinus,
  Store,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Map,
  Activity,
  Smartphone,
  Globe,
  Repeat
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts"

export default function UserGrowthAnalyticsPage() {
  const { toast } = useToast()
  const [timeframe, setTimeframe] = useState("month")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    churnRate: 0,
    retentionRate: 0,
    averageOrdersPerUser: 0,
    customerLifetimeValue: 0,
    growth: {
      users: 0,
      active: 0,
      retention: 0
    }
  })
  const [usersByType, setUsersByType] = useState<any[]>([])
  const [usersByCity, setUsersByCity] = useState<any[]>([])
  const [userGrowthData, setUserGrowthData] = useState<any[]>([])
  const [userRetentionData, setUserRetentionData] = useState<any[]>([])
  const [usersByPlatform, setUsersByPlatform] = useState<any[]>([])
  const [userEngagementData, setUserEngagementData] = useState<any[]>([])

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
        const response = await fetch(`/api/admin/analytics/users?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Error fetching user growth analytics: ${response.statusText}`)
        }

        const data = await response.json()

        // Update state with fetched data
        setMetrics(data.metrics)
        setUserGrowthData(data.userGrowthData)
        setUsersByType(data.usersByType)
        setUsersByPlatform(data.usersByPlatform)
        setUsersByCity(data.usersByCity)
        setUserRetentionData(data.userRetentionData)
        setUserEngagementData(data.userEngagementData)

        // If there was an error but we got fallback data, show a toast
        if (data.error) {
          toast({
            title: "Using fallback data",
            description: "Could not fetch real data. Showing mock data instead.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to fetch user growth analytics:", error)
        toast({
          title: "Error",
          description: "Failed to fetch user growth analytics. Using mock data instead.",
          variant: "destructive",
        })

        // Set fallback data
        setMetrics({
          totalUsers: 45678,
          newUsers: 2345,
          activeUsers: 28456,
          churnRate: 3.2,
          retentionRate: 78.5,
          averageOrdersPerUser: 2.7,
          customerLifetimeValue: 187.45,
          growth: {
            users: 8.4,
            active: 5.2,
            retention: 1.5
          }
        })

        setUsersByType([
          { name: "customer", value: 42500 },
          { name: "driver", value: 2800 },
          { name: "admin", value: 378 }
        ])

        setUsersByCity([
          { name: "New York", value: 12500 },
          { name: "Los Angeles", value: 8700 },
          { name: "Chicago", value: 6500 },
          { name: "Houston", value: 5200 },
          { name: "Miami", value: 4100 },
          { name: "Other", value: 8678 }
        ])

        // Generate mock growth data based on timeframe
        const growthData = []
        if (timeframe === "day") {
          for (let i = 0; i < 24; i++) {
            growthData.push({
              name: `${i}:00`,
              newUsers: Math.floor(Math.random() * 50) + 10,
              activeUsers: Math.floor(Math.random() * 500) + 100
            })
          }
        } else if (timeframe === "week") {
          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          for (let i = 0; i < 7; i++) {
            growthData.push({
              name: days[i],
              newUsers: Math.floor(Math.random() * 200) + 50,
              activeUsers: Math.floor(Math.random() * 2000) + 500
            })
          }
        } else if (timeframe === "month") {
          for (let i = 1; i <= 30; i++) {
            growthData.push({
              name: i.toString(),
              newUsers: Math.floor(Math.random() * 100) + 20,
              activeUsers: Math.floor(Math.random() * 1000) + 200
            })
          }
        } else {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          for (let i = 0; i < 12; i++) {
            growthData.push({
              name: months[i],
              newUsers: Math.floor(Math.random() * 5000) + 1000,
              activeUsers: Math.floor(Math.random() * 50000) + 10000
            })
          }
        }
        setUserGrowthData(growthData)

        setUserRetentionData([
          { name: "Week 1", retention: 100 },
          { name: "Week 2", retention: 85 },
          { name: "Week 3", retention: 75 },
          { name: "Week 4", retention: 68 },
          { name: "Week 5", retention: 62 },
          { name: "Week 6", retention: 58 },
          { name: "Week 7", retention: 55 },
          { name: "Week 8", retention: 52 }
        ])

        setUsersByPlatform([
          { name: "iOS", value: 22500 },
          { name: "Android", value: 18700 },
          { name: "Web", value: 4478 }
        ])

        setUserEngagementData([
          { subject: 'Orders', A: 85, fullMark: 100 },
          { subject: 'Logins', A: 78, fullMark: 100 },
          { subject: 'Browsing', A: 92, fullMark: 100 },
          { subject: 'Reviews', A: 45, fullMark: 100 },
          { subject: 'Referrals', A: 32, fullMark: 100 },
          { subject: 'Support', A: 28, fullMark: 100 }
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
      description: "User growth analytics data export has started. You will be notified when it's ready.",
    })
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">User Growth Analytics</h1>
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
          title="Total Users"
          value={metrics.totalUsers.toLocaleString()}
          description={`+${metrics.growth.users}% from last period`}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          loading={loading}
        />
        <AdminMetricCard
          title="New Users"
          value={metrics.newUsers.toLocaleString()}
          description={`+${metrics.growth.users}% from last period`}
          icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          loading={loading}
        />
        <AdminMetricCard
          title="Active Users"
          value={metrics.activeUsers.toLocaleString()}
          description={`+${metrics.growth.active}% from last period`}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          loading={loading}
        />
        <AdminMetricCard
          title="Retention Rate"
          value={`${metrics.retentionRate}%`}
          description={`+${metrics.growth.retention}% from last period`}
          icon={<Repeat className="h-4 w-4 text-muted-foreground" />}
          trend="up"
          loading={loading}
        />
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth Over Time</CardTitle>
          <CardDescription>
            New and active users for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userGrowthData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Demographics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Users by Type</CardTitle>
            <CardDescription>
              Distribution of users by account type
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
                      data={usersByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {usersByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Users']} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users by Platform</CardTitle>
            <CardDescription>
              Distribution of users by device platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usersByPlatform}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Users']} />
                    <Bar dataKey="value" name="Users" fill="#8884d8">
                      {usersByPlatform.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Retention and Engagement */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Retention</CardTitle>
            <CardDescription>
              Percentage of users retained over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userRetentionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
                    <Line type="monotone" dataKey="retention" name="Retention Rate" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>
              User engagement metrics across different activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={userEngagementData}>
                    <PolarGrid className="stroke-slate-200 dark:stroke-slate-700" />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Engagement" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Engagement']} />
                  </RadarChart>
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
            <CardTitle className="text-sm font-medium">Avg. Orders Per User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageOrdersPerUser.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In the last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.customerLifetimeValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average revenue per user
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.churnRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Users lost in the last 30 days
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
