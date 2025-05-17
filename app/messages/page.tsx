"use client"

import { useLanguage } from "@/contexts/language-context"
import type { TranslationKey } from "@/lib/i18n/translations"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function MessagesPage() {
  const { t, dir, isRTL } = useLanguage()
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white dark:bg-slate-900" dir={dir}>
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="px-4 py-3 flex items-center">
          <div className={`absolute ${isRTL ? "right-4" : "left-4"}`}>
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Button>
          </div>
          <h1 className="mx-auto text-2xl font-semibold text-primary tracking-tight">{t("messages.title" as TranslationKey) || "Messages"}</h1>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4">
        <p className="text-center text-slate-500 dark:text-slate-400">
          {t("messages.empty" as TranslationKey) || "You have no messages yet."}
        </p>
      </main>

      <BottomNavigation />
    </div>
  )
}
