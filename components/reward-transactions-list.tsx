"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { formatDate } from "@/lib/utils"
import { ArrowUpRight, ArrowDownLeft, Clock, AlertCircle } from "lucide-react"

interface RewardTransaction {
  id: number
  userId: number
  orderId?: number
  points: number
  transactionType: "earn" | "redeem" | "expire" | "adjust"
  description?: string
  createdAt: Date
}

interface RewardTransactionsListProps {
  transactions: RewardTransaction[]
}

export function RewardTransactionsList({ transactions }: RewardTransactionsListProps) {
  const { t } = useLanguage()

  // Transaction type mapping
  const transactionTypeMap = {
    earn: {
      icon: <ArrowUpRight className="h-4 w-4 text-green-500" />,
      label: t("rewards.earned"),
      color: "text-green-500",
    },
    redeem: {
      icon: <ArrowDownLeft className="h-4 w-4 text-amber-500" />,
      label: t("rewards.redeemed"),
      color: "text-amber-500",
    },
    expire: {
      icon: <Clock className="h-4 w-4 text-red-500" />,
      label: t("rewards.expired"),
      color: "text-red-500",
    },
    adjust: {
      icon: <AlertCircle className="h-4 w-4 text-blue-500" />,
      label: t("rewards.adjusted"),
      color: "text-blue-500",
    },
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const type = transactionTypeMap[transaction.transactionType]
        const isPositive = transaction.points > 0

        return (
          <Card key={transaction.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {type.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description || type.label}</p>
                    <p className="text-xs text-slate-500">{formatDate(transaction.createdAt)}</p>
                  </div>
                </div>
                <div className={`font-semibold ${isPositive ? "text-green-500" : "text-amber-500"}`}>
                  {isPositive ? "+" : ""}
                  {transaction.points} {t("rewards.points")}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
