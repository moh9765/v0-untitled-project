"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Package, Send, Search, Clock } from "lucide-react"
import Link from "next/link"

export default function ParcelPage() {
  const { t, dir, isRTL } = useLanguage()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [trackingNumber, setTrackingNumber] = useState("")

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

  const handleTrackParcel = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber) {
      router.push(`/parcel/track?id=${trackingNumber}`)
    }
  }

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
            <h1 className="text-xl font-bold ml-2">{t("parcel.title")}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20">
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="send">{t("parcel.send")}</TabsTrigger>
            <TabsTrigger value="track">{t("parcel.track")}</TabsTrigger>
            <TabsTrigger value="history">{t("parcel.history")}</TabsTrigger>
          </TabsList>

          {/* Send Parcel Tab */}
          <TabsContent value="send" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Send className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h2 className="text-lg font-semibold">{t("parcel.send")}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Send packages to any location with our reliable delivery service
                  </p>
                  <Button asChild className="w-full mt-2">
                    <Link href="/parcel/new">{t("parcel.createNew")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t("parcel.pickupDetails")}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                We'll pick up your parcel from your location and deliver it to the destination
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t("parcel.deliveryDetails")}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Fast and secure delivery with real-time tracking
              </p>
            </div>
          </TabsContent>

          {/* Track Parcel Tab */}
          <TabsContent value="track" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Package className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h2 className="text-lg font-semibold">{t("parcel.track")}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Enter your tracking number to see the status of your parcel
                  </p>
                  <form onSubmit={handleTrackParcel} className="w-full space-y-2">
                    <div className="relative">
                      <Input
                        placeholder={t("parcel.trackingNumber")}
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className={`pl-10 ${isRTL ? "text-right" : "text-left"}`}
                      />
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    </div>
                    <Button type="submit" className="w-full">
                      {t("parcel.track")}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h2 className="text-lg font-semibold">{t("parcel.history")}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    View your past parcel deliveries and their details
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center py-6">
              <p className="text-slate-500">{t("search.noResults")}</p>
              <p className="text-sm text-slate-400 mt-1">You haven't sent any parcels yet</p>
              <Button asChild className="mt-4">
                <Link href="/parcel/new">{t("parcel.createNew")}</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  )
}
