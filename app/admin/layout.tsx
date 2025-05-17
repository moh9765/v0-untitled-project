"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { useToast } from "@/hooks/use-toast"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Check if user is authenticated and is an admin
    const checkAuth = async () => {
      try {
        const isAuth = localStorage.getItem("is_authenticated") === "true"
        const userRole = localStorage.getItem("user_role")

        setIsAuthenticated(isAuth)
        setIsAdmin(userRole === "admin")

        if (!isAuth) {
          router.push("/auth/login")
          return
        }

        if (isAuth && userRole !== "admin") {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin dashboard.",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Authentication error:", error)
        setIsLoading(false)
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router, toast])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}
