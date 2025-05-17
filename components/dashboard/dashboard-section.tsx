"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft, Clock, Package, Gift, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/language-context"
import { mockOrders } from "@/lib/mock-orders"
import { mockProducts } from "@/lib/mock-data/products"

export function DashboardSection() {
  const { t, isRTL } = useLanguage()
  const [loyaltyPoints, setLoyaltyPoints] = useState(350)
  const [nextRewardPoints, setNextRewardPoints] = useState(500)
  const recentOrders = mockOrders.slice(0, 3)
  const frequentlyPurchased = mockProducts.filter((p) => p.isPopular).slice(0, 4)

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{t("dashboard.title")}</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard" className="flex items-center">
            {t("home.seeAll")}
            {isRTL ? <ChevronLeft className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
          </Link>
        </Button>
      </div>

      {/* Loyalty Points Card */}
      <Card className="mb-4 bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20">
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
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <CardContent className="p-3 flex flex-col items-center justify-center text-center">
            <Clock className="h-6 w-6 text-primary mb-1" />
            <span className="text-xs font-medium">{t("dashboard.orderHistory")}</span>
          </CardContent>
        </Card>
        <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <CardContent className="p-3 flex flex-col items-center justify-center text-center">
            <Package className="h-6 w-6 text-primary mb-1" />
            <span className="text-xs font-medium">{t("dashboard.trackOrder")}</span>
          </CardContent>
        </Card>
        <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <CardContent className="p-3 flex flex-col items-center justify-center text-center">
            <Gift className="h-6 w-6 text-primary mb-1" />
            <span className="text-xs font-medium">{t("dashboard.rewards")}</span>
          </CardContent>
        </Card>
        <Card className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <CardContent className="p-3 flex flex-col items-center justify-center text-center">
            <Repeat className="h-6 w-6 text-primary mb-1" />
            <span className="text-xs font-medium">{t("dashboard.reorder")}</span>
          </CardContent>
        </Card>
      </div>

    

      {/* Quick Reorder */}
     

      {/* Recent Orders */}
      <h3 className="font-medium mb-3">{t("dashboard.recentOrders")}</h3>
      <div className="space-y-3">
        {recentOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{order.id}</h4>
                  <p className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <Badge
                  className={`${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "In Transit"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </Badge>
              </div>
              <Button variant="link" className="p-0 h-auto text-sm text-primary" asChild>
                <Link href={`/order/${order.id}`}>{t("dashboard.viewDetails")}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
