"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, DollarSign } from "lucide-react"

interface AddFundsDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (amount: number) => void
  userId: string
}

export function AddFundsDialog({ isOpen, onClose, onSuccess, userId }: AddFundsDialogProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "")
    
    // Ensure only one decimal point
    const parts = value.split(".")
    if (parts.length > 2) {
      return
    }
    
    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      return
    }
    
    setAmount(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: t("common.error"),
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would process payment first
      // For now, we'll just add the funds directly
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount: parseFloat(amount),
          description: `Added funds via ${paymentMethod === "card" ? "credit card" : "other method"}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add funds")
      }

      const data = await response.json()
      
      toast({
        title: "Funds Added",
        description: `$${parseFloat(amount).toFixed(2)} has been added to your wallet`,
      })
      
      onSuccess(parseFloat(amount))
      onClose()
    } catch (error) {
      console.error("Error adding funds:", error)
      toast({
        title: t("common.error"),
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("wallet.addFunds")}</DialogTitle>
          <DialogDescription>
            Add money to your wallet to use for future purchases.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="amount"
                  placeholder="0.00"
                  className="pl-9"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <CreditCard className="h-5 w-5 text-slate-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Credit Card</p>
                  <p className="text-xs text-slate-500">•••• •••• •••• 4242</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : t("wallet.addFunds")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
