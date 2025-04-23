"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { Package, MapPin, Clock, Plus, ArrowRight, User } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

// Mock data for active deliveries
const mockDeliveries = [
  {
    id: "DEL-1234",
    status: "In Transit",
    pickupAddress: "123 Main St, New York",
    deliveryAddress: "456 Park Ave, New York",
    estimatedDelivery: "Today, 2:30 PM",
    driverName: "John Driver",
  },
  {
    id: "DEL-5678",
    status: "Pending",
    pickupAddress: "789 Broadway, New York",
    deliveryAddress: "101 Fifth Ave, New York",
    estimatedDelivery: "Tomorrow, 10:00 AM",
    driverName: "Pending Assignment",
  },
]

export default function CustomerDashboard() {
  const router = useRouter()
  const { t, dir } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const userRole = localStorage.getItem("user_role")
    const email = localStorage.getItem("user_email") || ""

    // Extract name from email (in a real app, you'd get this from the user profile)
    const name = email.split("@")[0]
    setUserName(name.charAt(0).toUpperCase() + name.slice(1))

    setIsAuthenticated(authStatus)
    setIsLoading(false)

    // Redirect if not authenticated or wrong role
    if (!authStatus || userRole !== "customer") {
      router.push("/auth/login?role=customer")
    }
  }, [router])

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
          <MobileNav role="customer" />
          <div className="ml-auto flex items-center space-x-4">
            <LanguageSelector />
            <span className="text-sm font-medium">Hi, {userName}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("dashboard.customer")}</h1>
          <Button asChild>
            <Link href="/customer/new-delivery" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("delivery.newDelivery")}
            </Link>
          </Button>
        </div>

        {/* Active deliveries */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t("dashboard.activeDeliveries")}</h2>
          {mockDeliveries.length > 0 ? (
            <div className="grid gap-4">
              {mockDeliveries.map((delivery) => (
                <Card key={delivery.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{delivery.id}</CardTitle>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          delivery.status === "In Transit"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </div>
                    <CardDescription>
                      {t("delivery.estimatedDelivery")}: {delivery.estimatedDelivery}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="grid gap-2">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium">
                            {t("delivery.from")}: {delivery.pickupAddress}
                          </p>
                          <p className="font-medium">
                            {t("delivery.to")}: {delivery.deliveryAddress}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span>
                          {t("delivery.driverInfo")}: {delivery.driverName}
                        </span>
                      </div>
                    </div>
                    <Button variant="link" asChild className="px-0 mt-2">
                      <Link href={`/customer/track?id=${delivery.id}`} className="flex items-center gap-1">
                        {t("delivery.trackOrders")}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-500 dark:text-slate-400 mb-4">{t("dashboard.noActiveDeliveries")}</p>
                <Button asChild>
                  <Link href="/customer/new-delivery">{t("delivery.createDelivery")}</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">{t("dashboard.quickActions")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Link href="/customer/new-delivery" className="flex flex-col items-center">
                  <Package className="h-8 w-8 text-sky-500 mb-2" />
                  <span className="font-medium">{t("delivery.newDelivery")}</span>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Link href="/customer/track" className="flex flex-col items-center">
                  <MapPin className="h-8 w-8 text-sky-500 mb-2" />
                  <span className="font-medium">{t("delivery.trackOrders")}</span>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Link href="/customer/history" className="flex flex-col items-center">
                  <Clock className="h-8 w-8 text-sky-500 mb-2" />
                  <span className="font-medium">{t("delivery.orderHistory")}</span>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Link href="/customer/profile" className="flex flex-col items-center">
                  <User className="h-8 w-8 text-sky-500 mb-2" />
                  <span className="font-medium">{t("delivery.profile")}</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
