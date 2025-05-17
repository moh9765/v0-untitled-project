"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface PulsingHeartIconProps {
  isFavorited: boolean
  onClick: (e: React.MouseEvent) => void
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PulsingHeartIcon({
  isFavorited,
  onClick,
  size = "md",
  className = "",
}: PulsingHeartIconProps) {
  const [hasPulsed, setHasPulsed] = useState(false)
  const [prevFavorited, setPrevFavorited] = useState(isFavorited)

  // Determine icon size based on the size prop
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const buttonSizes = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  // Detect changes in favorite status to trigger pulse animation
  useEffect(() => {
    if (isFavorited && !prevFavorited) {
      setHasPulsed(true)
      const timer = setTimeout(() => setHasPulsed(false), 500)
      return () => clearTimeout(timer)
    }
    setPrevFavorited(isFavorited)
  }, [isFavorited, prevFavorited])

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`${buttonSizes[size]} bg-white/80 hover:bg-white rounded-full ${className}`}
      onClick={onClick}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`heart-${isFavorited ? "filled" : "outline"}`}
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: hasPulsed ? [1, 1.3, 1] : 1,
            transition: {
              duration: hasPulsed ? 0.5 : 0.2,
              ease: hasPulsed ? "easeInOut" : "easeOut"
            }
          }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative"
        >
          <Heart
            className={`${iconSizes[size]} transition-colors duration-300 ${
              isFavorited
                ? "fill-red-500 text-red-500"
                : "text-slate-600 hover:text-red-400"
            }`}
          />
          
          {/* Pulse effect ring */}
          {hasPulsed && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-red-400 -z-10"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  )
}
