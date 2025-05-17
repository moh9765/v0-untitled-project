"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { ArrowLeft, MapPin, User, Clock, Package, CheckCircle, XCircle, Navigation, DollarSign } from "lucide-react";
import Link from "next/link";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/language-selector";
import { getDirectionsUrl, getStaticMapUrl } from "@/lib/location-service";

// Define the Order type
type Order = {
  id: string;
  pickupAddress: string;
  deliveryAddress: string;
  distance?: number;
  packageDetails: string;
  customerName: string;
  status?: string;
  driverName?: string;
  driverPhone?: string;
  price?: number;
  estimatedTime?: string;
  created_at?: string;
  updated_at?: string;
  total_amount?: number;
  payment_method?: string;
  priority?: 'normal' | 'high' | 'urgent';
  earnings?: number;
  pickup_lat?: number;
  pickup_lng?: number;
  delivery_lat?: number;
  delivery_lng?: number;
};

export default function DriverNavigationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 40.7128, lng: -74.006 }); // Default to NYC
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("is_authenticated") === "true";
      const role = localStorage.getItem("user_role");

      if (!authStatus || role !== "driver") {
        router.push("/auth/login?role=driver");
        return false;
      }
      return true;
    };

    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);

        if (!checkAuth()) return;

        // Get the order ID from the URL
        const orderId = searchParams.get("id");
        if (!orderId) {
          throw new Error("No order ID provided");
        }

        // In a real app, fetch from API
        // For now, use mock data
        const mockOrder: Order = {
          id: orderId,
          pickupAddress: "123 Main St, New York, NY",
          deliveryAddress: "456 Park Ave, New York, NY",
          packageDetails: "Food delivery - 2 bags",
          customerName: "John Smith",
          distance: 2.3,
          status: "In Transit",
          total_amount: 24.99,
          created_at: "2023-05-15T14:30:00Z",
          updated_at: "2023-05-15T15:10:00Z",
          payment_method: "Card",
          earnings: 8.50,
          pickup_lat: 40.7128,
          pickup_lng: -74.006,
          delivery_lat: 40.7308,
          delivery_lng: -73.9975
        };

        setOrder(mockOrder);

        // Get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (err) => {
              console.error("Error getting location:", err);
            }
          );
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load order details");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [router, searchParams, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
        <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="px-4 py-3">
            <MobileNav role="driver" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                  <Link href="/driver/dashboard">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <h1 className="text-lg font-medium">{t("navigation.title") || "Navigation"}</h1>
              </div>
              <LanguageSelector size="sm" variant="ghost" />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-red-500 dark:text-red-400 mb-4">{error || "Order not found"}</p>
              <Button onClick={() => router.back()}>
                {t("common.goBack") || "Go Back"}
              </Button>
            </CardContent>
          </Card>
        </main>

        <BottomNavigation />
      </div>
    );
  }

  // Generate map URL
  const destination = order.status?.toLowerCase() === "assigned" || order.status?.toLowerCase() === "pending"
    ? { lat: order.pickup_lat || 0, lng: order.pickup_lng || 0 }
    : { lat: order.delivery_lat || 0, lng: order.delivery_lng || 0 };

  const staticMapUrl = getStaticMapUrl(
    currentLocation,
    [{ lat: destination.lat, lng: destination.lng, label: "D" }],
    14,
    600,
    300
  );

  const directionsUrl = getDirectionsUrl(
    destination.lat,
    destination.lng,
    currentLocation.lat,
    currentLocation.lng,
    "driving"
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <MobileNav role="driver" />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild className="mr-2">
                <Link href="/driver/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-lg font-medium">{t("navigation.title") || "Navigation"}</h1>
            </div>
            <LanguageSelector size="sm" variant="ghost" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-4">
        <Card className="overflow-hidden">
          <div className="h-[200px] w-full relative">
            <img
              src={staticMapUrl}
              alt="Map showing route"
              className="h-full w-full object-cover"
              onError={() => setMapError("Failed to load map")}
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Order #{order.id}</h2>
              <Badge variant="outline" className={`
                ${order.status?.toLowerCase() === "delivered" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                  order.status?.toLowerCase() === "cancelled" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : 
                  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}
              `}>
                {order.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-slate-500">Pickup Location:</p>
                  <p className="font-medium">{order.pickupAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-slate-500">Delivery Location:</p>
                  <p className="font-medium">{order.deliveryAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Customer:</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Package:</p>
                  <p className="font-medium">{order.packageDetails}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">Estimated Time:</p>
                  <p className="font-medium">{order.estimatedTime || `${Math.floor((order.distance || 0) * 5)} min`}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-slate-500">Earnings:</p>
                  <p className="font-medium text-green-600 dark:text-green-400">${order.earnings?.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="h-5 w-5 mr-2" />
                  Open in Google Maps
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}
