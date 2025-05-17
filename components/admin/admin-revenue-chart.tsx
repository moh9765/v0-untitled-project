"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface RevenueData {
  name: string
  revenue: number
  orders: number
}

interface AdminRevenueChartProps {
  timeframe: string
}

export function AdminRevenueChart({ timeframe }: AdminRevenueChartProps) {
  const { toast } = useToast()
  const [data, setData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const response = await fetch(`/api/admin/revenue-chart?timeframe=${timeframe}`)

        if (!response.ok) {
          throw new Error(`Error fetching revenue chart data: ${response.statusText}`)
        }

        const result = await response.json()

        if (result.data && Array.isArray(result.data)) {
          // Format the data to ensure all values are numbers
          const formattedData = result.data.map((item: any) => ({
            name: item.name,
            revenue: parseFloat(item.revenue) || 0,
            orders: parseInt(item.orders) || 0
          }))

          setData(formattedData)
        } else {
          // If no data or invalid format, set empty array
          setData([])
        }
      } catch (error) {
        console.error("Failed to fetch revenue chart data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch revenue chart data. Please try again.",
          variant: "destructive",
        })

        // Set fallback data
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeframe, toast])

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis
            dataKey="name"
            className="text-xs text-slate-500 dark:text-slate-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            className="text-xs text-slate-500 dark:text-slate-400"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Revenue"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#82ca9d"
            strokeWidth={2}
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
