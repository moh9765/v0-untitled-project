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
  UserPlus,
  Filter,
  Eye,
  Edit,
  Lock,
  Unlock,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Truck
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "customer" | "driver" | "admin"
  status: "active" | "inactive" | "blocked"
  registrationDate: string
  city: string
  totalOrders: number
}

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/users?role=${activeTab}&limit=50`)

        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`)
        }

        const data = await response.json()

        // Add default phone and city values since they're not in our DB yet
        const usersWithDefaults = data.users.map((user: any) => ({
          ...user,
          phone: user.phone || `+1 (555) 000-0000`,
          city: user.city || "Unknown",
          status: user.status || "active"
        }))

        setUsers(usersWithDefaults)
        setFilteredUsers(usersWithDefaults)
      } catch (error) {
        console.error("Failed to fetch users:", error)
        toast({
          title: "Error",
          description: "Failed to fetch users. Please try again.",
          variant: "destructive",
        })

        // Set empty array on error
        setUsers([])
        setFilteredUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [activeTab, toast])

  // Apply filters
  useEffect(() => {
    let result = users

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(user => user.status === statusFilter)
    }

    // Apply city filter
    if (cityFilter !== "all") {
      result = result.filter(user => user.city === cityFilter)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.includes(query) ||
          user.id.toLowerCase().includes(query)
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      result = result.filter(user => user.role === activeTab)
    }

    setFilteredUsers(result)
  }, [users, searchQuery, roleFilter, statusFilter, cityFilter, activeTab])

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`)
  }

  const handleEditUser = (userId: string) => {
    router.push(`/admin/users/${userId}/edit`)
  }

  const handleBlockUser = (userId: string, isBlocked: boolean) => {
    // This would be replaced with actual API calls
    toast({
      title: isBlocked ? "User Unblocked" : "User Blocked",
      description: `User ${userId} has been ${isBlocked ? "unblocked" : "blocked"}.`,
    })

    // Update local state
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: isBlocked ? "active" : "blocked" }
        : user
    ))
  }

  const handleResetPassword = (userId: string) => {
    // This would be replaced with actual API calls
    toast({
      title: "Password Reset Email Sent",
      description: `A password reset email has been sent to the user.`,
    })
  }

  const handleDeleteUser = (userId: string) => {
    // This would be replaced with actual API calls
    toast({
      title: "User Deleted",
      description: `User ${userId} has been deleted.`,
      variant: "destructive",
    })

    // Update local state
    setUsers(users.filter(user => user.id !== userId))
  }

  const handleExportUsers = () => {
    // This would be replaced with actual export functionality
    toast({
      title: "Export Started",
      description: "User data export has started. You will be notified when it's ready.",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "warning"
      case "blocked":
        return "destructive"
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
    }).format(date)
  }

  // Get unique cities for filter
  const cities = ["all", ...new Set(users.map(user => user.city))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportUsers} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <a href="/admin/users/new" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </a>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage users, view their details, and control their access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                All Users
              </TabsTrigger>
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Customers
              </TabsTrigger>
              <TabsTrigger value="driver" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Drivers
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <UserX className="h-4 w-4" />
                Admins
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4 my-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search users..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
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
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                            No users found matching the current filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.slice(0, 10).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(user.status)}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(user.registrationDate)}</TableCell>
                            <TableCell>{user.city}</TableCell>
                            <TableCell>{user.totalOrders}</TableCell>
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
                                  <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleBlockUser(user.id, user.status === "blocked")}
                                  >
                                    {user.status === "blocked" ? (
                                      <>
                                        <Unlock className="mr-2 h-4 w-4" />
                                        Unblock User
                                      </>
                                    ) : (
                                      <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Block User
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600 dark:text-red-400"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete User
                                  </DropdownMenuItem>
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
