"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useLanguage } from "@/contexts/language-context";
import { OrderCard } from "@/components/order-card";
import type { Order } from "@/lib/types";

export default function OrderHistoryPage() {
  const router = useRouter();
  const { t, dir } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication status and retrieve customer_id from localStorage
        const authStatus = localStorage.getItem("is_authenticated") === "true";
        const customer_id = localStorage.getItem("user_id"); // Assuming `user_id` is stored in localStorage
        const email = localStorage.getItem("user_email"); // Assuming `user_id` is stored in localStorage

        console.log("Customer ID:", customer_id); // Debugging line
        setIsAuthenticated(authStatus);

        // Redirect if not authenticated or no customer_id is found
        if (!authStatus || !customer_id) {
          router.push("/auth/login?role=customer");
          return;
        }

        // Fetch orders from the backend
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customer_id : email}), // Sending the customer_id
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error("Error fetching orders:", errorMessage);
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders); // Store fetched orders
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(t("errors.fetchFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, t]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect if not authenticated
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              {t("common.retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3">
          <MobileNav role="customer" />
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-medium">{t("delivery.orderHistory")}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20">
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-slate-500 dark:text-slate-400 mb-4">{t("dashboard.noActiveDeliveries")}</p>
              <Button asChild>
                <Link href="/customer/new-delivery">{t("delivery.createDelivery")}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
}
