"use client"

import { useLanguage } from "@/contexts/language-context"
import { Home, Heart, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNavigation() {
  const { t } = useLanguage()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    {
      name: t("navigation.home"),
      href: "/",
      icon: Home,
    },
    {
      name: t("navigation.favorites"),
      href: "/favorites",
      icon: Heart,
    },
    {
      name: t("navigation.orders"),
      href: "/orders",
      icon: ShoppingBag,
    },
    {
      name: t("navigation.profile"),
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 max-w-md mx-auto">
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
