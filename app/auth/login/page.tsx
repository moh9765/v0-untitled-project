"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { verifyUser } from "@/lib/db/users" // use your real verify function
//import { ApplicationSettings } from '@nativescript/core';


export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "customer"
  const { toast } = useToast()
  const { t, dir } = useLanguage()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("") // 🛠️ New error message state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    // Comprehensive cleanup of any stale session data when the login page loads
    const cleanupStaleSessions = async () => {
      try {
        // Check if we're coming from a logout operation
        const url = new URL(window.location.href);
        const loggedOutParam = url.searchParams.get("logged_out");

        // If we have the logged_out parameter, clean it up from the URL
        if (loggedOutParam === "true") {
          console.log("Login page: Detected logout parameter, cleaning URL");
          url.searchParams.delete("logged_out");
          window.history.replaceState({}, document.title, url.toString());
        }

        console.log("Login page: Clearing any stale session data...");

        // 1. Clear all client-side storage
        try {
          // First try to clear individual important items
          const authItems = [
            "is_authenticated", "user_email", "user_role", "user_id",
            "token", "refresh_token", "access_token", "session_id"
          ];

          authItems.forEach(item => {
            try {
              localStorage.removeItem(item);
            } catch (e) {
              console.warn(`Error removing ${item} from localStorage:`, e);
            }
          });

          // Then try to clear everything
          try {
            localStorage.clear();
          } catch (e) {
            console.warn("Error clearing localStorage completely:", e);
          }
        } catch (e) {
          console.error("Error accessing localStorage:", e);
        }

        // 2. Clear sessionStorage
        try {
          sessionStorage.clear();
        } catch (e) {
          console.warn("Error clearing sessionStorage, possibly in private browsing mode:", e);
        }

        // 3. Clear client-side cookies
        try {
          const cookies = document.cookie.split(";");
          const paths = ["/", "/api", "/auth", "/app", "/customer", "/driver", "/profile"];

          for (let i = 0; i < cookies.length; i++) {
            try {
              const cookie = cookies[i];
              if (!cookie) continue;

              const eqPos = cookie.indexOf("=");
              const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
              if (!name) continue;

              // Clear with all paths and variations
              paths.forEach(path => {
                try {
                  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
                  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};secure`;
                  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};secure;SameSite=Lax`;
                } catch (e) {
                  console.warn(`Error clearing cookie ${name} with path ${path}:`, e);
                }
              });
            } catch (e) {
              console.warn("Error processing cookie:", e);
            }
          }
        } catch (e) {
          console.error("Error accessing cookies:", e);
        }

        // 4. Call the server-side logout API to clear httpOnly cookies and invalidate the session
        try {
          // Add a timestamp to prevent caching
          const timestamp = new Date().getTime();
          const response = await fetch(`/api/logout?_=${timestamp}`, {
            method: "POST",
            credentials: "include", // Important for cookies
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
              "Expires": "0"
            }
          });

          if (response.ok) {
            console.log("Login page: Server-side session cleanup successful");
          } else {
            console.warn("Login page: Server-side session cleanup returned non-OK status:", response.status);
          }
        } catch (error) {
          console.error("Login page: Error calling logout API:", error);
          // Continue with the login page even if API call fails
        }
      } catch (error) {
        console.error("Login page: Error during session cleanup:", error);
        // Continue with the login page even if cleanup fails
      }

      // After cleanup, check if there's a redirect needed based on role in the URL
      // This allows for a clean login state while preserving the intended role
      const roleParam = searchParams.get("role");
      if (roleParam) {
        console.log(`Login page: Role parameter detected: ${roleParam}`);
      }
    };

    // Run the cleanup
    cleanupStaleSessions();
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrorMessage("") // 🛠️ Clear error when typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })

      const data = await response.json()

      if (data.success) {
        // Log the raw response data for debugging
        console.log("Login response data:", data);

        // Save authentication details to localStorage
        localStorage.setItem("is_authenticated", "true")
        localStorage.setItem("user_email", formData.email)
        localStorage.setItem("user_role", data.role) // 🛠️ Save role from server

        // Make sure userId is available before storing it
        if (data.userId) {
          localStorage.setItem("user_id", data.userId) // 🛠️ Save user ID from server
          console.log("User ID saved:", data.userId);
        } else {
          console.error("User ID missing from login response!");
        }
        //ApplicationSettings.setString('userId', data.userId);

        // Log values for debugging
        console.log("Logged in successfully:", {
          is_authenticated: localStorage.getItem("is_authenticated"),
          user_role: localStorage.getItem("user_role"),
          user_email: localStorage.getItem("user_email"),
          user_id: localStorage.getItem("user_id"),
        })

        // Show a success toast
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        // Redirect based on user role
        if (data.role === "driver") {
          router.push("/driver/dashboard")
        } else {
          router.push("/") // Redirect to homepage or order history page
        }
      } else {
        setErrorMessage("Incorrect email or password.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrorMessage("Something went wrong. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 px-4" dir={dir}>
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <LanguageSelector />
          </div>
          <div className="mt-4">
            <CardTitle className="text-2xl">{t("auth.login")}</CardTitle>
            <CardDescription>
              {role === "customer" ? t("home.continueAsCustomer") : t("home.continueAsDriver")}
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <div className="text-right">
                <Link
                  href="/auth/reset-password"
                  className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">
                {errorMessage}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("auth.login")
              )}
            </Button>
            <div className="text-center text-sm">
              {t("auth.dontHaveAccount")}{" "}
              <Link
                href={`/auth/register?role=${role}`}
                className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium"
              >
                {t("auth.register")}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
