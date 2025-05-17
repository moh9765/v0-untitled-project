"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  CreditCard,
  Wallet,
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from "lucide-react"

interface Transaction {
  id: string
  type: "payment" | "refund" | "payout" | "fee"
  amount: number
  status: "completed" | "pending" | "failed" | "processing"
  date: string
  method: "credit_card" | "wallet" | "cash" | "bank_transfer"
  customer: string
  orderId?: string
  vendorId?: string
  driverId?: string
  description: string
}

export default function PaymentsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [timeframe, setTimeframe] = useState("month")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalRefunds: 0,
    totalPayouts: 0,
    totalFees: 0,
    pendingAmount: 0,
    growth: {
      revenue: 0,
      transactions: 0
    }
  })
  const [paymentMethods, setPaymentMethods] = useState([
    { name: "Credit Card", value: 0 },
    { name: "Wallet", value: 0 },
    { name: "Cash", value: 0 },
    { name: "Bank Transfer", value: 0 }
  ])
  const [revenueByTime, setRevenueByTime] = useState<any[]>([])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          // Generate mock transactions
          const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => {
            const types = ["payment", "refund", "payout", "fee"] as const
            const statuses = ["completed", "pending", "failed", "processing"] as const
            const methods = ["credit_card", "wallet", "cash", "bank_transfer"] as const
            
            const type = types[Math.floor(Math.random() * types.length)]
            const amount = type === "payment" || type === "fee" 
              ? Math.floor(Math.random() * 200) + 10 
              : -(Math.floor(Math.random() * 200) + 10)
            
            return {
              id: `TRX-${1000 + i}`,
              type,
              amount: Math.abs(amount),
              status: statuses[Math.floor(Math.random() * statuses.length)],
              date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
              method: methods[Math.floor(Math.random() * methods.length)],
              customer: `Customer ${Math.floor(Math.random() * 100) + 1}`,
              orderId: type === "payment" || type === "refund" ? `ORD-${2000 + i}` : undefined,
              vendorId: type === "payout" ? `VEN-${3000 + i}` : undefined,
              driverId: type === "payout" ? `DRV-${4000 + i}` : undefined,
              description: getTransactionDescription(type)
            }
          })
          
          setTransactions(mockTransactions)
          
          // Calculate metrics
          const totalRevenue = mockTransactions
            .filter(t => t.type === "payment" && t.status === "completed")
            .reduce((sum, t) => sum + t.amount, 0)
            
          const totalRefunds = mockTransactions
            .filter(t => t.type === "refund" && t.status === "completed")
            .reduce((sum, t) => sum + t.amount, 0)
            
          const totalPayouts = mockTransactions
            .filter(t => t.type === "payout" && t.status === "completed")
            .reduce((sum, t) => sum + t.amount, 0)
            
          const totalFees = mockTransactions
            .filter(t => t.type === "fee" && t.status === "completed")
            .reduce((sum, t) => sum + t.amount, 0)
            
          const pendingAmount = mockTransactions
            .filter(t => t.status === "pending")
            .reduce((sum, t) => sum + t.amount, 0)
          
          setMetrics({
            totalRevenue,
            totalRefunds,
            totalPayouts,
            totalFees,
            pendingAmount,
            growth: {
              revenue: 12.5,
              transactions: 8.3
            }
          })
          
          // Calculate payment methods distribution
          const methodTotals = mockTransactions
            .filter(t => t.type === "payment" && t.status === "completed")
            .reduce((acc, t) => {
              acc[t.method] = (acc[t.method] || 0) + t.amount
              return acc
            }, {} as Record<string, number>)
            
          setPaymentMethods([
            { name: "Credit Card", value: methodTotals.credit_card || 0 },
            { name: "Wallet", value: methodTotals.wallet || 0 },
            { name: "Cash", value: methodTotals.cash || 0 },
            { name: "Bank Transfer", value: methodTotals.bank_transfer || 0 }
          ])
          
          // Generate revenue by time data
          const timeData = []
          if (timeframe === "day") {
            // Hourly data for today
            for (let i = 0; i < 24; i++) {
              timeData.push({
                name: `${i}:00`,
                revenue: Math.floor(Math.random() * 500) + 100,
                transactions: Math.floor(Math.random() * 10) + 1
              })
            }
          } else if (timeframe === "week") {
            // Daily data for this week
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            for (let i = 0; i < 7; i++) {
              timeData.push({
                name: days[i],
                revenue: Math.floor(Math.random() * 2000) + 500,
                transactions: Math.floor(Math.random() * 50) + 10
              })
            }
          } else if (timeframe === "month") {
            // Daily data for this month
            for (let i = 1; i <= 30; i++) {
              timeData.push({
                name: i.toString(),
                revenue: Math.floor(Math.random() * 1000) + 200,
                transactions: Math.floor(Math.random() * 20) + 5
              })
            }
          } else {
            // Monthly data for this year
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            for (let i = 0; i < 12; i++) {
              timeData.push({
                name: months[i],
                revenue: Math.floor(Math.random() * 50000) + 10000,
                transactions: Math.floor(Math.random() * 500) + 100
              })
            }
          }
          setRevenueByTime(timeData)
          
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch payment data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch payment data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
    
    fetchData()
  }, [timeframe, dateRange, toast])

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    return (
      transaction.id.toLowerCase().includes(query) ||
      transaction.customer.toLowerCase().includes(query) ||
      transaction.description.toLowerCase().includes(query) ||
      (transaction.orderId && transaction.orderId.toLowerCase().includes(query))
    )
  })

  // Helper function to get transaction description
  function getTransactionDescription(type: Transaction["type"]): string {
    switch (type) {
      case "payment":
        return "Payment for order"
      case "refund":
        return "Refund for order"
      case "payout":
        return "Payout to vendor/driver"
      case "fee":
        return "Platform fee"
      default:
        return "Transaction"
    }
  }

  // Helper function to get status badge
  function getStatusBadge(status: Transaction["status"]) {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle className="mr-1 h-3 w-3" /> Completed</Badge>
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>
      case "failed":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Failed</Badge>
      case "processing":
        return <Badge variant="secondary"><RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Processing</Badge>
      default:
        return <Badge variant="outline"><AlertCircle className="mr-1 h-3 w-3" /> Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">
            Manage and track all payment transactions in your platform
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
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            variant={timeframe === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("day")}
          >
            Day
          </Button>
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
        </div>

        <TabsContent value="overview" className="mt-6 space-y-6">
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
              title="Total Refunds"
              value={`$${metrics.totalRefunds.toLocaleString()}`}
              description="3.2% of total revenue"
              icon={<RefreshCw className="h-4 w-4 text-muted-foreground" />}
              trend="neutral"
              loading={loading}
            />
            <AdminMetricCard
              title="Total Payouts"
              value={`$${metrics.totalPayouts.toLocaleString()}`}
              description="To vendors and drivers"
              icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
              trend="neutral"
              loading={loading}
            />
            <AdminMetricCard
              title="Pending Amount"
              value={`$${metrics.pendingAmount.toLocaleString()}`}
              description="Awaiting processing"
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              trend="neutral"
              loading={loading}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Payment revenue for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueByTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue ($)" fill="#3b82f6" />
                      <Bar dataKey="transactions" name="Transactions" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Distribution by payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethods}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#6366f1'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View and manage all payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
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
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            Amount
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                            No transactions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.slice(0, 10).map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.id}</TableCell>
                            <TableCell className="capitalize">{transaction.type}</TableCell>
                            <TableCell className={transaction.type === "refund" ? "text-red-500" : ""}>
                              ${transaction.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell className="capitalize">{transaction.method.replace('_', ' ')}</TableCell>
                            <TableCell>{transaction.customer}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
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

        <TabsContent value="payouts" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor & Driver Payouts</CardTitle>
              <CardDescription>
                Manage payouts to vendors and drivers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payouts..."
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button>
                  Process Payouts
                </Button>
              </div>

              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions
                        .filter(t => t.type === "payout")
                        .slice(0, 5)
                        .map((payout) => (
                          <TableRow key={payout.id}>
                            <TableCell className="font-medium">{payout.id}</TableCell>
                            <TableCell>{payout.vendorId ? `Vendor ${payout.vendorId}` : `Driver ${payout.driverId}`}</TableCell>
                            <TableCell>{payout.vendorId ? "Vendor" : "Driver"}</TableCell>
                            <TableCell>${payout.amount.toFixed(2)}</TableCell>
                            <TableCell>{getStatusBadge(payout.status)}</TableCell>
                            <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                            <TableCell className="capitalize">{payout.method.replace('_', ' ')}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
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

        <TabsContent value="settings" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment methods and processing settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Methods</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stripe">Stripe API Key</Label>
                    <Input id="stripe" type="password" value="sk_test_•••••••••••••••••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypal">PayPal Client ID</Label>
                    <Input id="paypal" type="password" value="client_id_•••••••••••••••••••••••" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Test Connection</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Commission Settings</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vendor_commission">Vendor Commission (%)</Label>
                    <Input id="vendor_commission" type="number" defaultValue="15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driver_commission">Driver Commission (%)</Label>
                    <Input id="driver_commission" type="number" defaultValue="10" />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
