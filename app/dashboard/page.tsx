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
import { ArrowLeft, ArrowRight, Clock, Package, Gift, Repeat, ChevronRight, Award } from "lucide-react"
import { mockOrders } from "@/lib/mock-orders"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { OpenOrdersSection } from "@/components/dashboard/open-orders-section"

export default function DashboardPage() {
  const router = useRouter()
  const { t, dir, isRTL } = useLanguage()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [nextRewardPoints, setNextRewardPoints] = useState(0)
  const [rewardLevel, setRewardLevel] = useState("Bronze")
  const [progress, setProgress] = useState(0)
  const [orders, setOrders] = useState(mockOrders)

  // Fetch user rewards
  const fetchRewards = async (userId: string) => {
    try {
      const response = await fetch(`/api/rewards?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setLoyaltyPoints(data.rewards.points || 0)
        setRewardLevel(data.rewards.level || "Bronze")

        // Set next reward threshold
        if (data.nextThreshold) {
          setProgress(data.nextThreshold.progress || 0)
          setNextRewardPoints(data.nextThreshold.pointsNeeded || 0)
        }
      }
    } catch (error) {
      console.error("Error fetching rewards:", error)
    }
  }

  // Fetch user orders
  const fetchOrders = async (userId: string) => {
    try {
      const response = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_id: localStorage.getItem("user_email") }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders)
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const userIdFromStorage = localStorage.getItem("user_id")

    setIsAuthenticated(authStatus)
    setUserId(userIdFromStorage)

    if (!authStatus) {
      router.push("/auth/login")
      return
    }

    if (userIdFromStorage) {
      // Fetch rewards and orders
      fetchRewards(userIdFromStorage)
      fetchOrders(userIdFromStorage)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  // Helper function to get color class based on level
  const getLevelColorClass = (level: string) => {
    switch (level) {
      case "Bronze":
        return "bg-amber-700"
      case "Silver":
        return "bg-slate-500"
      case "Gold":
        return "bg-yellow-500"
      case "Platinum":
        return "bg-slate-700"
      default:
        return "bg-primary"
    }
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
        <Card className="mb-6 overflow-hidden">
          <div className={`${getLevelColorClass(rewardLevel)} text-white p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6" />
                <h3 className="font-bold text-lg">{rewardLevel} {t("rewards.level")}</h3>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{loyaltyPoints}</div>
                <div className="text-xs opacity-80">{t("rewards.points")}</div>
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            {nextRewardPoints > 0 ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {nextRewardPoints} {t("rewards.pointsToNextLevel")}
                  </span>
                  <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 mb-4" />
              </>
            ) : (
              <div className="mb-4 text-sm text-center py-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                {t("rewards.maxLevelReached")}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => router.push("/customer/rewards-dashboard")}
              >
                {t("dashboard.viewRewards")}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => router.push("/marketplace")}
              >
                {t("dashboard.earnMore")}
              </Button>
            </div>
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
          <Link href="/customer/rewards-dashboard">
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

        {/* Open Orders Section */}
        <OpenOrdersSection />

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
                          <Repeat className="h-6 w-6 text-primary mb-1" />
                          <span className="text-xs font-medium">{t("dashboard.reorder")}</span>
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
