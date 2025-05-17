"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Users,
  ShoppingBag,
  Truck,
  Store,
  BarChart3,
  Settings,
  Menu,
  Home,
  Bell,
  Wallet,
  Gift,
  Globe,
  MessageSquare,
  HelpCircle,
  LogOut
} from "lucide-react"
import { logout } from "@/lib/auth-utils"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
}

export function AdminSidebar({ className, isOpen = false, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const { toast } = useToast()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/auth/login")
  }

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      submenu: [
        { title: "All Users", href: "/admin/users" },
        { title: "Customers", href: "/admin/users/customers" },
        { title: "Drivers", href: "/admin/users/drivers" },
      ],
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      submenu: [
        { title: "All Orders", href: "/admin/orders" },
        { title: "Pending", href: "/admin/orders/pending" },
        { title: "In Transit", href: "/admin/orders/in-transit" },
        { title: "Completed", href: "/admin/orders/completed" },
        { title: "Cancelled", href: "/admin/orders/cancelled" },
      ],
    },
    {
      title: "Drivers",
      href: "/admin/drivers",
      icon: <Truck className="h-5 w-5" />,
      submenu: [
        { title: "Management", href: "/admin/drivers" },
        { title: "Assignment", href: "/admin/drivers/assignment" },
        { title: "Performance", href: "/admin/drivers/performance" },
      ],
    },
    {
      title: "Vendors",
      href: "/admin/vendors",
      icon: <Store className="h-5 w-5" />,
      submenu: [
        { title: "All Vendors", href: "/admin/vendors" },
        { title: "Onboarding", href: "/admin/vendors/onboarding" },
        { title: "Products", href: "/admin/vendors/products" },
      ],
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      submenu: [
        { title: "Overview", href: "/admin/analytics" },
        { title: "Sales", href: "/admin/analytics/sales" },
        { title: "User Growth", href: "/admin/analytics/users" },
        { title: "Vendor Performance", href: "/admin/analytics/vendors" },
      ],
    },
    {
      title: "Payments",
      href: "/admin/payments",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      title: "Rewards",
      href: "/admin/rewards",
      icon: <Gift className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Messages",
      href: "/admin/messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Localization",
      href: "/admin/localization",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      title: "Support",
      href: "/admin/support",
      icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const closeSidebar = () => {
    if (setIsOpen) {
      setIsOpen(false)
    }
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <MobileSidebar
            items={sidebarItems}
            pathname={pathname}
            onLogout={handleLogout}
            onClose={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "md:w-64 md:flex-col md:fixed md:inset-y-0 transition-all duration-300 ease-in-out",
          isOpen ? "md:flex translate-x-0" : "md:flex -translate-x-full",
          className
        )}
      >
        <DesktopSidebar
          items={sidebarItems}
          pathname={pathname}
          onLogout={handleLogout}
          onClose={() => setIsOpen && setIsOpen(false)}
        />
      </div>
    </>
  )
}

function MobileSidebar({
  items,
  pathname,
  onLogout,
  onClose
}: {
  items: SidebarItem[]
  pathname: string
  onLogout: () => void
  onClose?: () => void
}) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-xl" onClick={onClose}>
          <span className="text-primary">Admin</span>
          <span>Dashboard</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 py-2">
        <SidebarNav items={items} pathname={pathname} onItemClick={onClose} />
      </ScrollArea>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

function DesktopSidebar({
  items,
  pathname,
  onLogout,
  onClose
}: {
  items: SidebarItem[]
  pathname: string
  onLogout: () => void
  onClose?: () => void
}) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-xl" onClick={onClose}>
          <span className="text-primary">Admin</span>
          <span>Dashboard</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={onClose} className="hidden md:flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 py-4">
        <SidebarNav items={items} pathname={pathname} onItemClick={onClose} />
      </ScrollArea>
      <div className="p-6 border-t border-slate-200 dark:border-slate-800">
        <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

function SidebarNav({
  items,
  pathname,
  onItemClick
}: {
  items: SidebarItem[]
  pathname: string
  onItemClick?: () => void
}) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  return (
    <nav className="space-y-1 px-4">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const hasSubmenu = item.submenu && item.submenu.length > 0
        const isSubmenuOpen = openSubmenu === item.title

        return (
          <div key={item.href} className="space-y-1">
            {hasSubmenu ? (
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                )}
                onClick={() => toggleSubmenu(item.title)}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
                <svg
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform",
                    isSubmenuOpen && "transform rotate-180"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            ) : (
              <Link href={item.href} onClick={onItemClick}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Button>
              </Link>
            )}

            {hasSubmenu && isSubmenuOpen && (
              <div className="ml-6 space-y-1 mt-1">
                {item.submenu?.map((subItem) => {
                  const isSubActive = pathname === subItem.href
                  return (
                    <Link key={subItem.href} href={subItem.href} onClick={onItemClick}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sm",
                          isSubActive && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                        )}
                      >
                        <span className="ml-3">{subItem.title}</span>
                      </Button>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
