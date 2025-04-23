"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OrdersRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("is_authenticated") === "true"
    const userRole = localStorage.getItem("user_role")

    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    // Redirect based on role
    if (userRole === "customer") {
      router.push("/customer/history")
    } else if (userRole === "driver") {
      router.push("/driver/deliveries")
    } else {
      router.push("/")
    }
  }, [router])

  return null
}
