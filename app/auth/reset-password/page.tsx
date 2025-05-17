"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"


export default function ResetPasswordPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [isRTL, setIsRTL] = useState(false) // Track if the language is RTL

  useEffect(() => {
    // Check the language setting from localStorage
    const savedLanguage = localStorage.getItem("language")
    setIsRTL(savedLanguage === "ar") // Set RTL if the language is Arabic
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset request
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      toast({
        title: isRTL ? "تم إرسال رابط إعادة التعيين" : "Reset link sent",
        description: isRTL
          ? "تحقق من بريدك الإلكتروني للحصول على رابط لإعادة تعيين كلمة المرور."
          : "Check your email for a link to reset your password.",
      })
    } catch (error) {
      toast({
        title: isRTL ? "فشل الطلب" : "Request failed",
        description: isRTL
          ? "حدثت مشكلة أثناء إرسال رابط إعادة التعيين. يرجى المحاولة مرة أخرى."
          : "There was a problem sending the reset link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-sky-50 to-sky-100 dark:from-slate-900 dark:to-slate-800"
      dir={isRTL ? "rtl" : "ltr"} // Set direction based on language
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/auth/login">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <CardTitle className="text-2xl">
              {isRTL ? "إعادة تعيين كلمة المرور" : "Reset password"}
            </CardTitle>
          </div>
          <CardDescription>
            {isRTL
              ? "أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور"
              : "Enter your email address and we'll send you a link to reset your password"}
          </CardDescription>
        </CardHeader>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isRTL ? "name@example.com" : "name@example.com"}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRTL ? "جارٍ إرسال رابط إعادة التعيين..." : "Sending reset link..."}
                  </>
                ) : (
                  isRTL ? "إرسال رابط إعادة التعيين" : "Send reset link"
                )}
              </Button>
              <div className="text-center text-sm">
                {isRTL ? "تذكرت كلمة المرور؟" : "Remember your password?"}{" "}
                <Link
                  href="/auth/login"
                  className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium"
                >
                  {isRTL ? "العودة إلى تسجيل الدخول" : "Back to sign in"}
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4 text-center">
            <div className="flex justify-center my-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <p>{isRTL ? "لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى:" : "We've sent a password reset link to:"}</p>
            <p className="font-medium">{email}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              {isRTL
                ? "تحقق من بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور."
                : "Check your email and follow the instructions to reset your password."}
            </p>
            <Button asChild className="w-full mt-4">
              <Link href="/auth/login">{isRTL ? "العودة إلى تسجيل الدخول" : "Back to sign in"}</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </main>
  )
}

