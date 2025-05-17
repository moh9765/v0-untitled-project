"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Bell, Menu, Moon, Search, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth-utils"
import { useToast } from "@/hooks/use-toast"

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

export function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()
  const [userName, setUserName] = useState("")
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New order #1234",
      description: "A new order has been placed",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Driver offline",
      description: "Driver John Doe is now offline",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 3,
      title: "Payment failed",
      description: "Payment for order #5678 has failed",
      time: "30 minutes ago",
      read: true,
    },
  ])

  useEffect(() => {
    // Get user name from localStorage
    const name = localStorage.getItem("user_name") || "Admin"
    setUserName(name)
  }, [])

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/auth/login")
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white dark:bg-slate-950 dark:border-slate-800 px-6">
      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="mr-2"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex flex-1 items-center gap-4">
        <form className="flex-1 md:max-w-sm lg:max-w-lg">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-slate-100 dark:bg-slate-800 pl-8 rounded-lg border-none"
            />
          </div>
        </form>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                    variant="destructive"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex flex-col items-start p-3 ${
                      !notification.read ? "bg-slate-50 dark:bg-slate-800/50" : ""
                    }`}
                  >
                    <div className="flex w-full justify-between">
                      <span className="font-medium">{notification.title}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {notification.time}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {notification.description}
                    </span>
                    {!notification.read && (
                      <Badge className="mt-1" variant="secondary">
                        New
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={userName} />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                <User className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <User className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
