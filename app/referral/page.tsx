"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Gift, Share2, Copy, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReferralPage() {
  const { t, dir, isRTL } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [referralCode] = useState("DLVZ2023")

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    setIsAuthenticated(authStatus)
    setIsLoading(false)

    // Redirect if not authenticated
    if (!authStatus) {
      router.push("/auth/login")
    }
  }, [router])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    toast({
      title: "Copied to clipboard",
      description: "Referral code copied to clipboard",
    })
  }

  const handleShareCode = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Join Deliverzler",
          text: `Use my referral code ${referralCode} to sign up for Deliverzler and get a discount on your first order!`,
          url: "https://deliverzler.com",
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      handleCopyCode()
    }
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold ml-2">{t("referral.title")}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                <Gift className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              </div>
              <h2 className="text-lg font-semibold">{t("referral.title")}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("referral.description")}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Referral Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("referral.yourCode")}</label>
            <div className="flex gap-2">
              <Input value={referralCode} readOnly className="bg-slate-100 dark:bg-slate-800" />
              <Button variant="outline" size="icon" onClick={handleCopyCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Share Button */}
          <Button className="w-full" onClick={handleShareCode}>
            <Share2 className="h-4 w-4 mr-2" />
            {t("referral.shareCode")}
          </Button>

          {/* Invite Friends */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                  <Users className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <h3 className="font-semibold">{t("referral.inviteFriends")}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t("referral.reward")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <div className="text-center">
            <Button variant="link" className="text-xs text-slate-500">
              {t("referral.termsAndConditions")}
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  )
}
