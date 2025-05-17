import type { Category, Subcategory, Vendor, Location } from "./types"

export const categories: Category[] = [
  {
    id: "food",
    nameKey: "categories.food",
    icon: "utensils",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "groceries",
    nameKey: "categories.groceries",
    icon: "shopping-basket",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "pharmacy",
    nameKey: "categories.pharmacy",
    icon: "first-aid",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "parcel",
    nameKey: "categories.parcel",
    icon: "box",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export const subcategories: Subcategory[] = [
  // Food subcategories
  {
    id: "pizza",
    nameKey: "subcategories.food.pizza",
    icon: "pizza",
    categoryId: "food",
  },
  {
    id: "burgers",
    nameKey: "subcategories.food.burgers",
    icon: "burger",
    categoryId: "food",
  },
  {
    id: "sushi",
    nameKey: "subcategories.food.sushi",
    icon: "fish",
    categoryId: "food",
  },
  {
    id: "chinese",
    nameKey: "subcategories.food.chinese",
    icon: "bowl-food",
    categoryId: "food",
  },
  {
    id: "italian",
    nameKey: "subcategories.food.italian",
    icon: "utensils",
    categoryId: "food",
  },
  {
    id: "indian",
    nameKey: "subcategories.food.indian",
    icon: "utensils",
    categoryId: "food",
  },
  // Groceries subcategories
  {
    id: "produce",
    nameKey: "subcategories.groceries.produce",
    icon: "apple",
    categoryId: "groceries",
  },
  {
    id: "dairy",
    nameKey: "subcategories.groceries.dairy",
    icon: "milk",
    categoryId: "groceries",
  },
  {
    id: "snacks",
    nameKey: "subcategories.groceries.snacks",
    icon: "cookie",
    categoryId: "groceries",
  },
  {
    id: "beverages",
    nameKey: "subcategories.groceries.beverages",
    icon: "coffee",
    categoryId: "groceries",
  },
  {
    id: "bakery",
    nameKey: "subcategories.groceries.bakery",
    icon: "bread",
    categoryId: "groceries",
  },
  // Pharmacy subcategories
  {
    id: "prescriptions",
    nameKey: "subcategories.pharmacy.prescriptions",
    icon: "pill",
    categoryId: "pharmacy",
  },
  {
    id: "wellness",
    nameKey: "subcategories.pharmacy.wellness",
    icon: "heart-pulse",
    categoryId: "pharmacy",
  },
  {
    id: "babyCare",
    nameKey: "subcategories.pharmacy.babyCare",
    icon: "baby",
    categoryId: "pharmacy",
  },
  {
    id: "personalCare",
    nameKey: "subcategories.pharmacy.personalCare",
    icon: "shower",
    categoryId: "pharmacy",
  },
  {
    id: "vitamins",
    nameKey: "subcategories.pharmacy.vitamins",
    icon: "pill",
    categoryId: "pharmacy",
  },
]

export const vendors: Vendor[] = [
  // Food vendors
  {
    id: "vendor1",
    name: "Pizza Palace",
    nameAr: "قصر البيتزا",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    rating: 4.5,
    ratingCount: 230,
    address: "123 Main St, New York",
    addressAr: "١٢٣ شارع الرئيسي، نيويورك",
    distance: 1.2,
    deliveryTime: 25,
    deliveryFee: 2.99,
    minOrder: 10,
    isOpen: true,
    isFavorite: false,
    categoryId: "food",
    subcategoryIds: ["pizza", "italian"],
    tags: ["pizza", "italian", "fast food"],
    promotion: {
      type: "discount",
      value: 20,
    },
    lat: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    lng: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    popularity: undefined,
    image: false
  },
  {
    id: "vendor2",
    name: "Burger Joint",
    nameAr: "مطعم البرجر",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    rating: 4.2,
    ratingCount: 180,
    address: "456 Elm St, New York",
    addressAr: "٤٥٦ شارع إلم، نيويورك",
    distance: 0.8,
    deliveryTime: 20,
    deliveryFee: 1.99,
    minOrder: 15,
    isOpen: true,
    isFavorite: true,
    categoryId: "food",
    subcategoryIds: ["burgers"],
    tags: ["burgers", "fast food"],
    promotion: {
      type: "free-delivery",
      value: 0,
    },
    lat: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    lng: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    popularity: undefined,
    image: false
  },
  {
    id: "vendor3",
    name: "Sushi World",
    nameAr: "عالم السوشي",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    rating: 4.7,
    ratingCount: 320,
    address: "789 Oak St, New York",
    addressAr: "٧٨٩ شارع أوك، نيويورك",
    distance: 2.5,
    deliveryTime: 35,
    deliveryFee: 3.99,
    minOrder: 20,
    isOpen: true,
    isFavorite: false,
    categoryId: "food",
    subcategoryIds: ["sushi"],
    tags: ["sushi", "japanese", "asian"],
    lat: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    lng: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    popularity: undefined,
    image: false
  },
  // Grocery vendors
  {
    id: "vendor4",
    name: "Fresh Market",
    nameAr: "السوق الطازج",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    rating: 4.3,
    ratingCount: 150,
    address: "101 Pine St, New York",
    addressAr: "١٠١ شارع باين، نيويورك",
    distance: 1.5,
    deliveryTime: 30,
    deliveryFee: 2.49,
    minOrder: 25,
    isOpen: true,
    isFavorite: false,
    categoryId: "groceries",
    subcategoryIds: ["produce", "dairy", "bakery"],
    tags: ["groceries", "fresh", "organic"],
    lat: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    lng: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    popularity: undefined,
    image: false
  },
  {
    id: "vendor5",
    name: "Quick Mart",
    nameAr: "كويك مارت",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    rating: 3.9,
    ratingCount: 90,
    address: "202 Cedar St, New York",
    addressAr: "202 Cedar St, New York", // ٢٠٢ شارع سيدار، نيويورك
    distance: 0.5,
    deliveryTime: 15,
    deliveryFee: 1.49,
    minOrder: 10,
    isOpen: true,
    isFavorite: true,
    categoryId: "groceries",
    subcategoryIds: ["snacks", "beverages"],
    tags: ["groceries", "convenience", "quick"],
    lat: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    lng: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    popularity: undefined,
    image: false
  },
  // Pharmacy vendors
  {
    id: "vendor6",
    name: "Health Plus",
    nameAr: "هيلث بلس",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    rating: 4.6,
    ratingCount: 210,
    address: "303 Maple St, New York",
    addressAr: "٣٠٣ شارع مابل، نيويورك",
    distance: 1.8,
    deliveryTime: 25,
    deliveryFee: 0,
    minOrder: 15,
    isOpen: true,
    isFavorite: false,
    categoryId: "pharmacy",
    subcategoryIds: ["prescriptions", "wellness", "vitamins"],
    tags: ["pharmacy", "health", "wellness"],
    promotion: {
      type: "free-delivery",
      value: 0,
    },
    lat: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    lng: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    popularity: undefined,
    image: false
  },
  {
    id: "vendor7",
    name: "Family Pharmacy",
    nameAr: "صيدلية العائلة",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    rating: 4.4,
    ratingCount: 180,
    address: "404 Birch St, New York",
    addressAr: "٤٠٤ شارع بيرش، نيويورك",
    distance: 2.2,
    deliveryTime: 30,
    deliveryFee: 2.99,
    minOrder: 20,
    isOpen: false,
    isFavorite: false,
    categoryId: "pharmacy",
    subcategoryIds: ["prescriptions", "babyCare", "personalCare"],
    tags: ["pharmacy", "family", "care"],
    lat: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    lng: function (lat: number, lng: number, lat1: any, lng1: any) {
      throw new Error("Function not implemented.")
    },
    popularity: undefined,
    image: false
  },
]

export const savedLocations: Location[] = [
  {
    id: "home",
    name: "Home",
    address: "123 Home St, New York",
    addressAr: "١٢٣ شارع المنزل، نيويورك",
    lat: 40.7128,
    lng: -74.006,
    type: "home",
    isDefault: true,
  },
  {
    id: "work",
    name: "Work",
    address: "456 Office Ave, New York",
    addressAr: "٤٥٦ شارع المكتب، نيويورك",
    lat: 40.7138,
    lng: -74.013,
    type: "work",
  },
  {
    id: "gym",
    name: "Gym",
    address: "789 Fitness Blvd, New York",
    addressAr: "٧٨٩ شارع اللياقة، نيويورك",
    lat: 40.7118,
    lng: -74.009,
    type: "other",
  },
]
