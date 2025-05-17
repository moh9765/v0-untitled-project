"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useFavorites, FavoriteItem } from "@/hooks/useFavorites"
import { ProductCard } from "@/components/product/product-card"
import { VendorCard } from "@/components/vendor-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, MoveIcon, Plus } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Product } from "@/lib/types/product"
import type { Vendor } from "@/lib/types"
import { PulsingHeartIcon } from "./pulsing-heart-icon"

interface DraggableFavoriteItemProps {
  item: FavoriteItem
  collectionId?: string
  onAddToCollection?: (item: FavoriteItem) => void
  onRemoveFromCollection?: (item: FavoriteItem) => void
}

export function DraggableFavoriteItem({
  item,
  collectionId,
  onAddToCollection,
  onRemoveFromCollection,
}: DraggableFavoriteItemProps) {
  const { toggleFavorite, favorites } = useFavorites()
  const { isRTL } = useLanguage()
  const [isDragging, setIsDragging] = useState(false)
  
  const isFavorited = favorites.some(f => f.id === item.id && f.type === item.type)
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(item)
  }
  
  const handleAddToCollection = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onAddToCollection) {
      onAddToCollection(item)
    }
  }
  
  const handleRemoveFromCollection = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemoveFromCollection) {
      onRemoveFromCollection(item)
    }
  }
  
  // Determine if item is a product or vendor
  const isProduct = item.type === "product"
  const isVendor = item.type === "vendor"
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: isDragging ? 0.95 : 1 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className="relative cursor-grab active:cursor-grabbing"
    >
      {isProduct && (
        <div className="relative">
          <ProductCard product={item as Product} layout="grid" />
          <div className="absolute top-2 left-2 bg-white/80 rounded-full p-1">
            <MoveIcon className="h-4 w-4 text-slate-600" />
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <PulsingHeartIcon 
              isFavorited={isFavorited}
              onClick={handleToggleFavorite}
              size="sm"
            />
            
            {collectionId ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-white/80 hover:bg-white rounded-full"
                onClick={handleRemoveFromCollection}
              >
                <Trash2 className="h-4 w-4 text-slate-600" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-white/80 hover:bg-white rounded-full"
                onClick={handleAddToCollection}
              >
                <Plus className="h-4 w-4 text-slate-600" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      {isVendor && (
        <div className="relative">
          <VendorCard vendor={item as Vendor} />
          <div className="absolute top-2 left-2 bg-white/80 rounded-full p-1">
            <MoveIcon className="h-4 w-4 text-slate-600" />
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <PulsingHeartIcon 
              isFavorited={isFavorited}
              onClick={handleToggleFavorite}
              size="sm"
            />
            
            {collectionId ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-white/80 hover:bg-white rounded-full"
                onClick={handleRemoveFromCollection}
              >
                <Trash2 className="h-4 w-4 text-slate-600" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-white/80 hover:bg-white rounded-full"
                onClick={handleAddToCollection}
              >
                <Plus className="h-4 w-4 text-slate-600" />
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
