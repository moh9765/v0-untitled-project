"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, Wallet, Plus, CreditCard, ArrowDownCircle, ArrowUpCircle, Globe } from "lucide-react"
import { AddFundsDialog } from "@/components/add-funds-dialog"
import { LogoutButton } from "@/components/logout-button"
import { LanguageSelector } from "@/components/language-selector"

export default function WalletPage() {
  const { t, dir, isRTL } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false)

  // Function to fetch wallet data
  const fetchWalletData = async (id: string) => {
    try {
      const response = await fetch(`/api/wallet?userId=${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch wallet data")
      }

      const data = await response.json()
      setBalance(parseFloat(data.wallet.balance) || 0)

      // Format transactions for display
      const formattedTransactions = data.transactions.map((tx: any) => ({
        id: tx.id,
        type: tx.transaction_type,
        amount: parseFloat(tx.amount),
        date: new Date(tx.created_at).toISOString().split('T')[0],
        status: tx.status,
        description: tx.description
      }))

      setTransactions(formattedTransactions)
    } catch (error) {
      console.error("Error fetching wallet data:", error)
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive",
      })
    }
  }

  // Handle successful fund addition
  const handleFundsAdded = (amount: number) => {
    // Update balance
    setBalance(prev => prev + amount)

    // Add new transaction to the list
    const newTransaction = {
      id: Date.now(), // Temporary ID
      type: "topup",
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: "completed",
      description: "Added funds"
    }

    setTransactions(prev => [newTransaction, ...prev])
  }

  // Function to check authentication and redirect if needed
  const checkAuthentication = () => {
    try {
      // Check authentication status
      const authStatus = localStorage.getItem("is_authenticated") === "true"
      const storedUserId = localStorage.getItem("user_id")

      console.log("Authentication check:", { authStatus, storedUserId })

      setIsAuthenticated(authStatus)

      // Redirect if not authenticated
      if (!authStatus) {
        console.log("Not authenticated, redirecting to login")
        // Use window.location for a hard redirect
        window.location.href = "/auth/login"
        return false
      }

      if (storedUserId) {
        setUserId(storedUserId)
        fetchWalletData(storedUserId)
      } else {
        console.log("No user ID found, redirecting to login")
        // Use window.location for a hard redirect
        window.location.href = "/auth/login"
        return false
      }

      return true
    } catch (error) {
      console.error("Error checking authentication:", error)
      // Redirect to login on error
      window.location.href = "/auth/login"
      return false
    }
  }

  useEffect(() => {
    // Check authentication on component mount
    const isAuth = checkAuthentication()

    // Only set loading to false if authenticated
    if (isAuth) {
      setIsLoading(false)
    }

    // Set up interval to periodically check authentication
    const authCheckInterval = setInterval(() => {
      const authStatus = localStorage.getItem("is_authenticated") === "true"
      if (!authStatus && isAuthenticated) {
        console.log("Authentication status changed, redirecting to login")
        window.location.href = "/auth/login"
      }
    }, 5000) // Check every 5 seconds

    return () => {
      clearInterval(authCheckInterval)
    }
  }, [isAuthenticated])

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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
              </Button>
              <h1 className="text-xl font-bold ml-2">{t("wallet.title")}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector size="sm" variant="ghost" />
              <LogoutButton variant="ghost" size="sm" />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 pb-20">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-sky-500 to-blue-600 text-white mb-6">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-white/80">{t("wallet.balance")}</h2>
                <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button
                  className="flex-1 bg-white/20 hover:bg-white/30"
                  onClick={() => setShowAddFundsDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("wallet.addFunds")}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  {t("wallet.withdraw")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="transactions">{t("wallet.transactions")}</TabsTrigger>
            <TabsTrigger value="payment">{t("wallet.paymentMethods")}</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {transaction.type === "topup" ? (
                        <ArrowDownCircle className="h-10 w-10 text-green-500 mr-3" />
                      ) : (
                        <ArrowUpCircle className="h-10 w-10 text-red-500 mr-3" />
                      )}
                      <div>
                        <h3 className="font-medium">{transaction.type === "topup" ? t("wallet.topUp") : "Payment"}</h3>
                        <p className="text-sm text-slate-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className={transaction.type === "topup" ? "text-green-600" : "text-red-500"}>
                      {transaction.type === "topup" ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-10 w-10 text-slate-500 mr-3" />
                  <div>
                    <h3 className="font-medium">•••• •••• •••• 4242</h3>
                    <p className="text-sm text-slate-500">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  {t("common.edit")}
                </Button>
              </CardContent>
            </Card>

            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {t("wallet.addCard")}
            </Button>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />

      {/* Add Funds Dialog */}
      {userId && (
        <AddFundsDialog
          isOpen={showAddFundsDialog}
          onClose={() => setShowAddFundsDialog(false)}
          onSuccess={handleFundsAdded}
          userId={userId}
        />
      )}
    </div>
  )
}
