"use client"

import { useState } from "react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  colors?: string[]
}

export function ColorPicker({
  color,
  onChange,
  colors = [
    "#FF5722", // Deep orange (primary)
    "#FF7043", // Warm coral (primary)
    "#212121", // Matte black (primary)
    "#CDDC39", // Lime zest green (accent)
    "#F5F5DC", // Creamy beige (accent)
    "#FF80AB", // Candy pink (accent)
    "#3F51B5", // Indigo
    "#009688", // Teal
    "#9C27B0", // Purple
    "#FFC107", // Amber
  ]
}: ColorPickerProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {colors.map((colorOption) => (
        <button
          key={colorOption}
          type="button"
          className={`h-7 w-7 rounded-full border-2 transition-all ${
            color === colorOption ? "border-slate-800 scale-110" : "border-slate-200"
          }`}
          style={{ backgroundColor: colorOption }}
          onClick={() => onChange(colorOption)}
          aria-label={`Select color ${colorOption}`}
        />
      ))}
    </div>
  )
}
