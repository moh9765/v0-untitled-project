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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
  MapPin,
  Star,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Map
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
import { AdminDriverMap } from "@/components/admin/admin-driver-map"

interface Driver {
  id: string
  name: string
  email: string
  phone: string
  status: "online" | "offline" | "on_delivery" | "suspended"
  rating: number
  totalDeliveries: number
  acceptanceRate: number
  city: string
  currentLocation?: {
    lat: number
    lng: number
    address: string
  }
  vehicle: {
    type: "car" | "motorcycle" | "bicycle" | "scooter"
    model: string
    licensePlate: string
  }
  earnings: {
    today: number
    week: number
    month: number
    total: number
  }
  activeOrder?: {
    id: string
    status: string
    estimatedDeliveryTime: string
  }
  joinDate: string
  lastActive: string
}

export default function DriversPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const [vehicleFilter, setVehicleFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [showMap, setShowMap] = useState(false)

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true)
      try {
        // Map the activeTab to status for API filtering
        let statusParam = "all";
        if (activeTab === "online") {
          statusParam = "online";
        } else if (activeTab === "offline") {
          statusParam = "offline";
        } else if (activeTab === "on_delivery") {
          statusParam = "on_delivery";
        } else if (activeTab === "suspended") {
          statusParam = "suspended";
        }

        const response = await fetch(`/api/admin/drivers?status=${statusParam}&limit=50`)

        if (!response.ok) {
          throw new Error(`Error fetching drivers: ${response.statusText}`)
        }

        const data = await response.json()

        // Add default values for fields that might not be in our DB yet
        const driversWithDefaults = data.drivers.map((driver: any) => ({
          ...driver,
          phone: driver.phone || `+1 (555) 000-0000`,
          city: driver.city || "Unknown",
          status: driver.status || "offline",
          rating: driver.rating || 4.5,
          totalDeliveries: driver.totalDeliveries || 0,
          acceptanceRate: driver.acceptanceRate || 95,
          vehicle: driver.vehicle || {
            type: "car",
            model: "Unknown model",
            licensePlate: `ABC-${driver.id}`
          },
          earnings: driver.earnings || {
            today: 0,
            week: 0,
            month: 0,
            total: 0
          }
        }))

        setDrivers(driversWithDefaults)
        setFilteredDrivers(driversWithDefaults)
      } catch (error) {
        console.error("Failed to fetch drivers:", error)
        toast({
          title: "Error",
          description: "Failed to fetch drivers. Please try again.",
          variant: "destructive",
        })

        // Set empty array on error
        setDrivers([])
        setFilteredDrivers([])
      } finally {
        setLoading(false)
      }
    }

    fetchDrivers()
  }, [activeTab, toast])

  // Apply filters
  useEffect(() => {
    let result = drivers

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(driver => driver.status === statusFilter)
    }

    // Apply city filter
    if (cityFilter !== "all") {
      result = result.filter(driver => driver.city === cityFilter)
    }

    // Apply vehicle filter
    if (vehicleFilter !== "all") {
      result = result.filter(driver => driver.vehicle.type === vehicleFilter)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        driver =>
          driver.name.toLowerCase().includes(query) ||
          driver.email.toLowerCase().includes(query) ||
          driver.phone.includes(query) ||
          driver.id.toLowerCase().includes(query)
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "online") {
        result = result.filter(driver => driver.status === "online" || driver.status === "on_delivery")
      } else if (activeTab === "offline") {
        result = result.filter(driver => driver.status === "offline")
      } else if (activeTab === "suspended") {
        result = result.filter(driver => driver.status === "suspended")
      } else if (activeTab === "on_delivery") {
        result = result.filter(driver => driver.status === "on_delivery")
      }
    }

    setFilteredDrivers(result)
  }, [drivers, searchQuery, statusFilter, cityFilter, vehicleFilter, activeTab])

  const handleViewDriver = (driverId: string) => {
    router.push(`/admin/drivers/${driverId}`)
  }

  const handleEditDriver = (driverId: string) => {
    router.push(`/admin/drivers/${driverId}/edit`)
  }

  const handleSuspendDriver = async (driverId: string, isSuspended: boolean) => {
    try {
      // Call the API to update driver status
      const response = await fetch(`/api/admin/drivers/${driverId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: isSuspended ? "offline" : "suspended"
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update driver status: ${response.statusText}`);
      }

      toast({
        title: isSuspended ? "Driver Reinstated" : "Driver Suspended",
        description: `Driver ${driverId} has been ${isSuspended ? "reinstated" : "suspended"}.`,
      });

      // Update local state
      setDrivers(drivers.map(driver =>
        driver.id === driverId
          ? { ...driver, status: isSuspended ? "offline" : "suspended" }
          : driver
      ));
    } catch (error) {
      console.error("Error updating driver status:", error);
      toast({
        title: "Error",
        description: "Failed to update driver status. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleDeleteDriver = async (driverId: string) => {
    try {
      // Call the API to delete driver
      const response = await fetch(`/api/admin/drivers/${driverId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete driver: ${response.statusText}`);
      }

      toast({
        title: "Driver Deleted",
        description: `Driver ${driverId} has been deleted.`,
        variant: "destructive",
      });

      // Update local state
      setDrivers(drivers.filter(driver => driver.id !== driverId));
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast({
        title: "Error",
        description: "Failed to delete driver. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleExportDrivers = () => {
    // This would be replaced with actual export functionality
    toast({
      title: "Export Started",
      description: "Driver data export has started. You will be notified when it's ready.",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "online":
        return "success"
      case "offline":
        return "secondary"
      case "on_delivery":
        return "default"
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
  const cities = ["all", ...new Set(drivers.map(driver => driver.city))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowMap(!showMap)}
            variant={showMap ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Map className="h-4 w-4" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
          <Button onClick={handleExportDrivers} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <a href="/admin/drivers/new" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Driver
            </a>
          </Button>
        </div>
      </div>

      {showMap && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Driver Locations</CardTitle>
            <CardDescription>
              Real-time map of all active drivers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full rounded-md border">
              <AdminDriverMap
                drivers={filteredDrivers.filter(d => d.currentLocation)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Drivers</CardTitle>
          <CardDescription>
            Manage drivers, view their performance, and control their access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                All Drivers
              </TabsTrigger>
              <TabsTrigger value="online" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Online
              </TabsTrigger>
              <TabsTrigger value="offline" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Offline
              </TabsTrigger>
              <TabsTrigger value="on_delivery" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                On Delivery
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
                  placeholder="Search drivers..."
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
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="on_delivery">On Delivery</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicles</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Acceptance Rate</TableHead>
                        <TableHead>Earnings (Today)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDrivers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                            No drivers found matching the current filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDrivers.slice(0, 10).map((driver) => (
                          <TableRow key={driver.id}>
                            <TableCell className="font-medium">{driver.id}</TableCell>
                            <TableCell>{driver.name}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(driver.status)}>
                                {driver.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                {driver.rating.toFixed(1)}
                              </div>
                            </TableCell>
                            <TableCell>{driver.city}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span className="capitalize">{driver.vehicle.type}</span>
                                <span className="text-xs text-slate-500">({driver.vehicle.licensePlate})</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-xs">
                                  <span>{driver.acceptanceRate}%</span>
                                </div>
                                <Progress value={driver.acceptanceRate} className="h-2" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                                ${driver.earnings.today.toFixed(2)}
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
                                  <DropdownMenuItem onClick={() => handleViewDriver(driver.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditDriver(driver.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Driver
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleSuspendDriver(driver.id, driver.status === "suspended")}
                                  >
                                    {driver.status === "suspended" ? (
                                      <>
                                        <Unlock className="mr-2 h-4 w-4" />
                                        Reinstate Driver
                                      </>
                                    ) : (
                                      <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Suspend Driver
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteDriver(driver.id)}
                                    className="text-red-600 dark:text-red-400"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Driver
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
