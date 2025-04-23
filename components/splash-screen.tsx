"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export function SplashScreen() {
  const router = useRouter()
  const { dir } = useLanguage()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      router.push("/auth/login")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100 dark:from-slate-900 dark:to-slate-800 z-50"
      dir={dir}
    >
      <div className="w-1/2 max-w-xs flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg mb-6">
          <Image
            src="/placeholder.svg?height=60&width=60"
            alt="Deliverzler Logo"
            width={60}
            height={60}
            className="h-12 w-12"
          />
        </div>
        <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400 mb-2">Deliverzler</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Multi-service delivery platform</p>
      </div>
    </div>
  )
}
