"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { ArrowLeft, MapPin, User, Clock, Package, CheckCircle, XCircle, Calendar, DollarSign, Wallet, CreditCard, ArrowDownCircle, ArrowUpCircle, Globe } from "lucide-react";
import Link from "next/link";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageSelector } from "@/components/language-selector";

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
};

// Define the Transaction type
type Transaction = {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  orderId?: string;
  status: 'completed' | 'pending' | 'failed';
};

export default function DriverHistoryPage() {
  const router = useRouter();
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState("deliveries");
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch transaction history
  const fetchTransactionHistory = async () => {
    try {
      setIsLoadingTransactions(true);
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockTransactions: Transaction[] = [
        {
          id: "TRX-1001",
          amount: 8.50,
          type: 'credit',
          description: "Earnings from order #ORD-1001",
          date: "2023-05-15T15:10:00Z",
          orderId: "ORD-1001",
          status: 'completed'
        },
        {
          id: "TRX-982",
          amount: 7.25,
          type: 'credit',
          description: "Earnings from order #ORD-982",
          date: "2023-05-14T12:00:00Z",
          orderId: "ORD-982",
          status: 'completed'
        },
        {
          id: "TRX-965",
          amount: 12.00,
          type: 'credit',
          description: "Earnings from order #ORD-965",
          date: "2023-05-13T10:30:00Z",
          orderId: "ORD-965",
          status: 'completed'
        },
        {
          id: "TRX-BONUS-1",
          amount: 25.00,
          type: 'credit',
          description: "Weekly performance bonus",
          date: "2023-05-16T09:00:00Z",
          status: 'completed'
        },
        {
          id: "TRX-WITHDRAW-1",
          amount: 50.00,
          type: 'debit',
          description: "Withdrawal to bank account",
          date: "2023-05-17T14:30:00Z",
          status: 'completed'
        },
        {
          id: "TRX-PENDING-1",
          amount: 9.75,
          type: 'credit',
          description: "Pending earnings from order #ORD-1010",
          date: "2023-05-18T16:45:00Z",
          orderId: "ORD-1010",
          status: 'pending'
        }
      ];

      // Simulate API delay
      setTimeout(() => {
        setTransactions(mockTransactions);
        setIsLoadingTransactions(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      setError("Failed to load transaction history. Please try again.");
      setIsLoadingTransactions(false);
    }
  };

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

        // Get the user ID directly from localStorage to ensure it's available
        const driverId = localStorage.getItem("user_id");

        console.log("Using driver ID from localStorage:", driverId);

        if (!driverId) {
          throw new Error("Driver ID not found. Please log in again.");
        }

        // Ensure driver ID is a valid number
        const driverIdNum = parseInt(driverId);
        if (isNaN(driverIdNum)) {
          console.error("Invalid driver ID format:", driverId);
          throw new Error("Invalid driver ID format. Please log in again.");
        }

        // Fetch completed orders from the API
        const apiUrl = `/api/orders/driver/history?driver_id=${driverId}`;
        console.log("Fetching from URL:", apiUrl);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          // Try to get more detailed error information
          try {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.error || errorData.details || 'Unknown error'}`);
          } catch (parseError) {
            // If we can't parse the error response, just use the status
            throw new Error(`Error: ${response.status}`);
          }
        }

        const data = await response.json();
        console.log("API response data:", data);

        if (!data.orders || !Array.isArray(data.orders)) {
          throw new Error("Invalid response format");
        }

        // Format the orders for display
        const formattedOrders: Order[] = data.orders.map((order: any) => {
          // Format the delivery address
          let deliveryAddressText = "Unknown address";
          let pickupAddressText = order.pickup_address || "Unknown pickup location";

          if (order.delivery_address) {
            try {
              const deliveryAddress = typeof order.delivery_address === 'string'
                ? JSON.parse(order.delivery_address)
                : order.delivery_address;

              deliveryAddressText = deliveryAddress.street_address || "Unknown address";
            } catch (e) {
              console.error("Error parsing delivery address:", e);
              // If parsing fails, use the raw value or a default
              deliveryAddressText = typeof order.delivery_address === 'string'
                ? order.delivery_address
                : "Unknown address";
            }
          }

          // Calculate earnings (15% of order total)
          const earnings = order.total_amount ? parseFloat(order.total_amount.toString()) * 0.15 : 0;

          return {
            ...order,
            // Format status for display (capitalize first letter)
            status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown",
            // Add UI properties
            pickupAddress: pickupAddressText,
            deliveryAddress: deliveryAddressText,
            customerName: order.customer_name || "Unknown customer",
            customerPhone: "Contact via app", // Placeholder since we don't have phone in DB
            packageDetails: order.package_details || "Package details not available",
            earnings: earnings
          };
        });

        setOrders(formattedOrders);

        // Also fetch transaction history
        fetchTransactionHistory();
      } catch (err) {
        console.error("Error fetching orders:", err);

        // Provide more detailed error message
        if (err instanceof Error) {
          setError(`${t("errors.fetchFailed") || "Failed to fetch delivery history"}: ${err.message}`);
        } else {
          setError(t("errors.fetchFailed") || "Failed to fetch delivery history");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, t]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading") || "Loading..."}</div>;
  }

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
              <h1 className="text-lg font-medium">{t("driver.historyAndTransactions") || "History & Transactions"}</h1>
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
                {t("common.retry") || "Retry"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="deliveries" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="deliveries" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t("driver.deliveries")}
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t("driver.transactions")}
              </TabsTrigger>
            </TabsList>

            {/* Deliveries Tab Content */}
            <TabsContent value="deliveries">
              {orders.length > 0 ? (
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
                                {new Date(order.created_at || "").toLocaleDateString(undefined, {
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
                              : order.status === "Cancelled"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="grid gap-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-slate-500">{t("delivery.from") || "From"}:</p>
                              <p className="font-medium">{order.pickupAddress}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-slate-500">{t("delivery.to") || "To"}:</p>
                              <p className="font-medium">{order.deliveryAddress}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-500" />
                            <span>{t("delivery.customer") || "Customer"}: {order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            <span>{t("delivery.completed") || "Completed"}: {new Date(order.updated_at || "").toLocaleString()}</span>
                          </div>
                          {order.status === "Delivered" && order.earnings && (
                            <div className="flex items-center gap-2 mt-1">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                {t("delivery.earnings") || "Earnings"}: ${order.earnings.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Package className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      {t("delivery.noCompletedDeliveries") || "No completed deliveries yet"}
                    </p>
                    <Button asChild>
                      <Link href="/driver/dashboard">{t("common.backToDashboard") || "Back to Dashboard"}</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Transactions Tab Content */}
            <TabsContent value="transactions">
              {isLoadingTransactions ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <Card key={transaction.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                              transaction.type === 'credit'
                                ? 'bg-green-100 dark:bg-green-900'
                                : 'bg-red-100 dark:bg-red-900'
                            }`}>
                              {transaction.type === 'credit' ? (
                                <ArrowDownCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <ArrowUpCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{transaction.id}</h3>
                              <p className="text-sm text-slate-500">
                                {new Date(transaction.date).toLocaleDateString(undefined, {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`font-medium ${
                              transaction.type === 'credit'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              transaction.status === 'completed'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : transaction.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              {t(`transaction.status.${transaction.status}`)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 text-sm">
                          <p className="text-slate-700 dark:text-slate-300">{transaction.description}</p>
                          {transaction.orderId && (
                            <p className="text-slate-500 mt-1">{t("driver.orderID")}: {transaction.orderId}</p>
                          )}
                          <p className="text-slate-500 mt-1">
                            {new Date(transaction.date).toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Wallet className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      {t("driver.noTransactionHistory")}
                    </p>
                    <Button asChild>
                      <Link href="/driver/dashboard">{t("common.backToDashboard")}</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
      {/* Bottom Taskbar */}
      <footer className="sticky bottom-0 z-10 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-holographic">
        <div className="flex justify-around items-center h-16">
          <Button asChild variant="ghost" size="icon" className="transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link href="/driver/profile">
              <User className="h-6 w-6" />
              <span className="sr-only">{t("driver.profile")}</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link href="/driver/wallet">
              <Wallet className="h-6 w-6" />
              <span className="sr-only">{t("driver.wallet")}</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Link href="/driver/history">
              <Clock className="h-6 w-6" />
              <span className="sr-only">{t("driver.history")}</span>
            </Link>
          </Button>
        </div>
      </footer>

      {/* Chat Dialog */}
    </div>
  );
}
