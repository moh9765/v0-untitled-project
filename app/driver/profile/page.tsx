"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { User, Globe, Moon, Bell, LogOut, Car, Phone, MapPin, Edit, Save, Truck, Wallet } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { logout } from "@/lib/auth-utils"

export default function DriverProfilePage() {
  const router = useRouter()
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // Driver profile information
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 123-4567")
  const [vehicleInfo, setVehicleInfo] = useState({
    type: "Car",
    model: "Toyota Camry",
    year: "2020",
    color: "Silver",
    licensePlate: "ABC-1234"
  })
  const [address, setAddress] = useState("123 Main St, New York, NY 10001")

  // Edit mode states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingVehicle, setIsEditingVehicle] = useState(false)

  // Form states
  const [formPhone, setFormPhone] = useState("")
  const [formAddress, setFormAddress] = useState("")
  const [formVehicle, setFormVehicle] = useState({
    type: "",
    model: "",
    year: "",
    color: "",
    licensePlate: ""
  })

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const userRole = localStorage.getItem("user_role")
    const email = localStorage.getItem("user_email") || ""
    const id = localStorage.getItem("user_id")

    // Extract name from email (in a real app, you'd get this from the user profile)
    const name = email.split("@")[0]
    setUserName(name.charAt(0).toUpperCase() + name.slice(1))
    setUserEmail(email)
    setUserId(id)

    setIsAuthenticated(authStatus)
    setIsLoading(false)

    // Redirect if not authenticated or wrong role
    if (!authStatus || userRole !== "driver") {
      router.push("/auth/login?role=driver")
      return
    }

    // Check theme preference
    const theme = localStorage.getItem("theme")
    setDarkMode(theme === "dark")

    // Get driver's online status from localStorage or default to online
    const savedOnlineStatus = localStorage.getItem("driver_online_status")
    if (savedOnlineStatus !== null) {
      setIsOnline(savedOnlineStatus === "true")
    }

    // In a real app, we would fetch the driver's profile from the API
    // For now, we'll use mock data

    // Initialize form states with current values
    setFormPhone(phoneNumber)
    setFormAddress(address)
    setFormVehicle({...vehicleInfo})
  }, [router])

  const handleLogout = async () => {
    try {
      // Show loading toast
      toast({
        title: "Logging out...",
        description: "Please wait while we log you out.",
      })

      // Use the comprehensive logout function
      await logout("/auth/login?role=driver")

      // Note: The toast below won't be shown because we're redirecting
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error("Logout error:", error)

      // Show error toast
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out. Trying emergency logout.",
        variant: "destructive",
      })

      // Emergency fallback - direct redirect to login page
      // The login page has its own logout mechanism that will clear cookies
      window.location.href = "/auth/login?role=driver";
    }
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("theme", newMode ? "dark" : "light")

    // In a real app, this would update the theme
    document.documentElement.classList.toggle("dark", newMode)

    toast({
      title: newMode ? t("settings.darkMode") : t("settings.lightMode"),
      description: "Theme updated successfully",
    })
  }

  const toggleNotifications = () => {
    setNotifications(!notifications)

    toast({
      title: "Notifications " + (!notifications ? "enabled" : "disabled"),
      description: "Notification settings updated",
    })
  }

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline
    setIsOnline(newStatus)

    // Save to localStorage
    localStorage.setItem("driver_online_status", newStatus.toString())

    // In a real app, we would update the driver's status in the database

    toast({
      title: newStatus ? "You are now online" : "You are now offline",
      description: newStatus
        ? "You'll now receive order requests"
        : "You won't receive new order requests",
      variant: newStatus ? "default" : "destructive",
    })
  }

  const handleEditProfile = () => {
    setIsEditingProfile(true)
    setFormPhone(phoneNumber)
    setFormAddress(address)
  }

  const handleSaveProfile = () => {
    // In a real app, we would save to the database
    setPhoneNumber(formPhone)
    setAddress(formAddress)
    setIsEditingProfile(false)

    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved",
    })
  }

  const handleEditVehicle = () => {
    setIsEditingVehicle(true)
    setFormVehicle({...vehicleInfo})
  }

  const handleSaveVehicle = () => {
    // In a real app, we would save to the database
    setVehicleInfo({...formVehicle})
    setIsEditingVehicle(false)

    toast({
      title: "Vehicle Information Updated",
      description: "Your vehicle information has been saved",
    })
  }

  const handleCancelEdit = (type: 'profile' | 'vehicle') => {
    if (type === 'profile') {
      setIsEditingProfile(false)
    } else {
      setIsEditingVehicle(false)
    }
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <span className="sr-only">Back</span>
            {dir === "rtl" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </Button>
          <MobileNav role="driver" />
          <div className="ml-auto flex items-center space-x-4">
            <LanguageSelector size="sm" variant="ghost" />
            <span className="text-sm font-medium">{t("common.greeting") || `Hi, ${userName}`}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        </div>

        {/* Driver Status */}
        <Card className={`border-2 ${isOnline ? 'border-green-500 dark:border-green-700' : 'border-red-500 dark:border-red-700'}`}>
          <CardHeader className={`pb-2 ${isOnline ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}>
            <div className="flex justify-between items-center">
              <CardTitle>Driver Status</CardTitle>
              <Switch
                checked={isOnline}
                onCheckedChange={toggleOnlineStatus}
                className={isOnline ? 'bg-green-600' : 'bg-slate-200'}
              />
            </div>
            <CardDescription>
              {isOnline
                ? "You're online and can receive delivery requests"
                : "You're offline and won't receive new requests"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm">
              <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isOnline ? 'Active' : 'Inactive'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>{t("delivery.profile")}</CardTitle>
              <CardDescription>{t("settings.account")}</CardDescription>
            </div>
            {!isEditingProfile ? (
              <Button variant="outline" size="sm" className="gap-1" onClick={handleEditProfile}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => handleCancelEdit('profile')}>
                  Cancel
                </Button>
                <Button size="sm" className="gap-1" onClick={handleSaveProfile}>
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                <User className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{userName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{userEmail}</p>
              </div>
            </div>

            {!isEditingProfile ? (
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Phone Number</p>
                    <p className="font-medium">{phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium">{address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="phone-number" className="text-sm font-medium">Phone Number</label>
                  <input
                    id="phone-number"
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your phone number"
                    aria-label="Phone Number"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">Address</label>
                  <input
                    id="address"
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your address"
                    aria-label="Address"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Vehicle Information</CardTitle>
              <CardDescription>Your delivery vehicle details</CardDescription>
            </div>
            {!isEditingVehicle ? (
              <Button variant="outline" size="sm" className="gap-1" onClick={handleEditVehicle}>
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => handleCancelEdit('vehicle')}>
                  Cancel
                </Button>
                <Button size="sm" className="gap-1" onClick={handleSaveVehicle}>
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!isEditingVehicle ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">Vehicle</p>
                    <p className="font-medium">{vehicleInfo.year} {vehicleInfo.model} ({vehicleInfo.color})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm text-slate-500">Type</p>
                    <p className="font-medium">{vehicleInfo.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 flex items-center justify-center text-slate-500">
                    <span className="text-xs font-bold">LP</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">License Plate</p>
                    <p className="font-medium">{vehicleInfo.licensePlate}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="vehicle-type" className="text-sm font-medium">Vehicle Type</label>
                    <select
                      id="vehicle-type"
                      value={formVehicle.type}
                      onChange={(e) => setFormVehicle({...formVehicle, type: e.target.value})}
                      className="w-full p-2 border rounded-md"
                      aria-label="Vehicle Type"
                    >
                      <option value="Car">Car</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Bicycle">Bicycle</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="vehicle-year" className="text-sm font-medium">Year</label>
                    <input
                      id="vehicle-year"
                      type="text"
                      value={formVehicle.year}
                      onChange={(e) => setFormVehicle({...formVehicle, year: e.target.value})}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter vehicle year"
                      aria-label="Vehicle Year"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="vehicle-model" className="text-sm font-medium">Model</label>
                  <input
                    id="vehicle-model"
                    type="text"
                    value={formVehicle.model}
                    onChange={(e) => setFormVehicle({...formVehicle, model: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter vehicle model"
                    aria-label="Vehicle Model"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="vehicle-color" className="text-sm font-medium">Color</label>
                    <input
                      id="vehicle-color"
                      type="text"
                      value={formVehicle.color}
                      onChange={(e) => setFormVehicle({...formVehicle, color: e.target.value})}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter vehicle color"
                      aria-label="Vehicle Color"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="license-plate" className="text-sm font-medium">License Plate</label>
                    <input
                      id="license-plate"
                      type="text"
                      value={formVehicle.licensePlate}
                      onChange={(e) => setFormVehicle({...formVehicle, licensePlate: e.target.value})}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter license plate"
                      aria-label="License Plate"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wallet Link */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-medium">Driver Earnings</p>
                  <p className="text-sm text-slate-500">View your earnings and payment history</p>
                </div>
              </div>
              <Button asChild>
                <Link href="/wallet">View Wallet</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.language")}</CardTitle>
            <CardDescription>{t("app.language.settings")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-medium">{t("app.language.select")}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred language</p>
                </div>
              </div>
              <LanguageSelector />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.theme")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-medium">{t("settings.darkMode")}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark mode</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.notifications")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Receive notifications about new delivery requests
                  </p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={toggleNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button variant="destructive" className="w-full mt-6" onClick={handleLogout}>
          <LogOut className={`${dir === "rtl" ? "ml-2" : "mr-2"} h-4 w-4`} />
          {t("settings.logout")}
        </Button>
      </main>
    </div>
  )
}
