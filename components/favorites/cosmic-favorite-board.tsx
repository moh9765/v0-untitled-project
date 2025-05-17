"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Edit2, Trash2, Plus, MoveIcon, Heart, Star, Coffee, Pizza } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import type { FavoriteCollection } from "@/hooks/useFavorites"

interface CosmicFavoriteBoardProps {
  collection: FavoriteCollection
  onEdit: (collection: FavoriteCollection) => void
  onDelete: (collectionId: string) => void
  onSelect: (collectionId: string) => void
  onAddItem: (collectionId: string) => void
}

export function CosmicFavoriteBoard({
  collection,
  onEdit,
  onDelete,
  onSelect,
  onAddItem,
}: CosmicFavoriteBoardProps) {
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

  // Generate a random rotation between -5 and 5 degrees
  const randomRotation = Math.random() * 10 - 5

  // Generate a random animation delay
  const randomDelay = Math.random() * 0.5

  return (
    <motion.div
      whileHover={{
        y: -15,
        scale: 1.08,
        boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1), 0 0 30px ${collection.color || "#FF5722"}80`
      }}
      whileTap={{ scale: isDragging ? 0.92 : 1 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className="cursor-grab active:cursor-grabbing"
      initial={{ rotate: randomRotation, opacity: 0, scale: 0.9 }}
      animate={{
        y: [0, -8, 0, 8, 0],
        rotate: randomRotation,
        opacity: 1,
        scale: 1
      }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        y: {
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          delay: randomDelay
        },
        rotate: {
          duration: 0
        }
      }}
    >
      {/* Glow effect that follows the card */}
      <motion.div
        className="absolute inset-0 rounded-xl blur-xl opacity-50 z-0"
        style={{
          background: `radial-gradient(circle, ${collection.color || "#FF5722"}80 0%, ${collection.color || "#FF5722"}00 70%)`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          delay: randomDelay + 0.5,
        }}
      />

      <div
        className="relative z-10 overflow-hidden border-2 rounded-xl hover:shadow-lg transition-all duration-300 backdrop-blur-xl bg-white/10"
        style={{
          borderColor: collection.color || "#FF5722",
          background: `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))`,
          boxShadow: `0 0 20px ${collection.color || "#FF5722"}60, inset 0 0 10px ${collection.color || "#FF5722"}30`
        }}
      >
        <div className="relative aspect-square overflow-hidden">
          <div className="grid grid-cols-2 grid-rows-2 h-full">
            {previewImages.map((image, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover opacity-90"
                  style={{
                    filter: "brightness(1.1) contrast(1.1)"
                  }}
                />
                {/* Add a subtle color overlay based on collection color */}
                <div
                  className="absolute inset-0 mix-blend-overlay"
                  style={{
                    backgroundColor: `${collection.color || "#FF5722"}30`
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              background: `linear-gradient(45deg, transparent 0%, ${collection.color || "#FF5722"}60 50%, transparent 100%)`,
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end backdrop-blur-sm"
            onClick={() => onSelect(collection.id)}
          >
            <div className="p-3 w-full">
              <motion.h3
                className="text-white font-bold truncate"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {displayName}
              </motion.h3>
              <motion.p
                className="text-white/80 text-sm"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {itemCount} items
              </motion.p>
            </div>
          </div>

          <div className="absolute top-2 right-2 flex gap-1">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-xl border border-white/20 shadow-lg"
                style={{
                  boxShadow: `0 0 10px ${collection.color || "#FF5722"}60`
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(collection)
                }}
              >
                <Edit2 className="h-4 w-4 text-white" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-xl border border-white/20 shadow-lg"
                style={{
                  boxShadow: `0 0 10px ${collection.color || "#FF5722"}60`
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(collection.id)
                }}
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-2 right-2"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-xl border border-white/20 shadow-lg"
              style={{
                boxShadow: `0 0 10px ${collection.color || "#FF5722"}60`
              }}
              onClick={(e) => {
                e.stopPropagation()
                onAddItem(collection.id)
              }}
            >
              <Plus className="h-4 w-4 text-white" />
            </Button>
          </motion.div>

          <div className="absolute top-2 left-2">
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MoveIcon className="h-5 w-5 text-white opacity-80" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
