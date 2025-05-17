"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MobileNav } from "@/components/mobile-nav"
import { ArrowLeft, Loader2, MapPin, Package } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { addOrder } from "@/lib/mock-orders"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

export default function NewDeliveryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const { t, dir } = useLanguage()
  const [formData, setFormData] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    packageDetails: "",
    notes: "",
    preferredTime: "",
  })

  useEffect(() => {
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const userRole = localStorage.getItem("user_role")
    const userName = localStorage.getItem("user_name")

    setIsAuthenticated(authStatus)
    setIsLoading(false)
    setUserName(userName)

    if (!authStatus || userRole !== "customer") {
      router.push("/auth/login?role=customer")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`

      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        status: "Pending" as const,
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        packageDetails: formData.packageDetails,
        notes: formData.notes,
        estimatedDelivery: "Estimating...",
        customerName: userName || "Customer",
        customerPhone: "+1 (555) 987-6543",
        price: Math.floor(10 + Math.random() * 30),
        distance: Math.floor(1 + Math.random() * 5),
      }

      addOrder(newOrder)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Delivery request submitted",
        description: "Your delivery request has been successfully submitted.",
      })

      router.push("/customer/dashboard")
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your delivery request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="flex h-16 items-center px-4">
          <MobileNav role="customer" />
          <div className="ml-4 flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-medium">
              {useLanguage()?.language === "ar" ? "توصيل جديد" : "New Delivery"}
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>
                  {useLanguage()?.language === "ar" ? "إنشاء طلب توصيل جديد" : "Create a new delivery request"}
                </CardTitle>
                <CardDescription>
                  {useLanguage()?.language === "ar"
                    ? " املأ التفاصيل الخاصة بطلب التوصيل الخاص بك"
                    : "Fill in the details for your delivery request"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupAddress">
                    {useLanguage()?.language === "ar" ? "عنوان الاستلام" : "Pickup Address"}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="pickupAddress"
                      name="pickupAddress"
                      placeholder={
                        useLanguage()?.language === "ar" ? "أدخل عنوان الاستلام" : "Enter pickup address"
                      }
                      className="pl-9"
                      required
                      value={formData.pickupAddress}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">
                    {useLanguage()?.language === "ar" ? "عنوان التسليم" : "Delivery Address"}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="deliveryAddress"
                      name="deliveryAddress"
                      placeholder={
                        useLanguage()?.language === "ar" ? "أدخل عنوان التسليم" : "Enter delivery address"
                      }
                      className="pl-9"
                      required
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packageDetails">
                    {useLanguage()?.language === "ar" ? "تفاصيل الطرد" : "Package Details"}
                  </Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                      id="packageDetails"
                      name="packageDetails"
                      placeholder={
                        useLanguage()?.language === "ar" ? "ماذا سترسل؟" : "What are you sending?"
                      }
                      className="pl-9"
                      required
                      value={formData.packageDetails}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">
                    {useLanguage()?.language === "ar" ? "وقت التسليم المفضل" : "Preferred Delivery Time"}
                  </Label>
                  <Input
                    id="preferredTime"
                    name="preferredTime"
                    type="datetime-local"
                    placeholder={
                      useLanguage()?.language === "ar"
                        ? "حدد وقت التسليم المفضل"
                        : "Select preferred delivery time"
                    }
                    required
                    value={formData.preferredTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">
                    {useLanguage()?.language === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder={
                      useLanguage()?.language === "ar"
                        ? "أي تعليمات خاصة للتوصيل"
                        : "Any special instructions for the delivery"
                    }
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {useLanguage()?.language === "ar" ? "جارٍ الإرسال..." : "Submitting..."}
                    </>
                  ) : (
                    useLanguage()?.language === "ar" ? "إرسال طلب التوصيل" : "Submit Delivery Request"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
