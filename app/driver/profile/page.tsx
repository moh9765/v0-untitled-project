"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { User, Globe, Moon, Bell, LogOut } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export default function DriverProfilePage() {
  const router = useRouter()
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const userRole = localStorage.getItem("user_role")
    const email = localStorage.getItem("user_email") || ""

    // Extract name from email (in a real app, you'd get this from the user profile)
    const name = email.split("@")[0]
    setUserName(name.charAt(0).toUpperCase() + name.slice(1))
    setUserEmail(email)

    setIsAuthenticated(authStatus)
    setIsLoading(false)

    // Redirect if not authenticated or wrong role
    if (!authStatus || userRole !== "driver") {
      router.push("/auth/login?role=driver")
    }

    // Check theme preference
    const theme = localStorage.getItem("theme")
    setDarkMode(theme === "dark")
  }, [router])

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("user_role")
    localStorage.removeItem("user_email")
    localStorage.removeItem("is_authenticated")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    // Redirect to home page
    router.push("/")
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("theme", newMode ? "dark" : "light")

    // In a real app, this would update the theme
    document.documentElement.classList.toggle("dark", newMode)

    toast({
      title: newMode ? t("settings.darkMode") : t("settings.lightMode"),
      description: "Theme updated successfully",
    })
  }

  const toggleNotifications = () => {
    setNotifications(!notifications)

    toast({
      title: "Notifications " + (!notifications ? "enabled" : "disabled"),
      description: "Notification settings updated",
    })
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="flex h-16 items-center px-4">
          <MobileNav role="driver" />
          <div className="ml-auto flex items-center space-x-4">
            <LanguageSelector />
            <span className="text-sm font-medium">Hi, {userName}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("delivery.profile")}</CardTitle>
            <CardDescription>{t("settings.account")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                <User className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{userName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{userEmail}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.language")}</CardTitle>
            <CardDescription>{t("app.language.settings")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-medium">{t("app.language.select")}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred language</p>
                </div>
              </div>
              <LanguageSelector />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.theme")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-medium">{t("settings.darkMode")}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark mode</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.notifications")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Receive notifications about new delivery requests
                  </p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={toggleNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button variant="destructive" className="w-full mt-6" onClick={handleLogout}>
          <LogOut className={`${dir === "rtl" ? "ml-2" : "mr-2"} h-4 w-4`} />
          {t("settings.logout")}
        </Button>
      </main>
    </div>
  )
}
