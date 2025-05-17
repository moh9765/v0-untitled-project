"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/lib/types"
import {
  Utensils,
  ShoppingBasket,
  AmbulanceIcon as FirstAid,
  Pizza,
  BeefIcon as Burger,
  Fish,
  IceCreamBowlIcon as BowlFood,
  Apple,
  Milk,
  Cookie,
  Coffee,
  CroissantIcon as Bread,
  Pill,
  HeartPulse,
  Baby,
  ShowerHeadIcon as Shower,
  type LucideIcon,
  Package,
} from "lucide-react"
import Link from "next/link"
import { TranslationKey } from "@/lib/i18n/translations"

interface CategoryCardProps {
  category: Category
  size?: "sm" | "md" | "lg"
}

// Map category icons to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  "shopping-basket": ShoppingBasket,
  "first-aid": FirstAid,
  pizza: Pizza,
  burger: Burger,
  fish: Fish,
  "bowl-food": BowlFood,
  apple: Apple,
  milk: Milk,
  cookie: Cookie,
  coffee: Coffee,
  bread: Bread,
  pill: Pill,
  "heart-pulse": HeartPulse,
  baby: Baby,
  shower: Shower,
  package: Package, // Add package icon
}

export function CategoryCard({ category, size = "md" }: CategoryCardProps) {
  const { t, isRTL } = useLanguage()

  // Get the icon component
  const IconComponent = iconMap[category.icon] || Utensils

  // Determine size classes
  const sizeClasses = {
    sm: "h-20 w-20",
    md: "h-28 w-28",
    lg: "h-36 w-36",
  }

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  // Determine the link based on category type
  const linkHref = category.id === "groceries" ? "/marketplace" : `/category/${category.id}`

  return (
    <Link href={linkHref}>
      <Card
        className={`${sizeClasses[size]} flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer rounded-xl`}
      >
        <CardContent className="flex flex-col items-center justify-center p-2">
          <IconComponent className={`${iconSizes[size]} text-sky-500 mb-2`} />
          <span className="text-center font-medium text-sm">{t(category.nameKey as TranslationKey)}</span>
        </CardContent>
      </Card>
    </Link>
  )
}
