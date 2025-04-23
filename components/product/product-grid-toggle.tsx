"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"

type ViewMode = "grid" | "list"

interface ProductGridToggleProps {
  defaultView?: ViewMode
  onViewChange?: (view: ViewMode) => void
}

export function ProductGridToggle({ defaultView = "grid", onViewChange }: ProductGridToggleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView)

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view)
    if (onViewChange) {
      onViewChange(view)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="icon"
        className="h-8 w-8"
        onClick={() => handleViewChange("grid")}
        aria-label="Grid view"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="icon"
        className="h-8 w-8"
        onClick={() => handleViewChange("list")}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
