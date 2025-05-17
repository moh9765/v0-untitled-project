"use client"

import type React from "react"

import { forwardRef } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ActionButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
  trackingId?: string
  analyticsEvent?: string
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, className, isLoading, loadingText, onClick, trackingId, analyticsEvent, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Track button click if analytics is enabled
      if (trackingId && analyticsEvent) {
        try {
          // Simple analytics tracking
          console.log(`[Analytics] Button clicked: ${analyticsEvent}, id: ${trackingId}`)
          // In a real app, you would use a proper analytics service
        } catch (error) {
          console.error("Analytics error:", error)
        }
      }

      // Call the original onClick handler if provided
      if (onClick) {
        onClick(e)
      }
    }

    return (
      <Button
        ref={ref}
        className={cn("relative", className)}
        onClick={handleClick}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {loadingText || "Loading..."}
          </span>
        )}
        <span className={cn(isLoading ? "invisible" : "visible")}>{children}</span>
      </Button>
    )
  },
)

ActionButton.displayName = "ActionButton"

export { ActionButton }
