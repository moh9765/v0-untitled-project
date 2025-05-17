"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface AdminMetricCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  loading?: boolean
}

export function AdminMetricCard({
  title,
  value,
  description,
  icon,
  trend = "neutral",
  loading = false,
}: AdminMetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <CardDescription className="flex items-center pt-1">
              {trend === "up" && <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />}
              {trend === "down" && <TrendingDown className="mr-1 h-3 w-3 text-rose-500" />}
              <span className={trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : ""}>
                {description}
              </span>
            </CardDescription>
          </>
        )}
      </CardContent>
    </Card>
  )
}
