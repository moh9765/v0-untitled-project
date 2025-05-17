"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Plus,
  Trash2,
  Share2,
  Filter,
  SlidersHorizontal,
  FolderPlus,
  X,
  Check,
  Star,
  Grid,
  List,
  Edit2,
  MoveIcon,
  Moon,
  Sun,
  Pizza,
  Coffee,
  Utensils
} from "lucide-react"
import { useFavorites, FavoriteItem, FavoriteCollection } from "@/hooks/useFavorites"
import { ProductCard } from "@/components/product/product-card"
import { VendorCard } from "@/components/vendor-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { productCategories } from "@/lib/mock-data/products"
import type { Product, ProductCategory } from "@/lib/types/product"
import type { Vendor } from "@/lib/types"
import { PulsingHeartIcon } from "@/components/favorites/pulsing-heart-icon"
import { FavoriteBoard } from "@/components/favorites/favorite-board"
import { CosmicFavoriteBoard } from "@/components/favorites/cosmic-favorite-board"
import { BoardCreationDialog } from "@/components/favorites/board-creation-dialog"
import { DraggableFavoriteItem } from "@/components/favorites/draggable-favorite-item"
import { MoodDrivenBackground, TimeBasedFloatingIcon } from "@/components/ui/mood-driven-background"
import { motion } from "framer-motion"

export default function FavoritesPage() {
  const { t, dir, isRTL } = useLanguage()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const [showAddToCollection, setShowAddToCollection] = useState(false)
  const [showEditCollection, setShowEditCollection] = useState(false)
  const [selectedItem, setSelectedItem] = useState<FavoriteItem | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<FavoriteCollection | null>(null)
  const [newCollection, setNewCollection] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    color: '#FF5722' // Default to deep orange from the design vision
  })
  const [viewMode, setViewMode] = useState<'grid' | 'pinterest'>('pinterest')
  const [theme, setTheme] = useState<'normal' | 'cosmic'>('normal')
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'vendors' | 'categories' | 'collections'>('all')

  const {
    favorites,
    collections,
    activeCollection,
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
  } = useFavorites()

  const isFavoriteProduct = (item: FavoriteItem): item is Product & { type: "product" } =>
    item.type === "product" && "id" in item && "name" in item && "price" in item

  const isFavoriteVendor = (item: FavoriteItem): item is Vendor & { type: "vendor" } =>
    item.type === "vendor" && "id" in item && "name" in item

  const isFavoriteCategory = (item: FavoriteItem): item is ProductCategory & { type: "category" } =>
    item.type === "category" && "id" in item && "name" in item

  // Get filtered items based on active tab and filters
  const items = filteredFavorites()
  const favoriteProducts = activeTab === 'all' || activeTab === 'products'
    ? items.filter(isFavoriteProduct)
    : []
  const favoriteVendors = activeTab === 'all' || activeTab === 'vendors'
    ? items.filter(isFavoriteVendor)
    : []
  const favoriteCategories = activeTab === 'all' || activeTab === 'categories'
    ? items.filter(isFavoriteCategory)
    : []

  // Handle creating a new collection
  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) return

    createCollection(newCollection)

    setNewCollection({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      color: '#FF5722'
    })
    setShowCreateCollection(false)
  }

  // Handle editing a collection
  const handleEditCollection = (collection: FavoriteCollection) => {
    setSelectedCollection(collection)
    setNewCollection({
      name: collection.name,
      nameAr: collection.nameAr || '',
      description: collection.description || '',
      descriptionAr: collection.descriptionAr || '',
      color: collection.color || '#FF5722'
    })
    setShowEditCollection(true)
  }

  // Handle saving edited collection
  const handleSaveCollection = () => {
    if (!selectedCollection || !newCollection.name.trim()) return

    updateCollection({
      ...newCollection,
      id: selectedCollection.id
    })

    setNewCollection({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      color: '#FF5722'
    })
    setSelectedCollection(null)
    setShowEditCollection(false)
  }

  // Handle adding an item to a collection
  const handleAddToCollection = (collectionId: string) => {
    if (!selectedItem) return

    addToCollection(collectionId, selectedItem)
    setSelectedItem(null)
    setShowAddToCollection(false)
  }

  useEffect(() => {
    const authStatus = localStorage.getItem("is_authenticated") === "true"
    const userId = localStorage.getItem("user_id")

    // Log authentication status and user ID for debugging
    console.log("Favorites page - Authentication status:", authStatus)
    console.log("Favorites page - User ID:", userId)

    setIsAuthenticated(authStatus)
    setIsLoading(false)

    if (!authStatus) {
      router.push("/auth/login")
      return
    }

    // Always try to sync with server if authenticated, even if userId seems missing
    // The syncWithServer function will handle the case where userId is missing
    const syncData = async () => {
      try {
        // If user ID is missing or invalid but user is authenticated, try to get it from the session
        if (!userId || userId === "undefined" || userId === "null") {
          console.log("User ID is missing or invalid, attempting to retrieve from session...")
          try {
            const response = await fetch("/api/me")
            const data = await response.json()

            if (data.user && data.user.id) {
              const retrievedUserId = data.user.id
              console.log("Retrieved user ID from session:", retrievedUserId)
              // Update localStorage with the correct user ID
              localStorage.setItem("user_id", retrievedUserId)
            }
          } catch (error) {
            console.error("Error retrieving user ID from session:", error)
          }
        }

        // Sync favorites with server
        await syncWithServer()
      } catch (error) {
        console.error("Error syncing favorites:", error)
      }
    }

    syncData()
  }, [router, syncWithServer])

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">{t("common.loading")}</div>
  }

  if (!isAuthenticated) return null

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'cosmic' ? 'bg-transparent' : 'bg-slate-50 dark:bg-slate-900'} max-w-md mx-auto`} dir={dir}>
      {theme === 'cosmic' && (
        <CosmicBackground>
          {/* Top left */}
          <FloatingIcon
            icon={<Heart className="h-6 w-6 text-white" />}
            color="#ff80ff"
            size={50}
            delay={0}
            position={{ top: '15%', left: '20%' }}
          />

          {/* Top right */}
          <FloatingIcon
            icon={<Pizza className="h-6 w-6 text-white" />}
            color="#ffcc00"
            size={55}
            delay={1.5}
            position={{ top: '20%', right: '25%' }}
          />

          {/* Center */}
          <FloatingIcon
            icon={<Coffee className="h-6 w-6 text-white" />}
            color="#aa80ff"
            size={60}
            delay={3}
            position={{ top: '35%', left: '35%' }}
          />

          {/* Bottom left */}
          <FloatingIcon
            icon={<Utensils className="h-6 w-6 text-white" />}
            color="#ff9980"
            size={52}
            delay={4.5}
            position={{ bottom: '25%', left: '30%' }}
          />

          {/* Bottom right */}
          <FloatingIcon
            icon={<Heart className="h-6 w-6 text-white" />}
            color="#80ffcc"
            size={48}
            delay={6}
            position={{ bottom: '20%', right: '20%' }}
          />
        </CosmicBackground>
      )}
      <header className={`sticky top-0 z-10 ${theme === 'cosmic' ? 'bg-black/30 backdrop-blur-md border-white/10' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'} border-b`}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-bold ml-2">{t("navigation.favorites")}</h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme toggle button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'normal' ? 'cosmic' : 'normal')}
              className={`${theme === 'cosmic' ? 'text-white hover:bg-white/10' : ''} ${theme === 'cosmic' ? '' : showFilters ? "bg-slate-100 dark:bg-slate-800" : ""}`}
            >
              {theme === 'normal' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Filter button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={`${theme === 'cosmic' ? 'text-white hover:bg-white/10' : ''} ${theme === 'cosmic' ? '' : showFilters ? "bg-slate-100 dark:bg-slate-800" : ""}`}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>

            {/* Create collection button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCreateCollection(true)}
              className={theme === 'cosmic' ? 'text-white hover:bg-white/10' : ''}
            >
              <FolderPlus className="h-5 w-5" />
            </Button>

            {/* Share button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => shareFavorites(activeCollection || undefined)}
              className={theme === 'cosmic' ? 'text-white hover:bg-white/10' : ''}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs for filtering by type */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="w-full px-4 pb-2"
        >
          <TabsList className={`grid grid-cols-5 w-full ${theme === 'cosmic' ? 'bg-white/10' : ''}`}>
            <TabsTrigger
              value="all"
              className={theme === 'cosmic' ? 'data-[state=active]:bg-white/20 text-white' : ''}
            >
              {t("favorites.all")}
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className={theme === 'cosmic' ? 'data-[state=active]:bg-white/20 text-white' : ''}
            >
              {t("favorites.products")}
            </TabsTrigger>
            <TabsTrigger
              value="vendors"
              className={theme === 'cosmic' ? 'data-[state=active]:bg-white/20 text-white' : ''}
            >
              {t("favorites.vendors")}
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className={theme === 'cosmic' ? 'data-[state=active]:bg-white/20 text-white' : ''}
            >
              {t("favorites.categories")}
            </TabsTrigger>
            <TabsTrigger
              value="collections"
              className={theme === 'cosmic' ? 'data-[state=active]:bg-white/20 text-white' : ''}
            >
              {t("favorites.collections")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filter panel */}
        {showFilters && (
          <div className={`p-4 border-t space-y-4 ${theme === 'cosmic' ? 'bg-black/30 backdrop-blur-md border-white/10 text-white' : 'border-slate-200 dark:border-slate-800'}`}>
            {/* Category filter */}
            <div>
              <Label className={`text-sm font-medium ${theme === 'cosmic' ? 'text-white' : ''}`}>{t("filters.category")}</Label>
              <Select
                value={filterCategory || ""}
                onValueChange={(value) => setFilterCategory(value || null)}
              >
                <SelectTrigger className={theme === 'cosmic' ? 'bg-white/10 border-white/20 text-white' : ''}>
                  <SelectValue placeholder={t("filters.allCategories")} />
                </SelectTrigger>
                <SelectContent className={theme === 'cosmic' ? 'bg-gray-900 border-white/20 text-white' : ''}>
                  <SelectItem value="">{t("filters.allCategories")}</SelectItem>
                  {productCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {isRTL && category.nameAr ? category.nameAr : category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price range filter */}
            <div>
              <div className="flex justify-between mb-2">
                <Label className={`text-sm font-medium ${theme === 'cosmic' ? 'text-white' : ''}`}>{t("filters.priceRange")}</Label>
                {filterPrice && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 text-xs ${theme === 'cosmic' ? 'text-white hover:bg-white/10' : ''}`}
                    onClick={() => setFilterPrice(null)}
                  >
                    {t("filters.reset")}
                  </Button>
                )}
              </div>
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={filterPrice || [0, 100]}
                onValueChange={(value) => setFilterPrice(value as [number, number])}
                className={`my-4 ${theme === 'cosmic' ? '[&_[role=slider]]:bg-white [&_[role=slider]]:border-white' : ''}`}
              />
              <div className={`flex justify-between text-sm ${theme === 'cosmic' ? 'text-white/70' : 'text-slate-500'}`}>
                <span>${filterPrice ? filterPrice[0] : 0}</span>
                <span>${filterPrice ? filterPrice[1] : 100}</span>
              </div>
            </div>

            {/* Rating filter */}
            <div>
              <div className="flex justify-between mb-2">
                <Label className={`text-sm font-medium ${theme === 'cosmic' ? 'text-white' : ''}`}>{t("filters.minRating")}</Label>
                {filterRating && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 text-xs ${theme === 'cosmic' ? 'text-white hover:bg-white/10' : ''}`}
                    onClick={() => setFilterRating(null)}
                  >
                    {t("filters.reset")}
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <Button
                    key={rating}
                    variant={filterRating === rating ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 rounded-full ${theme === 'cosmic' && filterRating !== rating ? 'border-white/30 text-white' : ''}`}
                    onClick={() => setFilterRating(rating)}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort options */}
            <div>
              <Label className={`text-sm font-medium ${theme === 'cosmic' ? 'text-white' : ''}`}>{t("filters.sortBy")}</Label>
              <Select
                value={sortBy || ""}
                onValueChange={(value) => setSortBy(value || null)}
              >
                <SelectTrigger className={theme === 'cosmic' ? 'bg-white/10 border-white/20 text-white' : ''}>
                  <SelectValue placeholder={t("filters.default")} />
                </SelectTrigger>
                <SelectContent className={theme === 'cosmic' ? 'bg-gray-900 border-white/20 text-white' : ''}>
                  <SelectItem value="">{t("filters.default")}</SelectItem>
                  <SelectItem value="name-asc">{t("filters.nameAsc")}</SelectItem>
                  <SelectItem value="name-desc">{t("filters.nameDesc")}</SelectItem>
                  <SelectItem value="price-asc">{t("filters.priceAsc")}</SelectItem>
                  <SelectItem value="price-desc">{t("filters.priceDesc")}</SelectItem>
                  <SelectItem value="rating-asc">{t("filters.ratingAsc")}</SelectItem>
                  <SelectItem value="rating-desc">{t("filters.ratingDesc")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </header>

      <main className={`flex-1 px-4 py-6 pb-20 ${theme === 'cosmic' ? 'text-white' : ''}`}>
        {/* Collection selector if in collections tab */}
        {activeTab === 'collections' && collections.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t("favorites.myCollections")}</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'pinterest' : 'grid')}
                >
                  {viewMode === 'grid' ?
                    <Grid className="h-4 w-4 mr-2" /> :
                    <List className="h-4 w-4 mr-2" />
                  }
                  {viewMode === 'grid' ? "Pinterest View" : "Grid View"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateCollection(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("favorites.newCollection")}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {collections.map(collection => (
                viewMode === 'pinterest' ? (
                  theme === 'cosmic' ? (
                    <CosmicFavoriteBoard
                      key={collection.id}
                      collection={collection}
                      onEdit={handleEditCollection}
                      onDelete={deleteCollection}
                      onSelect={(id) => setActiveCollection(
                        activeCollection === id ? null : id
                      )}
                      onAddItem={() => {
                        // This would open a dialog to add items to this collection
                        setSelectedCollection(collection);
                        setShowAddToCollection(true);
                      }}
                    />
                  ) : (
                    <FavoriteBoard
                      key={collection.id}
                      collection={collection}
                      onEdit={handleEditCollection}
                      onDelete={deleteCollection}
                      onSelect={(id) => setActiveCollection(
                        activeCollection === id ? null : id
                      )}
                      onAddItem={() => {
                        // This would open a dialog to add items to this collection
                        setSelectedCollection(collection);
                        setShowAddToCollection(true);
                      }}
                    />
                  )
                ) : (
                  <Card
                    key={collection.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      activeCollection === collection.id ? 'border-primary' : ''
                    } ${theme === 'cosmic' ? 'bg-white/10 backdrop-blur-md border-white/20 text-white' : ''}`}
                    onClick={() => setActiveCollection(
                      activeCollection === collection.id ? null : collection.id
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {isRTL && collection.nameAr ? collection.nameAr : collection.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {collection.items.length} {t("favorites.items")}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCollection(collection);
                            }}
                          >
                            <Edit2 className="h-4 w-4 text-slate-400 hover:text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCollection(collection.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          </div>
        )}

        {/* Display products */}
        {favoriteProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {activeTab === 'collections' && activeCollection
                ? t("favorites.collectionProducts")
                : t("favorites.products")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {favoriteProducts.map(product => (
                <DraggableFavoriteItem
                  key={product.id}
                  item={product}
                  collectionId={activeCollection || undefined}
                  onAddToCollection={() => {
                    setSelectedItem(product);
                    setShowAddToCollection(true);
                  }}
                  onRemoveFromCollection={() => {
                    if (activeCollection) {
                      removeFromCollection(activeCollection, product);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Display vendors */}
        {favoriteVendors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {activeTab === 'collections' && activeCollection
                ? t("favorites.collectionVendors")
                : t("favorites.vendors")}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {favoriteVendors.map(vendor => (
                <DraggableFavoriteItem
                  key={vendor.id}
                  item={vendor}
                  collectionId={activeCollection || undefined}
                  onAddToCollection={() => {
                    setSelectedItem(vendor);
                    setShowAddToCollection(true);
                  }}
                  onRemoveFromCollection={() => {
                    if (activeCollection) {
                      removeFromCollection(activeCollection, vendor);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Display categories */}
        {favoriteCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {activeTab === 'collections' && activeCollection
                ? t("favorites.collectionCategories")
                : t("favorites.categories")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {favoriteCategories.map(category => (
                <Card key={category.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <h3 className="font-medium text-center">
                      {isRTL && category.nameAr ? category.nameAr : category.name}
                    </h3>
                    {activeTab === 'collections' && !activeCollection && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setSelectedItem(category);
                          setShowAddToCollection(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {t("favorites.addToCollection")}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <Card className={theme === 'cosmic' ? 'bg-white/10 backdrop-blur-md border-white/20' : ''}>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Heart className={`h-12 w-12 mb-4 ${theme === 'cosmic' ? 'text-white/50' : 'text-slate-300 dark:text-slate-600'}`} />
              <p className={`mb-4 ${theme === 'cosmic' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                {activeTab === 'collections'
                  ? (activeCollection
                      ? t("favorites.emptyCollection")
                      : t("favorites.noCollections"))
                  : t("favorites.empty")}
              </p>
              {activeTab === 'collections' && !activeCollection ? (
                <Button
                  onClick={() => setShowCreateCollection(true)}
                  className={theme === 'cosmic' ? 'bg-white/20 hover:bg-white/30 text-white' : ''}
                >
                  {t("favorites.createCollection")}
                </Button>
              ) : (
                <Button
                  asChild
                  className={theme === 'cosmic' ? 'bg-white/20 hover:bg-white/30 text-white' : ''}
                >
                  <a href="/marketplace">{t("navigation.browse")}</a>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Create collection dialog */}
      <BoardCreationDialog
        isOpen={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
        onSave={handleCreateCollection}
      />

      {/* Edit collection dialog */}
      <BoardCreationDialog
        isOpen={showEditCollection}
        onClose={() => setShowEditCollection(false)}
        onSave={handleSaveCollection}
        collection={selectedCollection || undefined}
      />

      {/* Add to collection dialog */}
      <Dialog open={showAddToCollection} onOpenChange={setShowAddToCollection}>
        <DialogContent className={theme === 'cosmic' ? 'bg-gray-900 border-white/20 text-white' : ''}>
          <DialogHeader>
            <DialogTitle>{t("favorites.addToCollection")}</DialogTitle>
            <DialogDescription className={theme === 'cosmic' ? 'text-white/70' : ''}>
              {t("favorites.selectCollection")}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {collections.length > 0 ? (
              <div className="space-y-2">
                {collections.map(collection => (
                  <div
                    key={collection.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                      theme === 'cosmic'
                        ? 'border-white/20 hover:bg-white/10'
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => handleAddToCollection(collection.id)}
                  >
                    <div>
                      <h3 className="font-medium">
                        {isRTL && collection.nameAr ? collection.nameAr : collection.name}
                      </h3>
                      <p className={`text-sm ${theme === 'cosmic' ? 'text-white/70' : 'text-slate-500'}`}>
                        {collection.items.length} {t("favorites.items")}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={theme === 'cosmic' ? 'text-white hover:bg-white/10' : ''}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className={`mb-4 ${theme === 'cosmic' ? 'text-white/70' : 'text-slate-500'}`}>
                  {t("favorites.noCollections")}
                </p>
                <Button
                  onClick={() => {
                    setShowAddToCollection(false);
                    setShowCreateCollection(true);
                  }}
                  className={theme === 'cosmic' ? 'bg-white/20 hover:bg-white/30 text-white' : ''}
                >
                  {t("favorites.createCollection")}
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant={theme === 'cosmic' ? 'default' : 'outline'}
              onClick={() => setShowAddToCollection(false)}
              className={theme === 'cosmic' ? 'bg-white/20 hover:bg-white/30 text-white' : ''}
            >
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  )
}
