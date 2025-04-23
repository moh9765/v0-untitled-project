"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, ArrowRight, HelpCircle, Mail, Phone, MessageCircle } from "lucide-react"

export default function SupportPage() {
  const { t, dir, isRTL } = useLanguage()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
            <h1 className="text-xl font-bold ml-2">{t("support.title")}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20">
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="contact">{t("support.contactUs")}</TabsTrigger>
            <TabsTrigger value="faq">{t("support.faq")}</TabsTrigger>
          </TabsList>

          {/* Contact Us Tab */}
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <HelpCircle className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h2 className="text-lg font-semibold">{t("support.contactUs")}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    We're here to help. Contact us through any of the following channels.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                    <Mail className="h-5 w-5 mr-3 text-sky-600" />
                    <div className="text-left">
                      <h3 className="font-medium">{t("support.email")}</h3>
                      <p className="text-sm text-slate-500">support@deliverzler.com</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                    <Phone className="h-5 w-5 mr-3 text-sky-600" />
                    <div className="text-left">
                      <h3 className="font-medium">{t("support.phone")}</h3>
                      <p className="text-sm text-slate-500">+1 (555) 123-4567</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                    <MessageCircle className="h-5 w-5 mr-3 text-sky-600" />
                    <div className="text-left">
                      <h3 className="font-medium">{t("support.chat")}</h3>
                      <p className="text-sm text-slate-500">Start a live chat with our support team</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <HelpCircle className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h2 className="text-lg font-semibold">{t("faq.title")}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Find answers to commonly asked questions</p>
                </div>
              </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>{t("faq.deliveryQuestion")}</AccordionTrigger>
                <AccordionContent>{t("faq.deliveryAnswer")}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>{t("faq.paymentQuestion")}</AccordionTrigger>
                <AccordionContent>{t("faq.paymentAnswer")}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>{t("faq.accountQuestion")}</AccordionTrigger>
                <AccordionContent>{t("faq.accountAnswer")}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>{t("faq.refundQuestion")}</AccordionTrigger>
                <AccordionContent>{t("faq.refundAnswer")}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>{t("faq.contactQuestion")}</AccordionTrigger>
                <AccordionContent>{t("faq.contactAnswer")}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  )
}
