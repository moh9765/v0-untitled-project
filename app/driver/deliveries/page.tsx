"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { ArrowLeft, MapPin, User, Clock, Package, CheckCircle, XCircle, Truck, ShoppingBag, Navigation, AlertTriangle, DollarSign, Wallet, Globe } from "lucide-react";
import Link from "next/link";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSelector } from "@/components/language-selector";
import { useToast } from "@/hooks/use-toast";
// import { mockOrders, updateOrder } from "@/lib/mock-orders";

// Define the Order type
type Order = {
  id: string | number
  customer_id?: number
  driver_id?: number
  status: string
  total_amount?: number
  delivery_address?: any
  pickup_address?: string
  package_details?: string
  created_at: string
  updated_at?: string
  customer_name?: string
  customer_email?: string
  items?: any[]
  payment_method?: string
  // UI display properties
  estimatedDelivery?: string
  customerPhone?: string
  distance?: number
  notes?: string
  earnings?: number
  priority?: 'normal' | 'high' | 'urgent'
};

export default function DriverDeliveriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, dir, isRTL } = useLanguage();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get the order ID from the URL if present
  const orderId = searchParams.get("id");

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("is_authenticated") === "true";
      const role = localStorage.getItem("user_role");
      const name = localStorage.getItem("user_name") || "Driver";
      const id = localStorage.getItem("user_id");

      setIsAuthenticated(authStatus);
      setUserName(name);
      setUserId(id);

      if (!authStatus || role !== "driver") {
        router.push("/auth/login?role=driver");
        return false;
      }
      return true;
    };

    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (!checkAuth()) return;

        // Fetch orders from the API
        const response = await fetch(`/api/orders/driver?driver_id=${userId}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const driverOrders = data.orders || [];

        // Process orders to add UI-friendly properties
        const processedOrders = driverOrders.map((order: any) => {
          // Format delivery address
          let deliveryAddressText = "Unknown location";
          if (typeof order.delivery_address === 'string') {
            try {
              const addressObj = JSON.parse(order.delivery_address);
              deliveryAddressText = addressObj.street_address || addressObj.address || order.delivery_address;
            } catch {
              deliveryAddressText = order.delivery_address;
            }
          } else if (order.delivery_address && order.delivery_address.street_address) {
            deliveryAddressText = order.delivery_address.street_address;
          }

          // Calculate estimated delivery time (just a placeholder)
          const orderDate = new Date(order.created_at);
          const estimatedDelivery = new Date(orderDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours after order time

          return {
            ...order,
            // Format status for display (capitalize first letter)
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
            // Add UI properties
            estimatedDelivery: estimatedDelivery.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            customerPhone: "Contact via app", // Placeholder since we don't have phone in DB
            delivery_address: deliveryAddressText
          };
        });

        setOrders(processedOrders);

        // If there's an order ID in the URL, find that order
        if (orderId) {
          const order = processedOrders.find((o: Order) => o.id.toString() === orderId);
          if (order) {
            setSelectedOrder(order);
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(t("errors.fetchFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, t, userName, orderId]);

  const handleUpdateStatus = async (id: string | number, newStatus: string) => {
    try {
      // Update the order status via API
      const response = await fetch('/api/orders/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: id,
          status: newStatus.toLowerCase(),
          driver_id: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id.toString() === id.toString()
            ? { ...order, status: newStatus }
            : order
        )
      );

      if (selectedOrder && selectedOrder.id.toString() === id.toString()) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      // Show appropriate toast message based on status
      let toastTitle = t("orders.statusUpdated");
      let toastDescription = `${t("orders.orderStatus")}: ${newStatus}`;
      let toastVariant: "default" | "destructive" = "default";

      switch(newStatus.toLowerCase()) {
        case "picked_up":
          toastTitle = "Order Picked Up";
          toastDescription = "You've confirmed pickup from the restaurant";
          break;
        case "in_transit":
          toastTitle = "Order In Transit";
          toastDescription = "You're now delivering the order";
          break;
        case "delivered":
          toastTitle = "Order Delivered";
          toastDescription = "Delivery completed successfully!";
          break;
        case "cancelled":
          toastTitle = "Order Cancelled";
          toastDescription = "The order has been cancelled";
          toastVariant = "destructive";
          break;
      }

      toast({
        title: toastTitle,
        description: toastDescription,
        variant: toastVariant,
      });

      // If the order is delivered, add earnings to the driver's wallet
      if (newStatus.toLowerCase() === "delivered" && selectedOrder?.total_amount) {
        // In a real app, this would be handled by the server
        // For now, we'll just show a toast
        const earnings = (selectedOrder.total_amount * 0.15).toFixed(2); // 15% of order total

        toast({
          title: "Earnings Added",
          description: `$${earnings} has been added to your wallet`,
        });
      }

      // If we're on the order detail view, go back to the list after a short delay
      if (orderId) {
        setTimeout(() => {
          router.push("/driver/deliveries");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: t("errors.error"),
        description: t("errors.updateFailed"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // If an order ID is provided, show the order details
  if (selectedOrder) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="px-4 py-3">
            <MobileNav role="driver" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                  <Link href="/driver/deliveries">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <h1 className="text-lg font-medium">{t("delivery.orderDetails")}</h1>
              </div>
              <LanguageSelector size="sm" variant="ghost" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 pb-20">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{selectedOrder.id}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedOrder.status === "Delivered"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : selectedOrder.status === "In Transit"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
              <CardDescription>
                {t("delivery.estimatedDelivery")}: {selectedOrder.estimatedDelivery || t("delivery.calculating")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">{t("delivery.from")}</p>
                    <p className="font-medium">{selectedOrder.pickup_address || "Store location"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">{t("delivery.to")}</p>
                    <p className="font-medium">{selectedOrder.delivery_address}</p>
                  </div>
                </div>
              </div>

              {/* Order items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="grid gap-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Package className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">{t("orders.items")}</p>
                      <div className="space-y-1">
                        {selectedOrder.items.map((item: any, index: number) => (
                          <p key={index} className="font-medium">
                            {item.quantity}x {item.product_name}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Package details if available */}
              {selectedOrder.package_details && (
                <div className="grid gap-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Package className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">{t("delivery.packageDetails")}</p>
                      <p className="font-medium">{selectedOrder.package_details}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes if available */}
              {selectedOrder.notes && (
                <div className="grid gap-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Package className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">{t("delivery.notes")}</p>
                      <p className="font-medium">{selectedOrder.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer info */}
              <div className="grid gap-2">
                <div className="flex items-start gap-2 text-sm">
                  <User className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">{t("delivery.customerInfo")}</p>
                    <p className="font-medium">{selectedOrder.customer_name || "Customer"}</p>
                    {selectedOrder.customerPhone && (
                      <p className="text-sm">{selectedOrder.customerPhone}</p>
                    )}
                    {selectedOrder.customer_email && (
                      <p className="text-sm">{selectedOrder.customer_email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Total amount */}
              {selectedOrder.total_amount && (
                <div className="flex justify-between font-medium text-sm mt-2 pt-2 border-t">
                  <span>{t("orders.total")}</span>
                  <span>${selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              )}

              {/* Update status buttons */}
              <div className="grid grid-cols-1 gap-3 mt-6">
                <h3 className="text-sm font-medium text-slate-500">Update Order Status</h3>

                {/* Status flow: Assigned -> Picked Up -> In Transit -> Delivered */}
                {selectedOrder.status.toLowerCase() === "assigned" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Picked_Up")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Mark as Picked Up
                  </Button>
                )}

                {selectedOrder.status.toLowerCase() === "picked_up" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "In_Transit")}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Truck className="h-4 w-4" />
                    Start Delivery (In Transit)
                  </Button>
                )}

                {selectedOrder.status.toLowerCase() === "in_transit" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Delivered")}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark as Delivered
                  </Button>
                )}

                {/* Navigation button */}
                {selectedOrder.status.toLowerCase() !== "delivered" &&
                 selectedOrder.status.toLowerCase() !== "cancelled" && (
                  <Button
                    asChild
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Link href={`/driver/navigation?id=${selectedOrder.id}`}>
                      <Navigation className="h-4 w-4" />
                      Navigate to {selectedOrder.status.toLowerCase() === "assigned" ? "Pickup" : "Delivery"}
                    </Link>
                  </Button>
                )}

                {/* Cancel button - always available except for completed orders */}
                {selectedOrder.status.toLowerCase() !== "delivered" &&
                 selectedOrder.status.toLowerCase() !== "cancelled" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Cancelled")}
                    variant="outline"
                    className="flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Delivery
                  </Button>
                )}

                {/* For delivered orders, show earnings */}
                {selectedOrder.status.toLowerCase() === "delivered" && selectedOrder.total_amount && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">Earnings</p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          ${(selectedOrder.total_amount * 0.15).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="border-green-200 dark:border-green-800">
                      <Link href="/wallet">View Wallet</Link>
                    </Button>
                  </div>
                )}

                {/* For cancelled orders, show cancellation notice */}
                {selectedOrder.status.toLowerCase() === "cancelled" && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      This order has been cancelled and is no longer active.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
        {/* Bottom navigation */}
        <BottomNavigation />
      </div>
    );
  }

  // Otherwise, show the list of orders
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 max-w-md mx-auto" dir={dir}>
      {/* Header */}
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
              <h1 className="text-lg font-medium">{t("delivery.myDeliveries")}</h1>
            </div>
            <LanguageSelector size="sm" variant="ghost" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20">
        {error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                {t("common.retry")}
              </Button>
            </CardContent>
          </Card>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{order.id}</h3>
                        <p className="text-sm text-slate-500">
                          {new Date(order.created_at).toLocaleDateString(undefined, {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : order.status === "In Transit"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid gap-2 mt-3">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">{t("delivery.from")}</p>
                        <p className="font-medium">{order.pickup_address || "Store location"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">{t("delivery.to")}</p>
                        <p className="font-medium">{order.delivery_address}</p>
                      </div>
                    </div>

                    {order.estimatedDelivery && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span>
                          {t("delivery.estimatedDelivery")}: {order.estimatedDelivery}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button variant="link" asChild className="px-0 mt-2">
                    <Link href={`/driver/deliveries?id=${order.id}`} className="flex items-center gap-1">
                      {t("common.details")}
                      {isRTL ? (
                        <ArrowLeft className="h-3 w-3" />
                      ) : (
                        <ArrowLeft className="h-3 w-3 rotate-180" />
                      )}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 mb-4">{t("dashboard.noActiveDeliveries")}</p>
              <Button asChild>
                <Link href="/driver/dashboard">{t("common.backToDashboard")}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      {/* Bottom Taskbar */}
      <footer className="sticky bottom-0 z-10 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-holographic">
        <div className="flex justify-around items-center h-16">
          <Button asChild variant="ghost" size="icon" className="transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link href="/driver/profile">
              <User className="h-6 w-6" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link href="/driver/wallet">
              <Wallet className="h-6 w-6" />
              <span className="sr-only">Wallet</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link href="/driver/history">
              <Clock className="h-6 w-6" />
              <span className="sr-only">History</span>
            </Link>
          </Button>
        </div>
      </footer>

      {/* Chat Dialog */}
    </div>
  );
}
