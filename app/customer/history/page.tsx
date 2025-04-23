"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { Package, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useLanguage } from "@/contexts/language-context"
import { mockOrders } from "@/lib/mock-orders"
import type { Order } from "@/lib/types"
import { OrderCard } from "@/components/order-card"

export default function OrderHistoryPage() {
  const router = useRouter()
  const { t, dir } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const userRole = localStorage.getItem("user_role")

    setIsAuthenticated(authStatus)
    setIsLoading(false)

    // Redirect if not authenticated or wrong role
    if (!authStatus || userRole !== "customer") {
      router.push("/auth/login?role=customer")
      return
    }

    // Get orders for this customer
    // In a real app, we would fetch from an API
    setOrders(mockOrders)
  }, [router])

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <MobileNav role="customer" />
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-medium">{t("delivery.orderHistory")}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20">
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
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
      </main>
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  )
}
