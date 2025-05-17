import { Product, ProductCategory, } from "../types/product"


// Define and export productCategories as a value
export const productCategories: ProductCategory[] = [
  {
    id: "food",
    name: "Food & Restaurants",
    nameAr: "الطعام والمطاعم",
    subcategories: [
      {
        id: "restaurants", name: "Restaurants", nameAr: "مطاعم",
        categoryId: "food"
      },
      {
        id: "fast-food", name: "Fast Food", nameAr: "وجبات سريعة",
        categoryId: "food"
      },
      {
        id: "cafe", name: "Cafes", nameAr: "مقاهي",
        categoryId: "food"
      },
    ],
    icon: "🍔"
  },
  {
    id: "fruits-vegetables",
    name: "Fruits & Vegetables",
    nameAr: "الفواكه والخضروات",
    subcategories: [
      {
        id: "fresh-fruits", name: "Fresh Fruits", nameAr: "الفواكه الطازجة",
        categoryId: "fruits-vegetables"
      },
      {
        id: "fresh-vegetables", name: "Fresh Vegetables", nameAr: "الخضروات الطازجة",
        categoryId: "fruits-vegetables"
      },
    ],
    icon: "🍎"
  },
  {
    id: "dairy-eggs",
    name: "Dairy & Eggs",
    nameAr: "منتجات الألبان والبيض",
    subcategories: [
      {
        id: "milk", name: "Milk", nameAr: "الحليب",
        categoryId: "dairy-eggs"
      },
      {
        id: "eggs", name: "Eggs", nameAr: "البيض",
        categoryId: "dairy-eggs"
      },
      {
        id: "vegan-dairy", name: "Vegan Dairy", nameAr: "منتجات ألبان نباتية",
        categoryId: "dairy-eggs"
      },
    ],
    icon: "🥛"
  },
  {
    id: "bakery",
    name: "Bakery",
    nameAr: "المخبوزات",
    subcategories: [
      {
        id: "bread", name: "Bread", nameAr: "الخبز",
        categoryId: "bakery"
      },
    ],
    icon: "🍞"
  },
  {
    id: "meat-seafood",
    name: "Meat & Seafood",
    nameAr: "اللحوم والمأكولات البحرية",
    subcategories: [
      {
        id: "beef", name: "Beef", nameAr: "لحم البقر",
        categoryId: "meat-seafood"
      },
    ],
    icon: "🥩"
  },
]

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Organic Bananas",
    nameAr: "موز عضوي",
    description: "Sweet and fresh organic bananas, perfect for smoothies or a healthy snack.",
    descriptionAr: "موز عضوي حلو وطازج، مثالي للعصائر أو وجبة خفيفة صحية.",
    price: 1.99,
    images: [
      "/images/products/fruits-vegetables/organic-bananas-1.jpg",
      "/images/products/fruits-vegetables/organic-bananas-2.jpg"
    ],
    thumbnail: "/images/products/fruits-vegetables/organic-bananas-thumb.jpg",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-fruits",
    tags: ["organic", "vegan"],
    rating: 4.8,
    ratingCount: 245,
    stock: 150,
    unit: "bunch",
    weight: 1.2,
    nutritionInfo: {
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14,
    },
    ingredients: ["Organic Bananas"],
    isFavorite: false,
    isPopular: true,
    storeId: "s1",
  },
  {
    id: "2",
    name: "Fresh Avocados",
    nameAr: "أفوكادو طازج",
    description: "Creamy and ripe avocados, perfect for guacamole or avocado toast.",
    descriptionAr: "أفوكادو كريمي وناضج، مثالي للجواكامولي أو توست الأفوكادو.",
    price: 2.49,
    originalPrice: 2.99,
    images: [
      "/images/products/fruits-vegetables/fresh-avocados-1.jpg",
      "/images/products/fruits-vegetables/avocado-sliced-1.jpg"
    ],
    thumbnail: "/images/products/fruits-vegetables/avocados-thumb.jpg",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-fruits",
    tags: ["organic", "vegan"],
    rating: 4.6,
    ratingCount: 189,
    stock: 75,
    unit: "piece",
    weight: 0.2,
    nutritionInfo: {
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
      fiber: 7,
    },
    ingredients: ["Organic Avocados"],
    isFavorite: true,
    isPopular: true,
    discount: 17,
    storeId: "s1",
  },
  {
    id: "3",
    name: "Whole Milk",
    nameAr: "حليب كامل الدسم",
    description: "Fresh whole milk from grass-fed cows, rich and creamy.",
    descriptionAr: "حليب طازج كامل الدسم من أبقار تتغذى على العشب، غني وكريمي.",
    price: 3.49,
    images: [
      "/images/products/dairy-eggs/whole-milk-bottle-1.jpg",
      "/images/products/dairy-eggs/milk-pour-1.jpg"
    ],
    thumbnail: "/images/products/dairy-eggs/milk-thumb.jpg",
    categoryId: "dairy-eggs",
    subcategoryId: "milk",
    tags: ["local"],
    rating: 4.7,
    ratingCount: 312,
    stock: 50,
    unit: "gallon",
    nutritionInfo: {
      calories: 150,
      protein: 8,
      carbs: 12,
      fat: 8,
    },
    ingredients: ["Whole Milk"],
    isFavorite: false,
    storeId: "s2",
  },
  {
    id: "4",
    name: "Organic Eggs",
    nameAr: "بيض عضوي",
    description: "Farm-fresh organic eggs from free-range chickens.",
    descriptionAr: "بيض عضوي طازج من المزرعة من دجاج طليق.",
    price: 4.99,
    images: [
      "/images/products/dairy-eggs/organic-eggs-1.jpg",
      "/images/products/dairy-eggs/eggs-carton-1.jpg"
    ],
    thumbnail: "/images/products/dairy-eggs/eggs-thumb.jpg",
    categoryId: "dairy-eggs",
    subcategoryId: "eggs",
    tags: ["organic", "local"],
    rating: 4.9,
    ratingCount: 178,
    stock: 30,
    unit: "dozen",
    nutritionInfo: {
      calories: 70,
      protein: 6,
      carbs: 0,
      fat: 5,
    },
    ingredients: ["Organic Eggs"],
    isFavorite: true,
    isNew: true,
    storeId: "s1",
  },
  {
    id: "5",
    name: "Sourdough Bread",
    nameAr: "خبز العجين المخمر",
    description: "Artisanal sourdough bread, freshly baked with a perfect crust.",
    descriptionAr: "خبز العجين المخمر الحرفي، مخبوز طازجًا بقشرة مثالية.",
    price: 5.99,
    images: [
      "/images/products/bakery/sourdough-bread-1.jpg",
      "/images/products/bakery/bread-sliced-1.jpg"
    ],
    thumbnail: "/images/products/bakery/bread-thumb.jpg",
    categoryId: "bakery",
    subcategoryId: "bread",
    tags: ["vegan", "local"],
    rating: 4.8,
    ratingCount: 156,
    stock: 20,
    unit: "loaf",
    weight: 0.8,
    nutritionInfo: {
      calories: 120,
      protein: 4,
      carbs: 20,
      fat: 1,
      fiber: 2,
    },
    ingredients: ["Organic Flour", "Water", "Salt", "Sourdough Starter"],
    isFavorite: false,
    isPopular: true,
    storeId: "s3",
  },
  {
    id: "6",
    name: "Grass-Fed Ground Beef",
    nameAr: "لحم بقر مفروم من أبقار تتغذى على العشب",
    description: "Premium grass-fed ground beef, perfect for burgers and meatballs.",
    descriptionAr: "لحم بقر مفروم ممتاز من أبقار تتغذى على العشب، مثالي للبرغر وكرات اللحم.",
    price: 8.99,
    images: [
      "/images/products/meat-seafood/ground-beef-1.jpg",
      "/images/products/meat-seafood/beef-packaging-1.jpg"
    ],
    thumbnail: "/images/products/meat-seafood/beef-thumb.jpg",
    categoryId: "meat-seafood",
    subcategoryId: "beef",
    tags: ["local"],
    rating: 4.7,
    ratingCount: 203,
    stock: 25,
    unit: "lb",
    weight: 1,
    nutritionInfo: {
      calories: 250,
      protein: 26,
      carbs: 0,
      fat: 17,
    },
    ingredients: ["100% Grass-Fed Beef"],
    isFavorite: false,
    storeId: "s2",
  },
  {
    id: "7",
    name: "Organic Spinach",
    nameAr: "سبانخ عضوية",
    description: "Fresh organic spinach, washed and ready to eat.",
    descriptionAr: "سبانخ عضوية طازجة، مغسولة وجاهزة للأكل.",
    price: 3.99,
    originalPrice: 4.99,
    images: [
      "/images/products/fruits-vegetables/organic-spinach-1.jpg",
      "/images/products/fruits-vegetables/spinach-bunch-1.jpg"
    ],
    thumbnail: "/images/products/fruits-vegetables/spinach-thumb.jpg",
    categoryId: "fruits-vegetables",
    subcategoryId: "fresh-vegetables",
    tags: ["organic", "vegan"],
    rating: 4.5,
    ratingCount: 132,
    stock: 40,
    unit: "bag",
    weight: 0.3,
    nutritionInfo: {
      calories: 20,
      protein: 2,
      carbs: 3,
      fat: 0,
      fiber: 2,
    },
    ingredients: ["Organic Spinach"],
    isFavorite: true,
    discount: 20,
    storeId: "s1",
  },
  {
    id: "8",
    name: "Almond Milk",
    nameAr: "حليب اللوز",
    description: "Unsweetened almond milk, dairy-free and low in calories.",
    descriptionAr: "حليب اللوز غير المحلى، خالي من منتجات الألبان ومنخفض السعرات الحرارية.",
    price: 3.49,
    images: [
      "/images/products/dairy-eggs/almond-milk-1.jpg",
      "/images/products/dairy-eggs/milk-carton-1.jpg"
    ],
    thumbnail: "/images/products/dairy-eggs/almond-milk-thumb.jpg",
    categoryId: "dairy-eggs",
    subcategoryId: "vegan-dairy",
    tags: ["vegan", "dairy-free"],
    rating: 4.6,
    ratingCount: 178,
    stock: 35,
    unit: "carton",
    nutritionInfo: {
      calories: 30,
      protein: 1,
      carbs: 1,
      fat: 2.5,
    },
    ingredients: ["Filtered Water", "Almonds", "Calcium Carbonate", "Sea Salt"],
    isFavorite: false,
    isNew: true,
    storeId: "s3",
  },
]