"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export function SplashScreen({
  duration = 2000,
  redirectTo = null,
  onFinish = null
}: {
  duration?: number,
  redirectTo?: string | null,
  onFinish?: (() => void) | null
}) {
  const router = useRouter()
  const { dir } = useLanguage()
  const [isVisible, setIsVisible] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // Mark as loaded when component mounts
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Handle the splash screen timing
  useEffect(() => {
    if (!isLoaded) return

    console.log(`SplashScreen: Will hide after ${duration}ms`)

    const timer = setTimeout(() => {
      console.log("SplashScreen: Timer completed, hiding splash screen")
      setIsVisible(false)

      // If we have a callback, call it
      if (onFinish) {
        console.log("SplashScreen: Calling onFinish callback")
        onFinish()
      }

      // If we have a redirect URL, navigate to it
      if (redirectTo) {
        console.log(`SplashScreen: Redirecting to ${redirectTo}`)
        // Use window.location for a hard redirect
        window.location.href = redirectTo
      }
    }, duration)

    return () => {
      console.log("SplashScreen: Cleaning up timer")
      clearTimeout(timer)
    }
  }, [duration, redirectTo, onFinish, isLoaded, router])

  if (!isVisible) {
    console.log("SplashScreen: Not visible, returning null")
    return null
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100 dark:from-slate-900 dark:to-slate-800 z-50"
      dir={dir}
    >
      <div className="w-1/2 max-w-xs flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg mb-6">
          <Image
            src="/logo.webp"
            alt="Deliverzler Logo"
            width={60}
            height={60}
            className="h-12 w-12"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mb-2">Deliverzler</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Multi-service delivery platform</p>
      </div>
    </div>
  )
}
