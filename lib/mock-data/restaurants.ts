// Mock restaurant data with real coordinates for different cities
export const restaurants = [
  // New York restaurants
  {
    id: "rest-001",
    name: "Pizza Palace",
    nameAr: "قصر البيتزا",
    description: "Authentic New York style pizza",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    categoryId: "food",
    subcategoryIds: ["pizza", "italian"],
    tags: ["pizza", "italian", "fast food"],
    rating: 4.5,
    ratingCount: 230,
    address: "123 Main St, New York",
    addressAr: "١٢٣ شارع الرئيسي، نيويورك",
    lat: 40.7128,
    lng: -74.006,
    deliveryTime: 25,
    deliveryFee: 2.99,
    minOrder: 10.0,
    isOpen: true,
  },
  {
    id: "rest-002",
    name: "Burger Joint",
    nameAr: "مطعم البرجر",
    description: "Juicy burgers and crispy fries",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    categoryId: "food",
    subcategoryIds: ["burgers"],
    tags: ["burgers", "fast food"],
    rating: 4.2,
    ratingCount: 180,
    address: "456 Elm St, New York",
    addressAr: "٤٥٦ شارع إلم، نيويورك",
    lat: 40.7135,
    lng: -74.0046,
    deliveryTime: 20,
    deliveryFee: 1.99,
    minOrder: 15.0,
    isOpen: true,
  },
  {
    id: "rest-003",
    name: "Sushi World",
    nameAr: "عالم السوشي",
    description: "Fresh and delicious sushi",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    categoryId: "food",
    subcategoryIds: ["sushi"],
    tags: ["sushi", "japanese", "asian"],
    rating: 4.7,
    ratingCount: 320,
    address: "789 Oak St, New York",
    addressAr: "٧٨٩ شارع أوك، نيويورك",
    lat: 40.7142,
    lng: -74.0075,
    deliveryTime: 35,
    deliveryFee: 3.99,
    minOrder: 20.0,
    isOpen: true,
  },

  // San Francisco restaurants
  {
    id: "rest-004",
    name: "Taco Truck",
    nameAr: "شاحنة التاكو",
    description: "Authentic Mexican street food",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    categoryId: "food",
    subcategoryIds: ["mexican"],
    tags: ["tacos", "mexican", "street food"],
    rating: 4.6,
    ratingCount: 150,
    address: "123 Mission St, San Francisco",
    addressAr: "١٢٣ شارع ميشن، سان فرانسيسكو",
    lat: 37.7749,
    lng: -122.4194,
    deliveryTime: 15,
    deliveryFee: 1.5,
    minOrder: 8.0,
    isOpen: true,
  },
  {
    id: "rest-005",
    name: "Noodle House",
    nameAr: "بيت النودلز",
    description: "Hand-pulled noodles and dumplings",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    categoryId: "food",
    subcategoryIds: ["chinese"],
    tags: ["noodles", "chinese", "asian"],
    rating: 4.4,
    ratingCount: 210,
    address: "456 Market St, San Francisco",
    addressAr: "٤٥٦ شارع ماركت، سان فرانسيسكو",
    lat: 37.7755,
    lng: -122.4176,
    deliveryTime: 30,
    deliveryFee: 2.5,
    minOrder: 12.0,
    isOpen: true,
  },

  // London restaurants
  {
    id: "rest-006",
    name: "Fish & Chips",
    nameAr: "سمك وبطاطا",
    description: "Traditional British fish and chips",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    categoryId: "food",
    subcategoryIds: ["british"],
    tags: ["fish", "chips", "british"],
    rating: 4.3,
    ratingCount: 180,
    address: "123 Oxford St, London",
    addressAr: "١٢٣ شارع أكسفورد، لندن",
    lat: 51.5074,
    lng: -0.1278,
    deliveryTime: 20,
    deliveryFee: 2.0,
    minOrder: 10.0,
    isOpen: true,
  },
  {
    id: "rest-007",
    name: "Curry House",
    nameAr: "بيت الكاري",
    description: "Authentic Indian curries",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    categoryId: "food",
    subcategoryIds: ["indian"],
    tags: ["curry", "indian", "spicy"],
    rating: 4.5,
    ratingCount: 250,
    address: "456 Piccadilly, London",
    addressAr: "٤٥٦ بيكاديلي، لندن",
    lat: 51.509,
    lng: -0.13,
    deliveryTime: 35,
    deliveryFee: 3.0,
    minOrder: 15.0,
    isOpen: true,
  },

  // Tokyo restaurants
  {
    id: "rest-008",
    name: "Ramen Shop",
    nameAr: "متجر الرامن",
    description: "Authentic Japanese ramen",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    categoryId: "food",
    subcategoryIds: ["japanese"],
    tags: ["ramen", "japanese", "noodles"],
    rating: 4.8,
    ratingCount: 320,
    address: "123 Shibuya, Tokyo",
    addressAr: "١٢٣ شيبويا، طوكيو",
    lat: 35.6762,
    lng: 139.6503,
    deliveryTime: 25,
    deliveryFee: 2.5,
    minOrder: 12.0,
    isOpen: true,
  },
  {
    id: "rest-009",
    name: "Yakitori Grill",
    nameAr: "شواية ياكيتوري",
    description: "Grilled chicken skewers",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    categoryId: "food",
    subcategoryIds: ["japanese"],
    tags: ["yakitori", "japanese", "grill"],
    rating: 4.6,
    ratingCount: 190,
    address: "456 Shinjuku, Tokyo",
    addressAr: "٤٥٦ شينجوكو، طوكيو",
    lat: 35.6895,
    lng: 139.6917,
    deliveryTime: 20,
    deliveryFee: 2.0,
    minOrder: 10.0,
    isOpen: true,
  },

  // Dubai restaurants
  {
    id: "rest-010",
    name: "Shawarma Palace",
    nameAr: "قصر الشاورما",
    description: "Authentic Middle Eastern shawarma",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    categoryId: "food",
    subcategoryIds: ["middle_eastern"],
    tags: ["shawarma", "middle eastern", "fast food"],
    rating: 4.7,
    ratingCount: 280,
    address: "123 Sheikh Zayed Rd, Dubai",
    addressAr: "١٢٣ شارع الشيخ زايد، دبي",
    lat: 25.2048,
    lng: 55.2708,
    deliveryTime: 15,
    deliveryFee: 1.5,
    minOrder: 8.0,
    isOpen: true,
  },
  {
    id: "rest-011",
    name: "Biryani House",
    nameAr: "بيت البرياني",
    description: "Flavorful Indian biryani",
    logo: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=400",
    categoryId: "food",
    subcategoryIds: ["indian"],
    tags: ["biryani", "indian", "rice"],
    rating: 4.5,
    ratingCount: 220,
    address: "456 Jumeirah Beach Rd, Dubai",
    addressAr: "٤٥٦ شارع جميرا بيتش، دبي",
    lat: 25.2097,
    lng: 55.2719,
    deliveryTime: 30,
    deliveryFee: 2.5,
    minOrder: 12.0,
    isOpen: true,
  },
]

// Export a function to get restaurants by category
export function getRestaurantsByCategory(categoryId: string) {
  return restaurants.filter((restaurant) => restaurant.categoryId === categoryId)
}

// Export a function to get a restaurant by ID
export function getRestaurantById(id: string) {
  return restaurants.find((restaurant) => restaurant.id === id)
}

// Export a function to get restaurants by subcategory
export function getRestaurantsBySubcategory(subcategoryId: string) {
  return restaurants.filter((restaurant) => restaurant.subcategoryIds.includes(subcategoryId))
}

// Export a function to get nearby restaurants
export function getNearbyRestaurants(lat: number, lng: number, maxDistance: number = 10) {
  return restaurants.map(restaurant => {
    const distance = calculateDistance(lat, lng, restaurant.lat, restaurant.lng)
    return {
      ...restaurant,
      distance
    }
  })
  .filter(restaurant => restaurant.distance <= maxDistance)
  .sort((a, b) => a.distance - b.distance)
}

// Calculate distance between two coordinates using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
