"use client"

import { useLanguage } from "@/contexts/language-context"
import { Home, Heart, ShoppingBag, User, MessageSquare, Truck, Clock, Package, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function BottomNavigation() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("user_role")
    setUserRole(role)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  const customerNavItems = [
    {
      name: t("navigation.home"),
      href: "/customer/dashboard",
      icon: Home,
    },
    {
      name: t("navigation.favorites"),
      href: "/favorites",
      icon: Heart,
    },
    {
      name: t("navigation.orders"),
      href: "/customer/history",
      icon: ShoppingBag,
    },
    {
      name: t("navigation.messages"),
      href: "/messages",
      icon: MessageSquare,
    },
    {
      name: t("navigation.profile"),
      href: "/customer/profile",
      icon: User,
    },
  ]

  const driverNavItems = [
    {
      name: t("navigation.dashboard") || "Dashboard",
      href: "/driver/dashboard",
      icon: Home,
    },
    {
      name: t("navigation.deliveries") || "Deliveries",
      href: "/driver/deliveries",
      icon: Truck,
    },
    {
      name: t("navigation.history") || "History",
      href: "/driver/history",
      icon: Clock,
    },
    {
      name: t("navigation.wallet") || "Wallet",
      href: "/wallet",
      icon: Wallet,
    },
    {
      name: t("navigation.profile") || "Profile",
      href: "/driver/profile",
      icon: User,
    },
  ]

  // Use the appropriate nav items based on user role
  const navItems = userRole === "driver" ? driverNavItems : customerNavItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 ${
                active ? "text-primary" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? "fill-primary/10" : ""}`} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
