import { useEffect, useState, useCallback } from "react"
import type { Product, ProductCategory } from "@/lib/types/product"
import type { Vendor } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

export type FavoriteItem =
  | (Product & { type: "product" })
  | (Vendor & { type: "vendor" })
  | (ProductCategory & { type: "category" })

export type FavoriteCollection = {
  id: string
  name: string
  nameAr?: string
  description?: string
  descriptionAr?: string
  color?: string
  items: FavoriteItem[]
  createdAt: string
  updatedAt: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [collections, setCollections] = useState<FavoriteCollection[]>([])
  const [activeCollection, setActiveCollection] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterPrice, setFilterPrice] = useState<[number, number] | null>(null)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const { toast } = useToast()
  const { isRTL } = useLanguage()

  // Load favorites and collections from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      const saved = localStorage.getItem("favorites")
      if (saved) {
        try {
          setFavorites(JSON.parse(saved))
        } catch {
          setFavorites([])
        }
      }
    }

    const loadCollections = () => {
      const saved = localStorage.getItem("favorite_collections")
      if (saved) {
        try {
          setCollections(JSON.parse(saved))
        } catch {
          setCollections([])
        }
      }
    }

    loadFavorites()
    loadCollections()

    // Check if user is authenticated and try to load from server
    const isAuthenticated = localStorage.getItem("is_authenticated") === "true"
    const userId = localStorage.getItem("user_id")

    console.log("Initial load - Authentication status:", isAuthenticated)
    console.log("Initial load - User ID:", userId)

    // Always try to sync with server if authenticated, even if userId seems missing
    // The syncWithServer function will handle the case where userId is missing
    if (isAuthenticated) {
      // Add a small delay to ensure any auth processes have completed
      setTimeout(() => syncWithServer(), 500)
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  // Save collections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorite_collections", JSON.stringify(collections))
  }, [collections])

  // Sync with server if authenticated
  const syncWithServer = useCallback(async () => {
    const isAuthenticated = localStorage.getItem("is_authenticated") === "true"
    let userId = localStorage.getItem("user_id")

    // Log authentication status and user ID for debugging
    console.log("Authentication status:", isAuthenticated)
    console.log("User ID from localStorage:", userId)

    // If user is authenticated but userId is missing, try to get it from the session
    if (isAuthenticated && (!userId || userId === "undefined" || userId === "null")) {
      console.log("User ID is missing or invalid, attempting to retrieve from session...")
      try {
        const response = await fetch("/api/me")
        const data = await response.json()

        if (data.user && data.user.id) {
          userId = data.user.id
          console.log("Retrieved user ID from session:", userId)
          // Update localStorage with the correct user ID
          localStorage.setItem("user_id", userId)
        }
      } catch (error) {
        console.error("Error retrieving user ID from session:", error)
      }
    }

    if (!isAuthenticated || !userId || userId === "undefined" || userId === "null") {
      console.warn("Cannot sync favorites: User not authenticated or missing user ID")
      return
    }

    setIsLoading(true)

    try {
      // First, try to fetch favorites from server
      console.log("Fetching favorites with userId:", userId)
      const response = await fetch(`/api/favorites?userId=${userId}`)

      if (response.ok) {
        const data = await response.json()

        // If server has favorites, use them
        if (data.favorites && data.favorites.length > 0) {
          setFavorites(data.favorites)
        } else {
          // If server has no favorites but we have local ones, push them to server
          if (favorites.length > 0) {
            await fetch('/api/favorites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, favorites })
            })
          }
        }

        // Same for collections
        if (data.collections && data.collections.length > 0) {
          setCollections(data.collections)
        } else if (collections.length > 0) {
          await fetch('/api/favorites/collections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, collections })
          })
        }
      }
    } catch (error) {
      console.error('Error syncing favorites with server:', error)
    } finally {
      setIsLoading(false)
    }
  }, [favorites, collections])

  // Toggle an item in favorites
  const toggleFavorite = (item: FavoriteItem) => {
    const isAlreadyFavorite = favorites.some(f => f.id === item.id && f.type === item.type)

    setFavorites(prev =>
      isAlreadyFavorite
        ? prev.filter(f => !(f.id === item.id && f.type === item.type))
        : [...prev, item]
    )

    // Show toast notification
    const itemName = getItemName(item)

    toast({
      title: isAlreadyFavorite
        ? (isRTL ? "تمت إزالة العنصر من المفضلة" : "Removed from favorites")
        : (isRTL ? "تمت إضافة العنصر إلى المفضلة" : "Added to favorites"),
      description: isAlreadyFavorite
        ? (isRTL ? `تمت إزالة ${itemName} من المفضلة` : `${itemName} has been removed from your favorites`)
        : (isRTL ? `تمت إضافة ${itemName} إلى المفضلة` : `${itemName} has been added to your favorites`),
      duration: 3000, // Show for 3 seconds
    })

    // Sync with server if authenticated
    const isAuthenticated = localStorage.getItem("is_authenticated") === "true"
    let userId = localStorage.getItem("user_id")

    // Log authentication status and user ID for debugging
    console.log("toggleFavorite - Authentication status:", isAuthenticated)
    console.log("toggleFavorite - User ID:", userId)

    // If user ID is missing or invalid but user is authenticated, don't proceed with API call
    if (isAuthenticated && (!userId || userId === "undefined" || userId === "null")) {
      console.warn("User is authenticated but user ID is missing or invalid. Will try to sync later.")
      // Schedule a sync for later when hopefully the user ID will be available
      setTimeout(() => syncWithServer(), 2000)
      return
    }

    if (isAuthenticated && userId) {
      // Calculate the updated favorites list
      const updatedFavorites = isAlreadyFavorite
        ? favorites.filter(f => !(f.id === item.id && f.type === item.type))
        : [...favorites, item]

      // Send to API
      console.log("Sending favorites to API with userId:", userId)
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          favorites: updatedFavorites
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`)
        }
        return response.json()
      })
      .then(data => {
        console.log("Favorites synced successfully:", data)
      })
      .catch(err => {
        console.error('Error syncing favorites:', err)
        // Try again with syncWithServer which has more robust error handling
        setTimeout(() => syncWithServer(), 3000)
      })
    } else {
      console.warn("Cannot sync favorites: User not authenticated or missing user ID")
    }
  }

  // Helper function to get item name with language support
  const getItemName = (item: FavoriteItem): string => {
    if (item.type === "product" || item.type === "vendor" || item.type === "category") {
      return isRTL && 'nameAr' in item && item.nameAr ? item.nameAr : item.name
    }
    return "Unknown Item"
  }

  // Create a new collection
  const createCollection = (collectionData: Partial<FavoriteCollection>) => {
    const { name, nameAr, description, descriptionAr, color } = collectionData;

    if (!name) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "اسم المجموعة مطلوب" : "Collection name is required",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    }

    const newCollection: FavoriteCollection = {
      id: collectionData.id || Date.now().toString(),
      name,
      nameAr,
      description,
      descriptionAr,
      color: color || "#FF5722", // Default to deep orange from the design vision
      items: collectionData.items || [],
      createdAt: collectionData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setCollections(prev => [...prev, newCollection])

    toast({
      title: isRTL ? "تم إنشاء المجموعة" : "Collection created",
      description: isRTL
        ? `تم إنشاء مجموعة ${nameAr || name} بنجاح`
        : `Collection ${name} has been created successfully`,
      duration: 3000,
    })

    // Sync with server if authenticated
    const isAuthenticated = localStorage.getItem("is_authenticated") === "true"
    const userId = localStorage.getItem("user_id")

    // Log authentication status and user ID for debugging
    console.log("createCollection - Authentication status:", isAuthenticated)
    console.log("createCollection - User ID:", userId)

    if (isAuthenticated && userId) {
      const updatedCollections = [...collections, newCollection]
      fetch('/api/favorites/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          collections: updatedCollections
        })
      }).catch(err => console.error('Error syncing collections:', err))
    } else {
      console.warn("Cannot sync collections: User not authenticated or missing user ID")
    }

    return newCollection.id
  }

  // Update an existing collection
  const updateCollection = (collectionData: Partial<FavoriteCollection>) => {
    if (!collectionData.id) return null;

    const collectionIndex = collections.findIndex(c => c.id === collectionData.id);
    if (collectionIndex === -1) return null;

    const existingCollection = collections[collectionIndex];
    const updatedCollection: FavoriteCollection = {
      ...existingCollection,
      name: collectionData.name || existingCollection.name,
      nameAr: collectionData.nameAr !== undefined ? collectionData.nameAr : existingCollection.nameAr,
      description: collectionData.description !== undefined ? collectionData.description : existingCollection.description,
      descriptionAr: collectionData.descriptionAr !== undefined ? collectionData.descriptionAr : existingCollection.descriptionAr,
      color: collectionData.color || existingCollection.color,
      updatedAt: new Date().toISOString()
    };

    const updatedCollections = [...collections];
    updatedCollections[collectionIndex] = updatedCollection;

    setCollections(updatedCollections);

    toast({
      title: isRTL ? "تم تحديث المجموعة" : "Collection updated",
      description: isRTL
        ? `تم تحديث مجموعة ${updatedCollection.nameAr || updatedCollection.name} بنجاح`
        : `Collection ${updatedCollection.name} has been updated successfully`,
      duration: 3000,
    });

    // Sync with server if authenticated
    const isAuthenticated = localStorage.getItem("is_authenticated") === "true";
    const userId = localStorage.getItem("user_id");

    // Log authentication status and user ID for debugging
    console.log("updateCollection - Authentication status:", isAuthenticated);
    console.log("updateCollection - User ID:", userId);

    if (isAuthenticated && userId) {
      fetch('/api/favorites/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, collections: updatedCollections })
      }).catch(err => console.error('Error syncing collections:', err));
    } else {
      console.warn("Cannot sync collections: User not authenticated or missing user ID");
    }

    return updatedCollection.id;
  };

  // Delete a collection
  const deleteCollection = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId)
    if (!collection) return

    setCollections(prev => prev.filter(c => c.id !== collectionId))

    if (activeCollection === collectionId) {
      setActiveCollection(null)
    }

    toast({
      title: isRTL ? "تم حذف المجموعة" : "Collection deleted",
      description: isRTL
        ? `تم حذف مجموعة ${collection.nameAr || collection.name} بنجاح`
        : `Collection ${collection.name} has been deleted successfully`,
      duration: 3000,
    })

    // Sync with server if authenticated
    const isAuthenticated = localStorage.getItem("is_authenticated") === "true"
    const userId = localStorage.getItem("user_id")

    // Log authentication status and user ID for debugging
    console.log("deleteCollection - Authentication status:", isAuthenticated)
    console.log("deleteCollection - User ID:", userId)

    if (isAuthenticated && userId) {
      const updatedCollections = collections.filter(c => c.id !== collectionId)
      fetch('/api/favorites/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          collections: updatedCollections
        })
      }).catch(err => console.error('Error syncing collections:', err))
    } else {
      console.warn("Cannot sync collections: User not authenticated or missing user ID")
    }
  }

  // Add item to collection
  const addToCollection = (collectionId: string, item: FavoriteItem) => {
    const collectionIndex = collections.findIndex(c => c.id === collectionId)
    if (collectionIndex === -1) return

    const collection = collections[collectionIndex]
    const isAlreadyInCollection = collection.items.some(i => i.id === item.id && i.type === item.type)

    if (isAlreadyInCollection) {
      toast({
        title: isRTL ? "العنصر موجود بالفعل" : "Item already in collection",
        description: isRTL
          ? `${getItemName(item)} موجود بالفعل في المجموعة ${collection.nameAr || collection.name}`
          : `${getItemName(item)} is already in collection ${collection.name}`,
        duration: 3000,
      })
      return
    }

    const updatedCollection = {
      ...collection,
      items: [...collection.items, item],
      updatedAt: new Date().toISOString()
    }

    const updatedCollections = [...collections]
    updatedCollections[collectionIndex] = updatedCollection

    setCollections(updatedCollections)

    toast({
      title: isRTL ? "تمت الإضافة إلى المجموعة" : "Added to collection",
      description: isRTL
        ? `تمت إضافة ${getItemName(item)} إلى مجموعة ${collection.nameAr || collection.name}`
        : `${getItemName(item)} has been added to collection ${collection.name}`,
      duration: 3000,
    })

    // Sync with server if authenticated
    const isAuthenticated = localStorage.getItem("is_authenticated") === "true"
    const userId = localStorage.getItem("user_id")

    // Log authentication status and user ID for debugging
    console.log("addToCollection - Authentication status:", isAuthenticated)
    console.log("addToCollection - User ID:", userId)

    if (isAuthenticated && userId) {
      fetch('/api/favorites/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, collections: updatedCollections })
      }).catch(err => console.error('Error syncing collections:', err))
    } else {
      console.warn("Cannot sync collections: User not authenticated or missing user ID")
    }
  }

  // Remove item from collection
  const removeFromCollection = (collectionId: string, item: FavoriteItem) => {
    const collectionIndex = collections.findIndex(c => c.id === collectionId)
    if (collectionIndex === -1) return

    const collection = collections[collectionIndex]

    const updatedCollection = {
      ...collection,
      items: collection.items.filter(i => !(i.id === item.id && i.type === item.type)),
      updatedAt: new Date().toISOString()
    }

    const updatedCollections = [...collections]
    updatedCollections[collectionIndex] = updatedCollection

    setCollections(updatedCollections)

    toast({
      title: isRTL ? "تمت الإزالة من المجموعة" : "Removed from collection",
      description: isRTL
        ? `تمت إزالة ${getItemName(item)} من مجموعة ${collection.nameAr || collection.name}`
        : `${getItemName(item)} has been removed from collection ${collection.name}`,
      duration: 3000,
    })

    // Sync with server if authenticated
    const isAuthenticated = localStorage.getItem("is_authenticated") === "true"
    const userId = localStorage.getItem("user_id")

    // Log authentication status and user ID for debugging
    console.log("removeFromCollection - Authentication status:", isAuthenticated)
    console.log("removeFromCollection - User ID:", userId)

    if (isAuthenticated && userId) {
      fetch('/api/favorites/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, collections: updatedCollections })
      }).catch(err => console.error('Error syncing collections:', err))
    } else {
      console.warn("Cannot sync collections: User not authenticated or missing user ID")
    }
  }

  // Share favorites or collection
  const shareFavorites = async (collectionId?: string) => {
    try {
      const itemsToShare = collectionId
        ? collections.find(c => c.id === collectionId)?.items || []
        : favorites

      const title = collectionId
        ? `${isRTL ? 'مجموعة المفضلة: ' : 'Favorite Collection: '}${
            collections.find(c => c.id === collectionId)?.name || ''
          }`
        : (isRTL ? 'قائمة المفضلة' : 'My Favorites')

      const text = itemsToShare.map(item => getItemName(item)).join(', ')
      const url = window.location.origin + '/favorites'

      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url
        })

        toast({
          title: isRTL ? "تمت المشاركة بنجاح" : "Shared successfully",
          description: isRTL
            ? "تمت مشاركة المفضلة بنجاح"
            : "Your favorites have been shared successfully",
          duration: 3000,
        })
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(`${title}\n\n${text}\n\n${url}`)

        toast({
          title: isRTL ? "تم النسخ إلى الحافظة" : "Copied to clipboard",
          description: isRTL
            ? "تم نسخ رابط المفضلة إلى الحافظة"
            : "Favorites link has been copied to clipboard",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error sharing favorites:', error)
      toast({
        title: isRTL ? "فشل المشاركة" : "Sharing failed",
        description: isRTL
          ? "حدث خطأ أثناء محاولة مشاركة المفضلة"
          : "An error occurred while trying to share favorites",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // Filter favorites by category - optimized version
  const filteredFavorites = (): FavoriteItem[] => {
    // Get the base items (either from collection or all favorites)
    const baseItems = activeCollection
      ? (collections.find(c => c.id === activeCollection)?.items || [])
      : favorites

    // Apply all filters in a single pass for better performance
    let result = baseItems.filter(item => {
      // Category filter
      if (filterCategory) {
        if (item.type === 'product' || item.type === 'vendor') {
          if (item.categoryId !== filterCategory) return false
        } else {
          return false // If category filter is active, only show products and vendors
        }
      }

      // Price filter for products
      if (filterPrice && filterPrice.length === 2) {
        const [min, max] = filterPrice
        if (item.type === 'product') {
          if (item.price < min || item.price > max) return false
        }
      }

      // Rating filter
      if (filterRating) {
        if (item.type === 'product' || item.type === 'vendor') {
          if (item.rating < filterRating) return false
        }
      }

      // Item passed all filters
      return true
    })

    // Apply sorting
    if (sortBy) {
      result = [...result].sort((a, b) => {
        if (sortBy === 'name-asc') {
          return getItemName(a).localeCompare(getItemName(b))
        }
        if (sortBy === 'name-desc') {
          return getItemName(b).localeCompare(getItemName(a))
        }
        if (sortBy === 'price-asc' && a.type === 'product' && b.type === 'product') {
          return a.price - b.price
        }
        if (sortBy === 'price-desc' && a.type === 'product' && b.type === 'product') {
          return b.price - a.price
        }
        if (sortBy === 'rating-asc' && 'rating' in a && 'rating' in b) {
          return (a.rating || 0) - (b.rating || 0)
        }
        if (sortBy === 'rating-desc' && 'rating' in a && 'rating' in b) {
          return (b.rating || 0) - (a.rating || 0)
        }
        return 0
      })
    }

    return result
  }

  return {
    favorites,
    collections,
    activeCollection,
    isLoading,
    filterCategory,
    filterPrice,
    filterRating,
    sortBy,
    toggleFavorite,
    createCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    setActiveCollection,
    setFilterCategory,
    setFilterPrice,
    setFilterRating,
    setSortBy,
    filteredFavorites,
    shareFavorites,
    syncWithServer
  }
}
