"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import type { FavoriteCollection } from "@/hooks/useFavorites"
import { ColorPicker } from './color-picker'

interface BoardCreationDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (collection: Partial<FavoriteCollection>) => void
  collection?: FavoriteCollection
}

export function BoardCreationDialog({
  isOpen,
  onClose,
  onSave,
  collection,
}: BoardCreationDialogProps) {
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState<Partial<FavoriteCollection>>({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    color: "#FF5722", // Default to deep orange from the design vision
  })

  // Set form data when editing an existing collection
  useEffect(() => {
    if (collection) {
      setFormData({
        id: collection.id,
        name: collection.name,
        nameAr: collection.nameAr,
        description: collection.description,
        descriptionAr: collection.descriptionAr,
        color: collection.color || "#FF5722",
      })
    } else {
      // Reset form for new collection
      setFormData({
        name: "",
        nameAr: "",
        description: "",
        descriptionAr: "",
        color: "#FF5722",
      })
    }
  }, [collection, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleColorChange = (color: any) => {
    setFormData(prev => ({ ...prev, color: color.hex }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  // Color palette based on the design vision
  const colorPalette = [
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {collection ? t("favorites.editCollection") : t("favorites.createCollection")}
            </DialogTitle>
            <DialogDescription>
              {t("favorites.collectionDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">{t("favorites.collectionName")}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="nameAr">{t("favorites.collectionNameAr")}</Label>
              <Input
                id="nameAr"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleChange}
                dir="rtl"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description">{t("favorites.collectionDescription")}</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="descriptionAr">{t("favorites.collectionDescriptionAr")}</Label>
              <Textarea
                id="descriptionAr"
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleChange}
                dir="rtl"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label>{t("favorites.collectionColor")}</Label>
              <div className="flex justify-center py-2">
                <ColorPicker
                  color={formData.color || "#FF5722"}
                  onChange={(color) => setFormData(prev => ({ ...prev, color }))}
                  colors={colorPalette}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">
              {collection ? t("common.save") : t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
