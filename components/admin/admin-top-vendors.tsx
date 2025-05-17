"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface VendorData {
  name: string
  orders: number
  revenue: number
}

export function AdminTopVendors() {
  const { toast } = useToast()
  const [data, setData] = useState<VendorData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const response = await fetch('/api/admin/top-vendors?limit=5')

        if (!response.ok) {
          throw new Error(`Error fetching top vendors: ${response.statusText}`)
        }

        const result = await response.json()

        if (result.vendors && Array.isArray(result.vendors)) {
          // Format the data to ensure all values are numbers
          const formattedData = result.vendors.map((vendor: any) => ({
            name: vendor.name,
            orders: parseInt(vendor.orders) || 0,
            revenue: parseFloat(vendor.revenue) || 0
          }))

          setData(formattedData)
        } else {
          // If no data or invalid format, set empty array
          setData([])
        }
      } catch (error) {
        console.error("Failed to fetch top vendors:", error)
        toast({
          title: "Error",
          description: "Failed to fetch top vendors data. Please try again.",
          variant: "destructive",
        })

        // Set fallback data
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleMouseEnter = (_, index: number) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(null)
  }

  const colors = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"]

  if (loading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={20}
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
            formatter={(value: number, name: string) => {
              if (name === "revenue") {
                return [`$${value.toLocaleString()}`, "Revenue"]
              }
              return [value, "Orders"]
            }}
          />
          <Bar
            dataKey="revenue"
            name="Revenue"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === activeIndex ? "#1e40af" : colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
