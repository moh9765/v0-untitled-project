"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Plus, MoveIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { FavoriteCollection } from "@/hooks/useFavorites"
import Image from "next/image"

interface FavoriteBoardProps {
  collection: FavoriteCollection
  onEdit: (collection: FavoriteCollection) => void
  onDelete: (collectionId: string) => void
  onSelect: (collectionId: string) => void
  onAddItem: (collectionId: string) => void
}

export function FavoriteBoard({
  collection,
  onEdit,
  onDelete,
  onSelect,
  onAddItem,
}: FavoriteBoardProps) {
  const { isRTL } = useLanguage()
  const [isDragging, setIsDragging] = useState(false)

  // Get preview images from collection items (up to 4)
  const getPreviewImages = () => {
    const images: string[] = []
    
    // Try to get images from products first
    const productImages = collection.items
      .filter(item => item.type === "product" && item.thumbnail)
      .map(item => item.thumbnail as string)
      .slice(0, 4)
    
    images.push(...productImages)
    
    // If we need more, try to get from vendors
    if (images.length < 4) {
      const vendorImages = collection.items
        .filter(item => item.type === "vendor" && item.image)
        .map(item => item.image as string)
        .slice(0, 4 - images.length)
      
      images.push(...vendorImages)
    }
    
    // Fill remaining slots with placeholders
    while (images.length < 4) {
      images.push("/placeholder.svg")
    }
    
    return images
  }

  const previewImages = getPreviewImages()
  const itemCount = collection.items.length
  const displayName = isRTL && collection.nameAr ? collection.nameAr : collection.name
  const displayDescription = isRTL && collection.descriptionAr 
    ? collection.descriptionAr 
    : collection.description || ""

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: isDragging ? 0.95 : 1 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card 
        className="overflow-hidden border-2 hover:shadow-lg transition-all duration-300"
        style={{
          borderColor: collection.color || "#FF5722",
          background: `linear-gradient(to bottom, white, white)`,
        }}
      >
        <div className="relative aspect-square overflow-hidden">
          <div className="grid grid-cols-2 grid-rows-2 h-full">
            {previewImages.map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end"
            onClick={() => onSelect(collection.id)}
          >
            <div className="p-3 w-full">
              <h3 className="text-white font-bold truncate">{displayName}</h3>
              <p className="text-white/80 text-sm">{itemCount} items</p>
            </div>
          </div>
          
          <div className="absolute top-2 right-2 flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 bg-white/80 hover:bg-white rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(collection)
              }}
            >
              <Edit2 className="h-4 w-4 text-slate-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 bg-white/80 hover:bg-white rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(collection.id)
              }}
            >
              <Trash2 className="h-4 w-4 text-slate-600" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8 bg-white/80 hover:bg-white rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              onAddItem(collection.id)
            }}
          >
            <Plus className="h-4 w-4 text-slate-600" />
          </Button>
          
          <div className="absolute top-2 left-2">
            <MoveIcon className="h-5 w-5 text-white opacity-70" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
