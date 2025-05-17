"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({
  variant = "default",
  size = "default",
  className = ""
}: LogoutButtonProps) {
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Function to perform the actual logout
  const performLogout = () => {
    console.log("Performing hard logout and redirect")

    // 1. Clear localStorage completely
    try {
      localStorage.clear()
    } catch (e) {
      console.error("Failed to clear localStorage:", e)
    }

    // 2. Clear sessionStorage
    try {
      sessionStorage.clear()
    } catch (e) {
      console.error("Failed to clear sessionStorage:", e)
    }

    // 3. Force redirect to login page
    window.location.href = "/auth/login?logged_out=true"
  }

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      console.log("Starting logout process...")

      // Show toast notification
      toast({
        title: "Logging out...",
        description: "Please wait while we log you out",
      })

      // 1. Clear all authentication data from localStorage
      const authItems = [
        "is_authenticated",
        "user_email",
        "user_role",
        "user_id",
        "token",
        "refresh_token",
        "access_token",
        "session_id"
      ]

      // First try to clear everything
      try {
        console.log("Clearing all localStorage")
        localStorage.clear()
      } catch (e) {
        console.warn("Error clearing localStorage completely:", e)

        // Fallback: Remove each auth item individually
        authItems.forEach(item => {
          try {
            console.log(`Removing ${item} from localStorage`)
            localStorage.removeItem(item)
          } catch (e) {
            console.warn(`Error removing ${item} from localStorage:`, e)
          }
        })
      }

      // 2. Clear sessionStorage
      try {
        console.log("Clearing sessionStorage")
        sessionStorage.clear()
      } catch (e) {
        console.warn("Error clearing sessionStorage:", e)
      }

      // 3. Call the logout API
      console.log("Calling logout API")
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/logout?_=${timestamp}`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      })

      if (response.ok) {
        console.log("Logout API call successful")
      } else {
        console.warn("Logout API returned error status:", response.status)
      }

      // 4. Verify localStorage is cleared
      const isAuthenticatedAfterClear = localStorage.getItem("is_authenticated")
      console.log("is_authenticated after clearing:", isAuthenticatedAfterClear)

      // 5. Set a timeout to ensure the logout API has time to complete
      // Then perform a hard redirect
      setTimeout(performLogout, 500)
    } catch (error) {
      console.error("Error during logout:", error)

      // Even if there's an error, force a hard redirect after a short delay
      setTimeout(performLogout, 500)
    }
  }

  // Add a failsafe - if the component unmounts while logging out, still perform the logout
  useEffect(() => {
    return () => {
      if (isLoggingOut) {
        performLogout()
      }
    }
  }, [isLoggingOut])

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  )
}
