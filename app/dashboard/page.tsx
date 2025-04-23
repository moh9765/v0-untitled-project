"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { BottomNavigation } from "@/components/bottom-navigation"
import { FloatingCart } from "@/components/cart/floating-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Clock, Package, Gift, Repeat, ChevronRight } from "lucide-react"
import { mockOrders } from "@/lib/mock-orders"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { t, dir, isRTL } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loyaltyPoints, setLoyaltyPoints] = useState(350)
  const [nextRewardPoints, setNextRewardPoints] = useState(500)
  const [orders, setOrders] = useState(mockOrders)

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    setIsAuthenticated(authStatus)
    setIsLoading(false)

    // Redirect if not authenticated
    if (!authStatus) {
      router.push("/auth/login")
    }
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
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold ml-2">{t("dashboard.title")}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20">
        {/* Loyalty Points Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{t("dashboard.loyaltyPoints")}</h3>
              <span className="text-xl font-bold">{loyaltyPoints}</span>
            </div>
            <Progress value={(loyaltyPoints / nextRewardPoints) * 100} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>0</span>
              <span>{t("dashboard.nextReward", { points: nextRewardPoints })}</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              {t("dashboard.viewRewards")}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <h3 className="font-medium mb-3">{t("dashboard.quickActions")}</h3>
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Link href="/customer/history">
            <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors h-full">
              <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                <Clock className="h-6 w-6 text-primary mb-1" />
                <span className="text-xs font-medium">{t("dashboard.orderHistory")}</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/customer/track">
            <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors h-full">
              <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                <Package className="h-6 w-6 text-primary mb-1" />
                <span className="text-xs font-medium">{t("dashboard.trackOrder")}</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/rewards">
            <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors h-full">
              <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                <Gift className="h-6 w-6 text-primary mb-1" />
                <span className="text-xs font-medium">{t("dashboard.rewards")}</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/reorder">
            <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors h-full">
              <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                <Repeat className="h-6 w-6 text-primary mb-1" />
                <span className="text-xs font-medium">{t("dashboard.reorder")}</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Personalized Deals */}
        <h3 className="font-medium mb-3">{t("dashboard.personalizedDeals")}</h3>
        <div className="relative overflow-hidden rounded-lg mb-6">
          <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-shrink-0 w-full snap-center">
                <div className="relative h-40 w-full bg-secondary-100 dark:bg-secondary-900/20 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{t("dashboard.dealTitle", { number: item })}</h4>
                      <p className="text-sm">{t("dashboard.dealDescription")}</p>
                    </div>
                    <Button size="sm" className="self-start">
                      {t("dashboard.claimOffer")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`h-1.5 rounded-full ${item === 1 ? "w-6 bg-primary" : "w-1.5 bg-slate-300 dark:bg-slate-600"}`}
              />
            ))}
          </div>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="active" className="mt-6">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">
              {t("dashboard.activeOrders")}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">
              {t("dashboard.completedOrders")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4 space-y-4">
            {orders.filter((order) => order.status !== "Delivered").length > 0 ? (
              orders
                .filter((order) => order.status !== "Delivered")
                .map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{order.id}</h4>
                          <p className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "In Transit"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{order.packageDetails}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-500">
                          {t("delivery.estimatedDelivery")}: {order.estimatedDelivery}
                        </div>
                        <Button variant="ghost" size="sm" asChild className="p-0">
                          <Link href={`/customer/track?id=${order.id}`} className="flex items-center">
                            {t("dashboard.track")}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">{t("dashboard.noActiveOrders")}</p>
                <Button asChild className="mt-4">
                  <Link href="/marketplace">{t("dashboard.startShopping")}</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="completed" className="mt-4 space-y-4">
            {orders.filter((order) => order.status === "Delivered").length > 0 ? (
              orders
                .filter((order) => order.status === "Delivered")
                .map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{order.id}</h4>
                          <p className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{order.packageDetails}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-500">
                          {t("delivery.deliveredOn")}: {order.estimatedDelivery}
                        </div>
                        <Button variant="outline" size="sm">
                          {t("dashboard.reorder")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">{t("dashboard.noCompletedOrders")}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />

      {/* Floating cart */}
      <FloatingCart />
    </div>
  )
}
