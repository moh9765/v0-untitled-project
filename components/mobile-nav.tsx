"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, User, Package, Clock, MapPin, Truck, Home } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"

interface NavItem {
  titleKey: string
  href: string
  icon: React.ReactNode
}

export function MobileNav({ role = "customer" }: { role?: string }) {
  const pathname = usePathname()
  const { toast } = useToast()
  const { t, dir, isRTL } = useLanguage()
  const [open, setOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    setIsAuthenticated(authStatus)
  }, [])

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("user_role")
    localStorage.removeItem("user_email")
    localStorage.removeItem("is_authenticated")

    setOpen(false)

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    // Redirect to home page
    window.location.href = "/"
  }

  const customerNavItems: NavItem[] = [
    {
      titleKey: "dashboard.customer",
      href: "/customer/dashboard",
      icon: <Home className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />,
    },
    {
      titleKey: "delivery.newDelivery",
      href: "/customer/new-delivery",
      icon: <Package className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />,
    },
    {
      titleKey: "delivery.trackOrders",
      href: "/customer/track",
      icon: <MapPin className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />,
    },
    {
      titleKey: "delivery.orderHistory",
      href: "/customer/history",
      icon: <Clock className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />,
    },
    {
      titleKey: "delivery.profile",
      href: "/customer/profile",
      icon: <User className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />,
    },
  ]

  const driverNavItems: NavItem[] = [
    {
      titleKey: "dashboard.driver",
      href: "/driver/dashboard",
      icon: <Home className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />,
    },
    {
      titleKey: "delivery.newDelivery",
      href: "/driver/deliveries",
      icon: <Truck className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />,
    },
    {
      titleKey: "delivery.trackOrders",
      href: "/driver/navigation",
      icon: <MapPin className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />,
    },
    {
      titleKey: "delivery.orderHistory",
      href: "/driver/history",
      icon: <Clock className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />,
    },
    {
      titleKey: "delivery.profile",
      href: "/driver/profile",
      icon: <User className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />,
    },
  ]

  const navItems = role === "customer" ? customerNavItems : driverNavItems

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "right" : "left"} className="flex flex-col" dir={dir}>
        <SheetHeader>
          <SheetTitle className={`${isRTL ? "text-right" : "text-left"} text-sky-600 dark:text-sky-400`}>
            {t("app.name")}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center px-2 py-1.5 text-sm ${
                pathname === item.href
                  ? "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300 font-medium rounded-md"
                  : "text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300"
              }`}
            >
              {item.icon}
              {t(item.titleKey)}
            </Link>
          ))}
        </div>
        <div className="mt-auto space-y-4">
          <LanguageSelector />
          {isAuthenticated && (
            <Button
              variant="outline"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
              {t("settings.logout")}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
