"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { ArrowLeft, MapPin, Package, Phone, User } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

// Mock delivery data
const mockDelivery = {
  id: "DEL-1234",
  status: "In Transit",
  pickupAddress: "123 Main St, New York",
  deliveryAddress: "456 Park Ave, New York",
  estimatedDelivery: "Today, 2:30 PM",
  driverName: "John Driver",
  driverPhone: "+1 (555) 123-4567",
  packageDetails: "Small package, fragile",
  statusHistory: [
    { status: "Order Placed", time: "Today, 9:15 AM" },
    { status: "Driver Assigned", time: "Today, 9:45 AM" },
    { status: "Pickup Complete", time: "Today, 10:30 AM" },
    { status: "In Transit", time: "Today, 11:00 AM" },
  ],
}

export default function TrackOrderPage() {
  const { t, dir, isRTL, language } = useLanguage()
  const lang = language // or derive lang from language if needed
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") || "DEL-1234"

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const userRole = localStorage.getItem("user_role")

    setIsAuthenticated(authStatus)
    setIsLoading(false)

    // Redirect if not authenticated or wrong role
    if (!authStatus || userRole !== "customer") {
      router.push("/auth/login?role=customer")
    }
  }, [router])

  // Translations for static text
  const labels = {
    trackOrder: lang === "ar" ? "تتبع الطلب" : "Track Order",
    estimatedDelivery: lang === "ar" ? "وقت التوصيل المتوقع" : "Estimated delivery",
    deliveryDetails: lang === "ar" ? "تفاصيل التوصيل" : "Delivery Details",
    from: lang === "ar" ? "من" : "From",
    to: lang === "ar" ? "إلى" : "To",
    package: lang === "ar" ? "الطرد" : "Package",
    driverInfo: lang === "ar" ? "معلومات السائق" : "Driver Information",
    deliveryStatus: lang === "ar" ? "حالة التوصيل" : "Delivery Status",
    mapPlaceholder: lang === "ar" ? "سيظهر عرض الخريطة هنا" : "Map view would appear here",
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
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
          <div className="ml-4 flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-medium">{labels.trackOrder}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{orderId}</CardTitle>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {mockDelivery.status}
              </span>
            </div>
            <CardDescription>
              {labels.estimatedDelivery}: {mockDelivery.estimatedDelivery}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Map placeholder */}
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-md flex items-center justify-center">
              <MapPin className="h-8 w-8 text-slate-400" />
              <span className="ml-2 text-slate-500">{labels.mapPlaceholder}</span>
            </div>

            {/* Delivery details */}
            <div className="space-y-4">
              <h3 className="font-semibold">{labels.deliveryDetails}</h3>

              <div className="grid gap-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">{labels.from}</p>
                    <p className="font-medium">{mockDelivery.pickupAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">{labels.to}</p>
                    <p className="font-medium">{mockDelivery.deliveryAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Package className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">{labels.package}</p>
                    <p className="font-medium">{mockDelivery.packageDetails}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver details */}
            <div className="space-y-4">
              <h3 className="font-semibold">{labels.driverInfo}</h3>

              <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <User className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <p className="font-medium">{mockDelivery.driverName}</p>
                    <p className="text-sm text-slate-500">{mockDelivery.driverPhone}</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="rounded-full h-9 w-9">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status timeline */}
            <div className="space-y-4">
              <h3 className="font-semibold">{labels.deliveryStatus}</h3>

              <div className="space-y-4">
                {mockDelivery.statusHistory.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="relative flex flex-col items-center">
                      <div className={`h-4 w-4 rounded-full ${index === 0 ? "bg-sky-500" : "bg-sky-500"}`} />
                      {index < mockDelivery.statusHistory.length - 1 && (
                        <div className="h-12 w-0.5 bg-sky-200 dark:bg-sky-900" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{lang === "ar"
                        ? (
                          item.status === "Order Placed" ? "تم تقديم الطلب"
                          : item.status === "Driver Assigned" ? "تم تعيين السائق"
                          : item.status === "Pickup Complete" ? "تم الاستلام"
                          : item.status === "In Transit" ? "قيد التوصيل"
                          : item.status
                        )
                        : item.status
                      }</p>
                      <p className="text-sm text-slate-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
