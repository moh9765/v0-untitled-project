"use client"

import { useState, useEffect } from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface SystemAlert {
  id: string
  type: "error" | "warning" | "info" | "success"
  title: string
  description: string
  time: string
  actionText?: string
  actionLink?: string
}

export function AdminAlerts() {
  const { toast } = useToast()
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true)

      try {
        const response = await fetch('/api/admin/alerts?limit=4')

        if (!response.ok) {
          throw new Error(`Error fetching system alerts: ${response.statusText}`)
        }

        const result = await response.json()

        if (result.alerts && Array.isArray(result.alerts)) {
          setAlerts(result.alerts)
        } else {
          // If no data or invalid format, set empty array
          setAlerts([])
        }
      } catch (error) {
        console.error("Failed to fetch system alerts:", error)
        toast({
          title: "Error",
          description: "Failed to fetch system alerts. Please try again.",
          variant: "destructive",
        })

        // Set empty array
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [toast])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      case "success":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getAlertVariant = (type: string): "default" | "destructive" => {
    return type === "error" ? "destructive" : "default"
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant={getAlertVariant(alert.type)}>
          <div className="flex items-start">
            {getAlertIcon(alert.type)}
            <div className="ml-3 w-full">
              <div className="flex items-center justify-between">
                <AlertTitle>{alert.title}</AlertTitle>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {alert.time}
                </span>
              </div>
              <AlertDescription className="mt-1">
                {alert.description}
              </AlertDescription>
              {alert.actionText && alert.actionLink && (
                <Button
                  variant="link"
                  className="mt-2 h-auto p-0 text-sm"
                  asChild
                >
                  <a href={alert.actionLink}>{alert.actionText}</a>
                </Button>
              )}
            </div>
          </div>
        </Alert>
      ))}
    </div>
  )
}
