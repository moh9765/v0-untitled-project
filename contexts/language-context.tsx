"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type TranslationKey, enTranslations, arTranslations } from "@/lib/i18n/translations"

export type Language = "en" | "ar"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  dir: "ltr" | "rtl"
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr")
  const [isRTL, setIsRTL] = useState(false)

  // Load saved language preference from localStorage on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
        setLanguage(savedLanguage)
      } else {
        // Try to detect browser language
        const browserLang = navigator.language.split("-")[0]
        if (browserLang === "ar") {
          setLanguage("ar")
        }
      }
    } catch (error) {
      console.error("Error loading language preference:", error)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    try {
      setLanguageState(lang)
      localStorage.setItem("language", lang)

      const isRightToLeft = lang === "ar"
      setDir(isRightToLeft ? "rtl" : "ltr")
      setIsRTL(isRightToLeft)

      // Set the dir attribute on the html element
      document.documentElement.dir = isRightToLeft ? "rtl" : "ltr"

      // Add or remove RTL class to body for global styling
      if (isRightToLeft) {
        document.body.classList.add("rtl")
      } else {
        document.body.classList.remove("rtl")
      }
    } catch (error) {
      console.error("Error setting language:", error)
    }
  }

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    try {
      const translations = language === "en" ? enTranslations : arTranslations
      let text = translations[key] || enTranslations[key] || key

      // Replace parameters if provided
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          text = text.replace(`{${param}}`, String(value))
        })
      }

      return text
    } catch (error) {
      console.error(`Error translating key "${key}":`, error)
      return key
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export function useTranslation() {
  const { t } = useLanguage()
  return { t }
}
