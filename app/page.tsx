"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { LocationSelector } from "@/components/location-selector"
import { CategoryCard } from "@/components/category-card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { SplashScreen } from "@/components/splash-screen"
import { FloatingCart } from "@/components/cart/floating-cart"
import { NearbySection } from "@/components/nearby/nearby-section"
import { DashboardSection } from "@/components/dashboard/dashboard-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight, ChevronLeft, Plus } from "lucide-react"
import { categories, vendors } from "@/lib/mock-data"
import type { Location } from "@/lib/types/product"
import Link from "next/link"
import { OrderCard } from "@/components/order-card"
import { mockOrders } from "@/lib/mock-orders"
import { motion } from 'framer-motion'
import { useRouter } from "next/navigation"

export default function Home() {
  const { t, dir, isRTL } = useLanguage()
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [nearbyVendors, setNearbyVendors] = useState(vendors)
  const [popularVendors, setPopularVendors] = useState(vendors.filter((v) => v.rating >= 4.5))
  const [showSplash, setShowSplash] = useState(true)
  const [recentOrders, setRecentOrders] = useState(mockOrders.slice(0, 3))
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [greeting, setGreeting] = useState("")
  const [activeSlide, setActiveSlide] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter()
  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft
      const width = sliderRef.current.offsetWidth
      const index = Math.round(scrollLeft / width)
      setActiveSlide(index)
    }
  }
  const VendorCard = ({ vendor }: { vendor: any }) => (
    <motion.div
    initial={{ scale: 0.95 }}
    whileInView={{ scale: 1 }}
    whileHover={{ y: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="vendor-card"
    >
    {vendor.image ? (
      <img src={vendor.image} alt={vendor.name} />
    ) : (
      <div className="w-full h-24 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
        No Image
      </div>
    )}
    <h3>{vendor.name}</h3>
  </motion.div>
  )
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting(t("home.goodMorning"))
    else if (hour < 18) setGreeting(t("home.goodAfternoon"))
    else setGreeting(t("home.goodEvening"))
  }, [t])
  useEffect(() => {
    // Function to check for logout indicators and handle them
    const checkLogoutStatus = () => {
      // Check URL parameters first (works in all browsing modes)
      const url = new URL(window.location.href);
      const loggedOutParam = url.searchParams.get("logged_out");

      // Also check sessionStorage as a fallback (may not work in private browsing)
      let sessionLogoutFlag = false;
      try {
        sessionLogoutFlag = sessionStorage.getItem("just_logged_out") === "true";
        if (sessionLogoutFlag) {
          sessionStorage.removeItem("just_logged_out");
        }
      } catch (e) {
        console.warn("Error accessing sessionStorage, possibly in private browsing mode:", e);
      }

      // If either indicator is present, redirect to login
      if (loggedOutParam === "true" || sessionLogoutFlag) {
        console.log("Logout detected, redirecting to login page");

        // Clean up URL parameter if present
        if (loggedOutParam) {
          url.searchParams.delete("logged_out");
          window.history.replaceState({}, document.title, url.toString());
        }

        // Redirect to login page using window.location for a hard redirect
        window.location.href = "/auth/login";
        return true; // Return true to indicate we're handling a logout
      }

      return false; // Not handling a logout
    };

    // Function to safely check localStorage
    const safeGetLocalStorage = (key: string): string | null => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn(`Error accessing localStorage for key ${key}:`, e);
        return null;
      }
    };

    // Main authentication check logic
    const checkAuthentication = async () => {
      console.log("Starting authentication check...");

      // First check if we're handling a logout
      if (checkLogoutStatus()) {
        return; // Exit early if we're handling a logout
      }

      // Check authentication from localStorage first (if available)
      const isAuthenticated = safeGetLocalStorage("is_authenticated") === "true";
      console.log("Authentication from localStorage:", isAuthenticated);

      if (isAuthenticated) {
        // If authenticated via localStorage, update state and hide splash screen
        const userEmail = safeGetLocalStorage("user_email");
        const userRole = safeGetLocalStorage("user_role");

        setIsAuthenticated(true);
        setUserEmail(userEmail);
        setUserRole(userRole);

        // Hide splash screen with a slight delay to ensure UI updates
        setTimeout(() => {
          setShowSplash(false);
          console.log("Splash screen hidden - authenticated via localStorage");
        }, 500);
        return;
      }

      // Only check session if not authenticated via localStorage
      try {
        console.log("Checking session authentication...");

        // Create a timeout promise to limit waiting time
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("Session check timeout"));
          }, 5000); // Increased timeout for better reliability
        });

        // Create the fetch promise with cache busting
        const timestamp = new Date().getTime();
        const fetchPromise = fetch(`/api/me?_=${timestamp}`, {
          credentials: "include", // Important for cookies
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          },
          cache: "no-store"
        }).then(res => res.json());

        // Race the promises - whichever resolves/rejects first wins
        const data = await Promise.race([fetchPromise, timeoutPromise]);
        console.log("Session check response:", data);

        if (data.user) {
          // If authenticated via session, update state
          setIsAuthenticated(true);
          setUserEmail(data.user.email);
          setUserRole(data.user.role);

          // Try to update localStorage, but don't fail if it doesn't work
          try {
            localStorage.setItem("is_authenticated", "true");
            localStorage.setItem("user_email", data.user.email);
            localStorage.setItem("user_role", data.user.role);
            localStorage.setItem("user_id", data.user.id);
          } catch (e) {
            console.warn("Could not save auth data to localStorage:", e);
          }

          // Hide splash screen with a slight delay to ensure UI updates
          setTimeout(() => {
            setShowSplash(false);
            console.log("Splash screen hidden - authenticated via session");
          }, 500);
        } else {
          // Not authenticated via session or localStorage
          console.log("Not authenticated, redirecting to login");
          // Use window.location for a hard redirect
          window.location.href = "/auth/login";
        }
      } catch (error) {
        console.error("Session check failed:", error);

        // On timeout or error, redirect to login page
        window.location.href = "/auth/login";
      }
    };

    // Run the authentication check
    checkAuthentication();
  }, [router])
  useEffect(() => {
    console.log("Loading saved location and additional initialization...");

    // Load saved location
    const savedLocationJson = localStorage.getItem("selectedLocation")
    if (savedLocationJson) {
      try {
        const savedLocation = JSON.parse(savedLocationJson) as Location
        setSelectedLocation(savedLocation)
      } catch (e) {
        console.error("Failed to parse saved location", e)
      }
    }

    // This useEffect now only handles location loading
    // Authentication is handled in the other useEffect
  }, [])

  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem("selectedLocation", JSON.stringify(selectedLocation))
    }
  }, [selectedLocation])

  if (showSplash) {
    return <SplashScreen duration={2000} onFinish={() => setShowSplash(false)} />
  }

  // Removed unused userId variable

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" dir={dir}>
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-primary tracking-tight">{t("app.name")}</h1>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <LocationSelector onLocationSelected={setSelectedLocation} />
            </div>
          </div>

          <div className="relative mt-4">
            <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-3 h-4 w-4 text-slate-400`} />
            <Input
              className={`transition-all ${isFocused ? 'shadow-neon border-cyberBlue' : ''}`}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 py-4 pb-24 space-y-6">
        {isAuthenticated && (
          <div className="px-4">
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {greeting}, {userEmail?.split("@")[0]} 👋
            </div>
          </div>
        )}

        {/* عروض يومية */}
        <div className="bg-glass backdrop-blur-lg border-neon rounded-2xl p-4 shadow-holographic">

          <div className="relative px-4 space-y-2">
            <div
              ref={sliderRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
            >
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex-shrink-0 w-full snap-center relative">
                  <div className="h-44 bg-gradient-to-tr from-indigo-200 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-2xl p-4 shadow-md relative overflow-hidden">
                    <h4 className="text-lg font-bold mb-1">{t("home.dailyDeal", { number: item })}</h4>
                    <p className="text-sm opacity-80 mb-3">{t("home.dealDescription")}</p>
                    <Button size="sm" className="rounded-full">{t("home.shopNow")}</Button>

                    {/* النقاط داخل الصورة */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {[0, 1, 2].map((dotIndex) => (
                        <span
                          key={dotIndex}
                          className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            activeSlide === dotIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4">
          <Button asChild className="w-full py-6 text-lg rounded-2xl shadow-lg">
            <Link href="/customer/new-delivery" className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              {t("delivery.newDelivery")}
            </Link>
          </Button>
        </div>

        {/* الفئات */}
        <section>


          <div className="px-4 grid grid-cols-2 sm:grid-cols-4 gap-4">

            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} size="sm" />
            ))}
          </div>
        </section>

        {isAuthenticated && <DashboardSection />}

        {isAuthenticated && recentOrders.length > 0 && (
          <section>
            <div className="flex items-center justify-between px-4 mb-2">
              <h2 className="text-lg font-bold">{t("home.recentOrders")}</h2>
              <Button variant="ghost" size="sm" asChild className="rounded-full">
                <Link href="/customer/history" className="flex items-center">
                  {t("home.seeAll")}
                  {isRTL ? <ChevronLeft className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                </Link>
              </Button>
            </div>

            <div className="px-4 overflow-x-auto flex gap-4 scrollbar-hide">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex-shrink-0 w-72">
                  <OrderCard order={order} />
                </div>
              ))}
            </div>
          </section>
        )}

        <NearbySection title={t("home.nearbyVendors")} />

        <section>
          <div className="flex items-center justify-between px-4 mb-2">
            <h2 className="text-lg font-bold">{t("home.popularVendors")}</h2>
            <Button variant="ghost" size="sm" asChild className="rounded-full">
              <Link href="/popular" className="flex items-center">
                {t("home.seeAll")}
                {isRTL ? <ChevronLeft className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
              </Link>
            </Button>
          </div>

          <div className="px-4 grid gap-4">
            {popularVendors.slice(0, 3).map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={{
                  ...vendor,
                  deliveryTime: vendor.deliveryTime.toString(), // Convert to string
                  image: vendor.logo || "", // Ensure image is a string
                  lat: vendor.lat,
                  lng: vendor.lng,
                }}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />
      <FloatingCart />
    </div>
  )
}
