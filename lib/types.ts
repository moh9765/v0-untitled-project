export type Category = {
  id: string
  nameKey: string
  icon: string
  image: string
}

export type Subcategory = {
  id: string
  nameKey: string
  icon: string
  categoryId: string
}

export type Vendor = {
  id: string
  name: string
  nameAr?: string
  logo: string
  coverImage: string
  rating: number
  ratingCount: number
  address: string
  addressAr?: string
  distance: number
  deliveryTime: number
  deliveryFee: number
  minOrder: number
  isOpen: boolean
  isFavorite: boolean
  categoryId: string
  subcategoryIds: string[]
  tags: string[]
  promotion?: {
    type: "discount" | "free-delivery"
    value: number
  }
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

export type UserLocation = {
  lat: number
  lng: number
  address: string
  addressAr?: string
}

export type LocationPermissionStatus = "granted" | "denied" | "prompt" | "unknown"

export type Order = {
  id: string
  date: string
  status: "Pending" | "In Transit" | "Delivered" | "Cancelled"
  pickupAddress: string
  deliveryAddress: string
  packageDetails: string
  notes?: string
  estimatedDelivery?: string
  driverName?: string
  driverPhone?: string
  customerName: string
  customerPhone: string
  price?: number
  distance?: number
  categoryId?: string
}
