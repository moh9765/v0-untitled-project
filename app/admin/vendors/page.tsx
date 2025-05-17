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
  Store, 
  Filter, 
  Eye, 
  Edit, 
  Lock, 
  Unlock, 
  Trash2,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  ShoppingBag,
  Percent,
  Tag
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Vendor {
  id: string
  name: string
  logo: string
  email: string
  phone: string
  status: "active" | "inactive" | "pending" | "suspended"
  rating: number
  totalOrders: number
  city: string
  address: string
  categories: string[]
  commission: {
    rate: number
    type: "percentage" | "fixed"
  }
  balance: number
  joinDate: string
  lastActive: string
  contactPerson: {
    name: string
    phone: string
    email: string
  }
  bankInfo: {
    accountName: string
    accountNumber: string
    bankName: string
  }
  productCount: number
  averageOrderValue: number
  fulfillmentRate: number
}

export default function VendorsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      // Simulate API call
      setTimeout(() => {
        const mockVendors: Vendor[] = Array.from({ length: 50 }, (_, i) => {
          const statuses = ["active", "inactive", "pending", "suspended"] as const
          const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"]
          const categories = [
            "Restaurant", "Grocery", "Pharmacy", "Convenience", "Bakery", 
            "Cafe", "Fast Food", "Liquor", "Pet Supplies", "Electronics"
          ]
          const commissionTypes = ["percentage", "fixed"] as const
          
          // Randomly select 1-3 categories
          const vendorCategories = []
          const numCategories = Math.floor(Math.random() * 3) + 1
          for (let j = 0; j < numCategories; j++) {
            const category = categories[Math.floor(Math.random() * categories.length)]
            if (!vendorCategories.includes(category)) {
              vendorCategories.push(category)
            }
          }
          
          return {
            id: `VEN-${100 + i}`,
            name: `Vendor ${i + 1}`,
            logo: "/placeholder.svg?height=80&width=80",
            email: `vendor${i + 1}@example.com`,
            phone: `+1 (555) ${100 + i}-${1000 + i}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            rating: Math.floor(Math.random() * 50) / 10 + 3,
            totalOrders: Math.floor(Math.random() * 10000),
            city: cities[Math.floor(Math.random() * cities.length)],
            address: `${1000 + Math.floor(Math.random() * 9000)} Main St, ${cities[Math.floor(Math.random() * cities.length)]}`,
            categories: vendorCategories,
            commission: {
              rate: Math.floor(Math.random() * 20) + 5,
              type: commissionTypes[Math.floor(Math.random() * commissionTypes.length)]
            },
            balance: Math.floor(Math.random() * 10000),
            joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
            lastActive: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
            contactPerson: {
              name: `Contact ${i + 1}`,
              phone: `+1 (555) ${200 + i}-${2000 + i}`,
              email: `contact${i + 1}@example.com`
            },
            bankInfo: {
              accountName: `Vendor ${i + 1} LLC`,
              accountNumber: `XXXX-XXXX-${1000 + i}`,
              bankName: `Bank of America`
            },
            productCount: Math.floor(Math.random() * 200) + 10,
            averageOrderValue: Math.floor(Math.random() * 5000) / 100 + 15,
            fulfillmentRate: Math.floor(Math.random() * 20) + 80
          }
        })
        
        setVendors(mockVendors)
        setFilteredVendors(mockVendors)
        setLoading(false)
      }, 1000)
    }

    fetchVendors()
  }, [])

  // Apply filters
  useEffect(() => {
    let result = vendors

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(vendor => vendor.status === statusFilter)
    }

    // Apply city filter
    if (cityFilter !== "all") {
      result = result.filter(vendor => vendor.city === cityFilter)
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(vendor => vendor.categories.includes(categoryFilter))
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        vendor =>
          vendor.name.toLowerCase().includes(query) ||
          vendor.email.toLowerCase().includes(query) ||
          vendor.phone.includes(query) ||
          vendor.id.toLowerCase().includes(query) ||
          vendor.address.toLowerCase().includes(query)
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "active") {
        result = result.filter(vendor => vendor.status === "active")
      } else if (activeTab === "inactive") {
        result = result.filter(vendor => vendor.status === "inactive")
      } else if (activeTab === "pending") {
        result = result.filter(vendor => vendor.status === "pending")
      } else if (activeTab === "suspended") {
        result = result.filter(vendor => vendor.status === "suspended")
      }
    }

    setFilteredVendors(result)
  }, [vendors, searchQuery, statusFilter, cityFilter, categoryFilter, activeTab])

  const handleViewVendor = (vendorId: string) => {
    router.push(`/admin/vendors/${vendorId}`)
  }

  const handleEditVendor = (vendorId: string) => {
    router.push(`/admin/vendors/${vendorId}/edit`)
  }

  const handleSuspendVendor = (vendorId: string, isSuspended: boolean) => {
    // This would be replaced with actual API calls
    toast({
      title: isSuspended ? "Vendor Reinstated" : "Vendor Suspended",
      description: `Vendor ${vendorId} has been ${isSuspended ? "reinstated" : "suspended"}.`,
    })
    
    // Update local state
    setVendors(vendors.map(vendor => 
      vendor.id === vendorId 
        ? { ...vendor, status: isSuspended ? "inactive" : "suspended" } 
        : vendor
    ))
  }

  const handleDeleteVendor = (vendorId: string) => {
    // This would be replaced with actual API calls
    toast({
      title: "Vendor Deleted",
      description: `Vendor ${vendorId} has been deleted.`,
      variant: "destructive",
    })
    
    // Update local state
    setVendors(vendors.filter(vendor => vendor.id !== vendorId))
  }

  const handleExportVendors = () => {
    // This would be replaced with actual export functionality
    toast({
      title: "Export Started",
      description: "Vendor data export has started. You will be notified when it's ready.",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "secondary"
      case "pending":
        return "warning"
      case "suspended":
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
  const cities = ["all", ...new Set(vendors.map(vendor => vendor.city))]

  // Get unique categories for filter
  const categories = ["all", ...new Set(vendors.flatMap(vendor => vendor.categories))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportVendors} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <a href="/admin/vendors/new" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Add Vendor
            </a>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendors</CardTitle>
          <CardDescription>
            Manage vendors, view their performance, and control their access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                All Vendors
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Active
              </TabsTrigger>
              <TabsTrigger value="inactive" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Inactive
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
              </TabsTrigger>
              <TabsTrigger value="suspended" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Suspended
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4 my-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search vendors..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
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
                        <TableHead>Vendor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Categories</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                            No vendors found matching the current filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredVendors.slice(0, 10).map((vendor) => (
                          <TableRow key={vendor.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md overflow-hidden relative">
                                  <Image
                                    src={vendor.logo}
                                    alt={vendor.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{vendor.name}</div>
                                  <div className="text-xs text-slate-500">{vendor.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(vendor.status)}>
                                {vendor.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                {vendor.rating.toFixed(1)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {vendor.categories.map((category, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{vendor.city}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Percent className="h-4 w-4 text-slate-500 mr-1" />
                                {vendor.commission.rate}%
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <ShoppingBag className="h-4 w-4 text-slate-500 mr-1" />
                                {vendor.totalOrders.toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Tag className="h-4 w-4 text-slate-500 mr-1" />
                                {vendor.productCount}
                              </div>
                            </TableCell>
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
                                  <DropdownMenuItem onClick={() => handleViewVendor(vendor.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditVendor(vendor.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Vendor
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleSuspendVendor(vendor.id, vendor.status === "suspended")}
                                  >
                                    {vendor.status === "suspended" ? (
                                      <>
                                        <Unlock className="mr-2 h-4 w-4" />
                                        Reinstate Vendor
                                      </>
                                    ) : (
                                      <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Suspend Vendor
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteVendor(vendor.id)}
                                    className="text-red-600 dark:text-red-400"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Vendor
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
