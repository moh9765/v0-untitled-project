"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { DateRangePicker } from "@/components/admin/date-range-picker"
import { AdminMetricCard } from "@/components/admin/admin-metric-card"
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts"
import {
  Gift,
  Award,
  Users,
  TrendingUp,
  Download,
  Calendar,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash,
  Plus,
  Star,
  Trophy,
  Zap,
  Truck,
  Percent,
  ShoppingBag
} from "lucide-react"

interface Reward {
  id: string
  title: string
  description: string
  points: number
  icon: string
  active: boolean
  redemptions: number
  createdAt: string
}

interface RewardLevel {
  id: string
  name: string
  threshold: number
  benefits: string[]
  users: number
}

interface UserReward {
  id: string
  userId: string
  userName: string
  email: string
  points: number
  level: string
  redeemed: number
  lastActivity: string
}

export default function RewardsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [timeframe, setTimeframe] = useState("month")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [rewards, setRewards] = useState<Reward[]>([])
  const [levels, setLevels] = useState<RewardLevel[]>([])
  const [userRewards, setUserRewards] = useState<UserReward[]>([])
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPoints: 0,
    redemptionRate: 0,
    avgPointsPerUser: 0,
    growth: {
      users: 0,
      redemptions: 0
    }
  })
  const [pointsDistribution, setPointsDistribution] = useState<any[]>([])
  const [redemptionsByReward, setRedemptionsByReward] = useState<any[]>([])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          // Generate mock rewards
          const mockRewards: Reward[] = [
            {
              id: "reward-1",
              title: "Free Delivery",
              description: "Get free delivery on your next order",
              points: 100,
              icon: "truck",
              active: true,
              redemptions: 245,
              createdAt: "2023-01-15T00:00:00Z"
            },
            {
              id: "reward-2",
              title: "20% Off",
              description: "Apply discount to your next purchase",
              points: 200,
              icon: "percent",
              active: true,
              redemptions: 187,
              createdAt: "2023-01-20T00:00:00Z"
            },
            {
              id: "reward-3",
              title: "Buy One Get One",
              description: "Redeem for eligible items",
              points: 300,
              icon: "gift",
              active: true,
              redemptions: 156,
              createdAt: "2023-02-05T00:00:00Z"
            },
            {
              id: "reward-4",
              title: "Priority Delivery",
              description: "Get priority delivery on your next order",
              points: 150,
              icon: "zap",
              active: true,
              redemptions: 98,
              createdAt: "2023-03-10T00:00:00Z"
            },
            {
              id: "reward-5",
              title: "Premium Membership (1 month)",
              description: "Get premium membership benefits for 1 month",
              points: 500,
              icon: "award",
              active: true,
              redemptions: 45,
              createdAt: "2023-04-15T00:00:00Z"
            }
          ]
          
          setRewards(mockRewards)
          
          // Generate mock levels
          const mockLevels: RewardLevel[] = [
            {
              id: "level-1",
              name: "Bronze",
              threshold: 0,
              benefits: ["Basic rewards access", "Birthday reward"],
              users: 2450
            },
            {
              id: "level-2",
              name: "Silver",
              threshold: 200,
              benefits: ["All Bronze benefits", "5% discount on all orders", "Exclusive offers"],
              users: 1230
            },
            {
              id: "level-3",
              name: "Gold",
              threshold: 500,
              benefits: ["All Silver benefits", "Free delivery on all orders", "Priority customer support"],
              users: 780
            },
            {
              id: "level-4",
              name: "Platinum",
              threshold: 1000,
              benefits: ["All Gold benefits", "10% discount on all orders", "Early access to new features", "Dedicated support"],
              users: 340
            }
          ]
          
          setLevels(mockLevels)
          
          // Generate mock user rewards
          const mockUserRewards: UserReward[] = Array.from({ length: 50 }, (_, i) => {
            const points = Math.floor(Math.random() * 1500)
            let level = "Bronze"
            
            if (points >= 1000) {
              level = "Platinum"
            } else if (points >= 500) {
              level = "Gold"
            } else if (points >= 200) {
              level = "Silver"
            }
            
            return {
              id: `user-reward-${i + 1}`,
              userId: `user-${1000 + i}`,
              userName: `User ${1000 + i}`,
              email: `user${1000 + i}@example.com`,
              points,
              level,
              redeemed: Math.floor(Math.random() * 10),
              lastActivity: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
            }
          })
          
          setUserRewards(mockUserRewards)
          
          // Calculate metrics
          const totalUsers = mockUserRewards.length
          const activeUsers = mockUserRewards.filter(u => 
            new Date(u.lastActivity).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
          ).length
          const totalPoints = mockUserRewards.reduce((sum, u) => sum + u.points, 0)
          const totalRedemptions = mockUserRewards.reduce((sum, u) => sum + u.redeemed, 0)
          const redemptionRate = totalUsers > 0 ? (totalRedemptions / totalUsers) * 100 : 0
          const avgPointsPerUser = totalUsers > 0 ? totalPoints / totalUsers : 0
          
          setMetrics({
            totalUsers,
            activeUsers,
            totalPoints,
            redemptionRate,
            avgPointsPerUser,
            growth: {
              users: 12.5,
              redemptions: 18.3
            }
          })
          
          // Calculate points distribution
          const pointsDistribution = [
            { name: "0-199", value: mockUserRewards.filter(u => u.points < 200).length },
            { name: "200-499", value: mockUserRewards.filter(u => u.points >= 200 && u.points < 500).length },
            { name: "500-999", value: mockUserRewards.filter(u => u.points >= 500 && u.points < 1000).length },
            { name: "1000+", value: mockUserRewards.filter(u => u.points >= 1000).length }
          ]
          
          setPointsDistribution(pointsDistribution)
          
          // Calculate redemptions by reward
          const redemptionsByReward = mockRewards.map(reward => ({
            name: reward.title,
            value: reward.redemptions
          }))
          
          setRedemptionsByReward(redemptionsByReward)
          
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch rewards data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch rewards data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
    
    fetchData()
  }, [timeframe, dateRange, toast])

  // Filter user rewards based on search query
  const filteredUserRewards = userRewards.filter(user => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      user.userName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.level.toLowerCase().includes(query)
    )
  })

  // Get icon component based on string name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "truck":
        return <Truck className="h-5 w-5" />
      case "percent":
        return <Percent className="h-5 w-5" />
      case "gift":
        return <Gift className="h-5 w-5" />
      case "zap":
        return <Zap className="h-5 w-5" />
      case "award":
        return <Award className="h-5 w-5" />
      case "star":
        return <Star className="h-5 w-5" />
      case "trophy":
        return <Trophy className="h-5 w-5" />
      case "shopping-bag":
        return <ShoppingBag className="h-5 w-5" />
      default:
        return <Gift className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rewards</h2>
          <p className="text-muted-foreground">
            Manage your loyalty program and customer rewards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          <Button variant="outline" className="ml-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="levels">Levels</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            variant={timeframe === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("week")}
          >
            Week
          </Button>
          <Button
            variant={timeframe === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("month")}
          >
            Month
          </Button>
          <Button
            variant={timeframe === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("year")}
          >
            Year
          </Button>
          <Button
            variant={timeframe === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("all")}
          >
            All Time
          </Button>
        </div>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AdminMetricCard
              title="Total Users"
              value={metrics.totalUsers.toLocaleString()}
              description={`${metrics.activeUsers} active in last 30 days`}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
              trend="up"
              loading={loading}
            />
            <AdminMetricCard
              title="Total Points"
              value={metrics.totalPoints.toLocaleString()}
              description={`${Math.round(metrics.avgPointsPerUser)} avg per user`}
              icon={<Star className="h-4 w-4 text-muted-foreground" />}
              trend="up"
              loading={loading}
            />
            <AdminMetricCard
              title="Redemption Rate"
              value={`${metrics.redemptionRate.toFixed(1)}%`}
              description={`+${metrics.growth.redemptions}% from last period`}
              icon={<Gift className="h-4 w-4 text-muted-foreground" />}
              trend="up"
              loading={loading}
            />
            <AdminMetricCard
              title="Active Rewards"
              value={rewards.filter(r => r.active).length}
              description={`${rewards.length} total rewards`}
              icon={<Award className="h-4 w-4 text-muted-foreground" />}
              trend="neutral"
              loading={loading}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Redemptions by Reward</CardTitle>
                <CardDescription>
                  Most popular rewards by redemption count
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={redemptionsByReward}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Redemptions" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Points Distribution</CardTitle>
                <CardDescription>
                  User distribution by points range
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pointsDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pointsDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#6366f1'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} users`} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Rewards</CardTitle>
                <CardDescription>
                  Create and manage rewards that users can redeem with points
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Reward
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reward</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Redemptions</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rewards.map((reward) => (
                        <TableRow key={reward.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 p-2 rounded-md text-primary">
                                {getIconComponent(reward.icon)}
                              </div>
                              <span className="font-medium">{reward.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{reward.description}</TableCell>
                          <TableCell>{reward.points}</TableCell>
                          <TableCell>{reward.redemptions}</TableCell>
                          <TableCell>
                            <Badge variant={reward.active ? "default" : "secondary"}>
                              {reward.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(reward.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="levels" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Reward Levels</CardTitle>
                <CardDescription>
                  Configure loyalty program tiers and benefits
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Level
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Level</TableHead>
                        <TableHead>Point Threshold</TableHead>
                        <TableHead>Benefits</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {levels.map((level) => (
                        <TableRow key={level.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 p-2 rounded-md text-primary">
                                <Trophy className="h-4 w-4" />
                              </div>
                              <span className="font-medium">{level.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{level.threshold} points</TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside text-sm">
                              {level.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell>{level.users.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Rewards</CardTitle>
              <CardDescription>
                View and manage user reward points and redemptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            Points
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Redeemed</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUserRewards.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUserRewards.slice(0, 10).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.userName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.points}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {user.level}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.redeemed}</TableCell>
                            <TableCell>{new Date(user.lastActivity).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Adjust Points
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
