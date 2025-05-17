export type ProductTag =
  | "vegan"
  | "organic"
  | "gluten-free"
  | "dairy-free"
  | "sugar-free"
  | "local"
  | "imported"
  | "new"
  | "popular"
  | "sale"

export type ProductCategory = {
  id: string
  name: string
  nameAr?: string
  icon: string
  subcategories?: ProductSubcategory[]
}

export type ProductSubcategory = {
  id: string
  name: string
  nameAr?: string
  categoryId: string
}

export type ProductReview = {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
}

export type NutritionInfo = {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber?: number
  sugar?: number
  sodium?: number
}

export type Product = {
  id: string
  name: string
  nameAr?: string
  description: string
  descriptionAr?: string
  price: number
  originalPrice?: number // For discounted items
  images: string[]
  thumbnail: string
  categoryId: string
  subcategoryId?: string
  tags: ProductTag[]
  rating: number
  ratingCount: number
  reviews?: ProductReview[]
  stock: number
  unit: string // e.g., kg, piece, pack
  weight?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  nutritionInfo?: NutritionInfo
  ingredients?: string[]
  allergens?: string[]
  substitutions?: string[] // IDs of substitute products
  relatedProducts?: string[] // IDs of related products
  isFavorite?: boolean
  isNew?: boolean
  isPopular?: boolean
  isFeatured?: boolean
  discount?: number // Percentage discount
  expiryDate?: string // For perishable items
  countryOfOrigin?: string
  brand?: string
  storeId: string
}

export type Location = {
  id: string
  name: string
  address: string
  addressAr?: string
  lat: number
  lng: number
  type?: "home" | "work" | "other"
  isDefault?: boolean
}
// lib/types.ts
export interface OrderItem {
  id: number
  product_id: string
  quantity: number
  price: number
  product_name: string
  product_name_ar: string
  product_thumbnail?: string
}

export interface Order {
  id: number
  customer_id: number
  status: string
  total_amount: number
  created_at: string
  driver_id?: number
  items: OrderItem[]
}
