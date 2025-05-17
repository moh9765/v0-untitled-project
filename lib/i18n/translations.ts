// Translation keys for the application
export type TranslationKey =
  | "auth.register"
  | "auth.createCustomerAccount"
  | "auth.createDriverAccount"
  | "auth.fullName"
  | "auth.email"
  | "auth.password"
  | "auth.confirmPassword"
  | "common.loading"
  | "auth.createAccount"
  | "auth.alreadyHaveAccount"
  | "auth.login"
  | "app.name"
  | "app.description"
  | "app.language.english"
  | "app.language.arabic"
  | "app.language.select"
  | "app.language.settings"
  | "auth.login"
  | "auth.register"
  | "auth.forgotPassword"
  | "auth.email"
  | "auth.password"
  | "auth.confirmPassword"
  | "auth.fullName"
  | "driver.deliveries"
  | "driver.transactions"
  | "driver.orderID"
  | "driver.noTransactionHistory"
  | "driver.profile"
  | "driver.wallet"
  | "driver.history"
  | "transaction.status.completed"
  | "transaction.status.pending"
  | "transaction.status.failed"
  | "auth.createAccount"
  | "auth.alreadyHaveAccount"
  | "auth.dontHaveAccount"
  | "auth.resetPassword"
  | "auth.resetPasswordDescription"
  | "auth.sendResetLink"
  | "auth.backToSignIn"
  | "auth.resetLinkSent"
  | "auth.checkEmail"
  | "auth.userType"
  | "auth.userTypeClient"
  | "auth.userTypeDriver"
  | "auth.loginCustomerAccount"
  | "auth.loginDriverAccount"
  | "home.welcome"
  | "home.chooseRole"
  | "home.continueAsCustomer"
  | "home.continueAsDriver"
  | "home.selectLanguage"
  | "home.categories"
  | "home.seeAll"
  | "home.searchPlaceholder"
  | "home.nearbyVendors"
  | "home.popularVendors"
  | "home.recentOrders"
  | "home.promotions"
  | "home.setLocation"
  | "home.currentLocation"
  | "home.savedLocations"
  | "home.locationPermission"
  | "home.locationPermissionDenied"
  | "categories.food"
  | "categories.groceries"
  | "categories.pharmacy"
  | "categories.parcel"
  | "categories.seeAll"
  | "categories.more"
  | "categories.emptyCart"
  | "categories.addGrocery"
  | "categories.addToCart"
  | "categories.remove"
  | "subcategories.food.pizza"
  | "subcategories.food.burgers"
  | "subcategories.food.sushi"
  | "subcategories.food.chinese"
  | "subcategories.food.italian"
  | "subcategories.food.indian"
  | "subcategories.groceries.produce"
  | "subcategories.groceries.dairy"
  | "subcategories.groceries.snacks"
  | "subcategories.groceries.beverages"
  | "subcategories.groceries.bakery"
  | "subcategories.groceries.household"
  | "subcategories.pharmacy.prescriptions"
  | "subcategories.pharmacy.wellness"
  | "subcategories.pharmacy.babyCare"
  | "subcategories.pharmacy.personalCare"
  | "subcategories.pharmacy.vitamins"
  | "subcategories.pharmacy.firstAid"
  | "subcategories.parcel.send"
  | "subcategories.parcel.receive"
  | "subcategories.parcel.track"
  | "vendor.openNow"
  | "vendor.closed"
  | "vendor.rating"
  | "vendor.distance"
  | "vendor.deliveryTime"
  | "vendor.deliveryFee"
  | "vendor.minOrder"
  | "vendor.favorite"
  | "vendor.unfavorite"
  | "vendor.viewMenu"
  | "vendor.viewProducts"
  | "vendor.viewItems"
  | "vendor.results"
  | "search.placeholder"
  | "search.recentSearches"
  | "search.clearAll"
  | "search.noResults"
  | "search.tryAgain"
  | "filters.sortBy"
  | "filters.distance"
  | "filters.rating"
  | "filters.deliveryTime"
  | "filters.price"
  | "filters.priceRange"
  | "filters.dietary"
  | "filters.vegetarian"
  | "filters.vegan"
  | "filters.halal"
  | "filters.glutenFree"
  | "filters.apply"
  | "filters.reset"
  | "navigation.home"
  | "navigation.favorites"
  | "navigation.orders"
  | "navigation.profile"
  | "location.current"
  | "location.searching"
  | "location.notFound"
  | "location.permissionDenied"
  | "location.permissionRequired"
  | "location.enableLocation"
  | "location.searchPlaceholder"
  | "location.recentLocations"
  | "location.savedLocations"
  | "location.addHome"
  | "location.addWork"
  | "location.addNew"
  | "location.kmAway"
  | "dashboard.customer"
  | "dashboard.driver"
  | "dashboard.activeDeliveries"
  | "dashboard.noActiveDeliveries"
  | "dashboard.quickActions"
  | "dashboard.rewards"
  | "dashboard.title"
  | "dashboard.recentOrders"
  | "dashboard.dealTitle"
  | "dashboard.orderHistory"
  | "dashboard.quickReorder"
  | "dashboard.claimOffer"
  | "dashboard.viewDetails"
  | "dashboard.personalizedDeals"
  | "dashboard.reorder"
  | "dashboard.trackOrder"
  | "dashboard.dealDescription"
  | "dashboard.loyaltyPoints"
  | "dashboard.nextReward"
  | "dashboard.activeOrders"
  | "dashboard.completedOrders"
  | "dashboard.track"
  | "dashboard.noActiveOrders"
  | "dashboard.startShopping"
  | "dashboard.noCompletedOrders"
  | "dashboard.openOrders"
  | "dashboard.noOpenOrders"
  | "dashboard.openOrdersDescription"
  | "orders.orderId"
  | "orders.customerDetails"
  | "orders.items"
  | "orders.total"
  | "orders.deliveryAddress"
  | "orders.estimatedDelivery"
  | "orders.statusOpen"
  | "common.details"
  | "common.process"
  | "common.newest"
  | "common.oldest"
  | "delivery.newDelivery"
  | "delivery.trackOrders"
  | "delivery.orderHistory"
  | "delivery.profile"
  | "delivery.createDelivery"
  | "delivery.pickupAddress"
  | "delivery.deliveryAddress"
  | "delivery.packageDetails"
  | "delivery.preferredTime"
  | "delivery.notes"
  | "delivery.submitRequest"
  | "delivery.from"
  | "delivery.to"
  | "delivery.status"
  | "delivery.estimatedDelivery"
  | "delivery.driverInfo"
  | "delivery.customerInfo"
  | "delivery.deliveryDetails"
  | "delivery.navigate"
  | "delivery.updateStatus"
  | "delivery.accept"
  | "delivery.decline"
  | "delivery.distance"
  | "delivery.deliveredOn"
  | "delivery.myDeliveries"
  | "delivery.orderDetails"
  | "delivery.calculating"
  | "delivery.markInTransit"
  | "delivery.markDelivered"
  | "delivery.cancel"
  | "common.backToDashboard"
  | "common.retry"
  | "errors.error"
  | "errors.fetchFailed"
  | "errors.updateFailed"
  | "orders.statusUpdated"
  | "orders.orderStatus"
  | "parcel.title"
  | "parcel.send"
  | "parcel.receive"
  | "parcel.track"
  | "parcel.history"
  | "parcel.createNew"
  | "parcel.pickupDetails"
  | "parcel.deliveryDetails"
  | "parcel.parcelDetails"
  | "parcel.weight"
  | "parcel.dimensions"
  | "parcel.fragile"
  | "parcel.trackingNumber"
  | "parcel.status"
  | "parcel.estimatedDelivery"
  | "support.title"
  | "support.contactUs"
  | "support.email"
  | "support.phone"
  | "support.chat"
  | "support.faq"
  | "support.helpCenter"
  | "faq.title"
  | "faq.deliveryQuestion"
  | "faq.deliveryAnswer"
  | "faq.paymentQuestion"
  | "faq.paymentAnswer"
  | "faq.accountQuestion"
  | "faq.accountAnswer"
  | "faq.refundQuestion"
  | "faq.refundAnswer"
  | "faq.contactQuestion"
  | "faq.contactAnswer"
  | "wallet.title"
  | "wallet.balance"
  | "wallet.addFunds"
  | "wallet.withdraw"
  | "wallet.transactions"
  | "wallet.topUp"
  | "wallet.paymentMethods"
  | "wallet.addCard"
  | "referral.title"
  | "referral.description"
  | "referral.yourCode"
  | "referral.shareCode"
  | "referral.inviteFriends"
  | "referral.reward"
  | "referral.termsAndConditions"
  | "settings.title"
  | "settings.language"
  | "settings.theme"
  | "settings.notifications"
  | "settings.account"
  | "settings.help"
  | "settings.about"
  | "settings.logout"
  | "settings.darkMode"
  | "settings.lightMode"
  | "settings.systemTheme"
  | "common.loading"
  | "common.submit"
  | "common.cancel"
  | "common.save"
  | "common.edit"
  | "common.delete"
  | "common.back"
  | "common.next"
  | "common.done"
  | "common.error"
  | "common.retry"
  | "common.close"
  | "common.search"
  | "common.filter"
  | "common.sort"
  | "common.all"
  | "common.km"
  | "common.min"
  | "common.off"
  | "common.free"
  | "common.viewDetails"
  | "recommendations.error"
  | "recommendations.refresh"
  | "recommendations.noRecommendations"
  | "home.recommendedForYou"
  | "home.dailyDeal"
  | "home.dealDescription"
  | "home.shopNow"
  | "common.showMore"
  | "common.showLess"
  | "recommendations.tryAgain"
  | "Delivered"
  | "registerAs"
  | "name"
  | "email"
  | "password"
  | "confirmPassword"
  | "alreadyHaveAccount"
  | "login"
  | "some.other.key"
  | "another.key"
  | "cart.items"
  | "marketplace.items"
  | "marketplace.allProducts"
  | "marketplace.title"
  | "cart.yourCart"
  | "cart.startShopping"
  | "cart.subtotal"
  | "cart.promoCode"
  | "cart.apply"
  | "cart.checkout"
  | "cart.remove"
  | "cart.empty"
  | "product.organic"
  | "category.nameKey"
  | "product.vegan"
  | "Decrease quantity"
  | "Increase quantity"
  | "Add to Cart"
  | "reviews"
  | "home.goodMorning"
  | "home.goodAfternoon"
  | "home.goodEvening"
  | "home.searchPlaceholder"
  | "home.categories"
  | "home.seeAll"
  | "home.recentOrders"
  | "home.nearbyVendors"
  | "home.popularVendors"
  | "delivery.newDelivery"
  | "app.name"
  | "navigation.inbox"
  | "navigation.favorites"
  | "home.goodMorning"
  | "home.goodAfternoon"
  | "home.goodEvening"
  | "home.searchPlaceholder"
  | "home.dailyDeal"
  | "home.dealDescription"
  | "home.shopNow"
  | "home.categories"
  | "home.seeAll"
  | "home.recentOrders"
  | "home.nearbyVendors"
  | "home.popularVendors"
  | "delivery.newDelivery"
  | "home.smartSuggestion"
  | "navigation.messages"
  | "messages.empty"
  | "common.loading"
  | "search.placeholder"
  | "home.categories"
  | "vendor.results"
  | "search.noResults"
  | "search.tryAgain"
  | "filter.byRating"
  | "filter.byDistance"
  | "filter.byPopularity"
  | "byRating"
  | "byDistance"
  | "byPopularity"
  | "common.loading"
  | "search.placeholder"
  | "filter.byRating"
  | "filter.byDistance"
  | "filter.byPopularity"
  | "home.categories"
  | "vendor.results"
  | "search.noResults"
  | "search.tryAgain"
  | "search.noNearbyRestaurants"
  | "home.nearbyRestaurants"
  | "locationAccess"
  | "geoNotSupported"
  | "error.title"
  | "error.byRating"
  | "error.byDistance"
  | "error.byPopularity"
  | "error.locationAccess"
  | "error.geoNotSupported"
  |"errors.locationAccess"
  | "errors.geoNotSupported"
  | "filter.title"
  |"categories.cart"
  |"dashboard.viewRewards"
  | "rewards.availablePoints"
  | "rewards.totalSpent"
  | "rewards.pointsToNextLevel"
  | "rewards.earned"
  | "rewards.redeemed"
  | "rewards.expired"
  | "rewards.adjusted"
  | "rewards.points"
  | "rewards.freeDelivery"
  | "rewards.freeDeliveryDesc"
  | "rewards.discount10"
  | "rewards.discount10Desc"
  | "rewards.discount25"
  | "rewards.discount25Desc"
  | "rewards.redeem"
  | "rewards.transactionHistory"
  | "rewards.redeemError"
  | "rewards.insufficientPoints"
  | "rewards.redeemErrorMessage"
  | "rewards.levelBenefits"
  | "rewards.levelBenefitsDesc"
  | "rewards.bronzeDesc"
  | "rewards.silverDesc"
  | "rewards.goldDesc"
  | "rewards.platinumDesc"
  | "rewards.current"
  | "rewards.availableRewards"
  | "rewards.redeemSuccess"
| "rewards.redeemSuccessMessage"
| "rewards.title"
| "rewards.redeemError"
| "rewards.insufficientPoints"
| "rewards.redeemErrorMessage"
| "rewards.levelBenefits"
| "rewards.levelBenefitsDesc"
| "rewards.bronzeDesc"
| "rewards.silverDesc"
| "rewards.goldDesc"
| "rewards.platinumDesc"
| "rewards.current"
| "rewards.availableRewards"
| "rewards.level"
| "rewards.maxLevelReached"
| "dashboard.earnMore"
|"navigation.checkout"
|"errors.fetchFailed"
|"errors.failedProducts"
|"common.Retry"
|"common.refresh"
|"loading.message"
|"errors.noProducts"
| "favorites.products"
|  "favorites.vendors"
|  "favorites.empty"
|  "navigation.browse"
|  "favorites.all"
|  "favorites.categories"
|  "favorites.collections"
|  "favorites.myCollections"
|  "favorites.newCollection"
|  "favorites.items"
|  "favorites.collectionProducts"
|  "favorites.collectionVendors"
|  "favorites.collectionCategories"
|  "favorites.addToCollection"
|  "favorites.emptyCollection"
|  "favorites.noCollections"
|  "favorites.createCollection"
|  "favorites.createCollectionDesc"
|  "favorites.collectionName"
|  "favorites.collectionNamePlaceholder"
|  "favorites.collectionNameAr"
|  "favorites.collectionNameArPlaceholder"
|  "favorites.collectionDesc"
|  "favorites.collectionDescPlaceholder"
|  "favorites.collectionDescAr"
|  "favorites.collectionDescArPlaceholder"
|  "favorites.selectCollection"
|  "filters.category"
|  "filters.allCategories"
|  "filters.minRating"
|  "filters.default"
|  "filters.nameAsc"
|  "filters.nameDesc"
|  "filters.priceAsc"
|  "filters.priceDesc"
|  "filters.ratingAsc"
|  "filters.ratingDesc"
|  "common.create"
|  "filters.title"
|  "filters.tags"
|  "filters.additional"
|  "filters.inStock"
|  "filters.onSale"
|  "filters.clearAll"
|  "product.glutenFree"
|  "product.dairyFree"
|  "product.local"
|  "product.imported"
|  "filters.price-asc"
|  "filters.price-desc"
|  "filters.rating-desc"
|  "filters.name-asc"
|  "driver.deliveries"
|  "driver.transactions"
|  "driver.orderID"
|  "driver.noTransactionHistory"
|  "driver.profile"
|  "driver.wallet"
|  "driver.history"
|  "transaction.status.completed"
|  "transaction.status.pending"
|  "transaction.status.failed"
|  "common.greeting"
|  "common.viewDetails"
| "driver.historyAndTransactions"
|"delivery.noCompletedDeliveries"
|"delivery.completed"
|"delivery.customer"
|"delivery.earnings"

  ;

// English translations
export const enTranslations: Record<TranslationKey, string> = {
  "app.name": "Deliverzler",
  "some.other.key": "some.other",
  "product.vegan": "Vegan",
  "categories.more": "More",
  "categories.emptyCart": "Your cart is empty.",
  "categories.addGrocery": "Add a grocery item",
  "categories.addToCart": "Add to Cart",
  "categories.remove": "Remove",
  "another.key": "another",
  "cart.items": "items",
  "Decrease quantity": "Decrease quantity",
  "Increase quantity": "Increase quantity",
  "Add to Cart": "Add to Cart",
  "reviews": "reviews",
  "cart.yourCart": "Your Cart",
  "cart.startShopping": "Start Shopping",
  "cart.subtotal": "Subtotal",
  "cart.promoCode": "Promo Code",
  "cart.apply": "Apply",
  "cart.checkout": "Checkout",
  "cart.remove": "Remove",
  "product.organic": "Organic",
  "cart.empty": "Your cart is empty",
  "app.description": "Multi-service delivery platform",
  "auth.createCustomerAccount": "Create Customer Account",
  "auth.createDriverAccount": "Create Driver Account",
  "app.language.english": "English",
  "app.language.arabic": "العربية",
  "app.language.select": "Select Language",
  "app.language.settings": "Language Settings",
  "auth.login": "Sign in",
  "auth.register": "Sign up",
  "auth.forgotPassword": "Forgot password?",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.confirmPassword": "Confirm Password",
  "auth.fullName": "Full Name",
  "auth.createAccount": "Create account",
  "auth.alreadyHaveAccount": "Already have an account?",
  "auth.dontHaveAccount": "Don't have an account?",
  "auth.resetPassword": "Reset password",
  "auth.resetPasswordDescription": "Enter your email address and we'll send you a link to reset your password",
  "auth.sendResetLink": "Send reset link",
  "auth.backToSignIn": "Back to sign in",
  "auth.resetLinkSent": "Reset link sent",
  "auth.checkEmail": "Check your email for a link to reset your password",
  "auth.userType": "User Type",
  "auth.userTypeClient": "Client",
  "auth.userTypeDriver": "Driver",
  "home.welcome": "Welcome to Deliverzler",
  "home.chooseRole": "Choose how you want to use the app",
  "home.continueAsCustomer": "Continue as Customer",
  "home.continueAsDriver": "Continue as Driver",
  "home.selectLanguage": "Select Language",
  "home.categories": "Categories",
  "home.seeAll": "See All",
  "home.searchPlaceholder": "Search for restaurants, groceries, etc.",
  "home.nearbyVendors": "Nearby Vendors",
  "home.popularVendors": "Popular Vendors",
  "home.recentOrders": "Recent Orders",
  "home.promotions": "Promotions",
  "home.setLocation": "Set Location",
  "home.currentLocation": "Current Location",
  "home.savedLocations": "Saved Locations",
  "home.locationPermission": "Location Permission",
  "home.locationPermissionDenied": "Location permission denied. Please enable location services to see nearby vendors.",
  "categories.food": "Food",
  "categories.groceries": "Groceries",
  "categories.pharmacy": "Pharmacy",
  "categories.parcel": "Parcel",
  "categories.seeAll": "See All Categories",
  "subcategories.food.pizza": "Pizza",
  "subcategories.food.burgers": "Burgers",
  "subcategories.food.sushi": "Sushi",
  "subcategories.food.chinese": "Chinese",
  "subcategories.food.italian": "Italian",
  "subcategories.food.indian": "Indian",
  "subcategories.groceries.produce": "Fresh Produce",
  "subcategories.groceries.dairy": "Dairy",
  "subcategories.groceries.snacks": "Snacks",
  "subcategories.groceries.beverages": "Beverages",
  "subcategories.groceries.bakery": "Bakery",
  "subcategories.groceries.household": "Household",
  "subcategories.pharmacy.prescriptions": "Prescriptions",
  "subcategories.pharmacy.wellness": "Wellness",
  "subcategories.pharmacy.babyCare": "Baby Care",
  "subcategories.pharmacy.personalCare": "Personal Care",
  "subcategories.pharmacy.vitamins": "Vitamins",
  "subcategories.pharmacy.firstAid": "First Aid",
  "subcategories.parcel.send": "Send Parcel",
  "subcategories.parcel.receive": "Receive Parcel",
  "subcategories.parcel.track": "Track Parcel",
  "vendor.openNow": "Open Now",
  "vendor.closed": "Closed",
  "vendor.rating": "Rating",
  "vendor.distance": "Distance",
  "vendor.deliveryTime": "Delivery Time",
  "vendor.deliveryFee": "Delivery Fee",
  "vendor.minOrder": "Min. Order",
  "vendor.favorite": "Add to Favorites",
  "vendor.unfavorite": "Remove from Favorites",
  "vendor.viewMenu": "View Menu",
  "vendor.viewProducts": "View Products",
  "vendor.viewItems": "View Items",
  "vendor.results": "results",
  "search.placeholder": "Search...",
  "search.recentSearches": "Recent Searches",
  "search.clearAll": "Clear All",
  "search.noResults": "No results found",
  "search.tryAgain": "Try different keywords",
  "filters.sortBy": "Sort By",
  "filters.distance": "Distance",
  "filters.rating": "Rating",
  "filters.deliveryTime": "Delivery Time",
  "filters.price": "Price",
  "filters.priceRange": "Price Range",
  "filters.dietary": "Dietary Preferences",
  "filters.vegetarian": "Vegetarian",
  "filters.vegan": "Vegan",
  "filters.halal": "Halal",
  "filters.glutenFree": "Gluten Free",
  "filters.reset": "Reset",
  "navigation.home": "Home",
  "navigation.favorites": "Favorites",
  "navigation.orders": "Orders",
  "navigation.profile": "Profile",
  "location.current": "Current Location",
  "location.searching": "Searching for your location...",
  "location.notFound": "Location not found",
  "location.permissionDenied": "Location permission denied",
  "location.permissionRequired": "Location permission required",
  "location.enableLocation": "Enable location",
  "location.searchPlaceholder": "Search for an address",
  "location.recentLocations": "Recent Locations",
  "location.savedLocations": "Saved Locations",
  "location.addHome": "Add Home",
  "location.addWork": "Add Work",
  "location.addNew": "Add New Location",
  "location.kmAway": "km away",
  "dashboard.customer": "Dashboard",
  "dashboard.driver": "Driver Dashboard",
  "dashboard.activeDeliveries": "Active Deliveries",
  "dashboard.noActiveDeliveries": "You don't have any active deliveries",
  "dashboard.quickActions": "Quick Actions",
  "dashboard.loyaltyPoints": "Loyalty Points",
  "dashboard.nextReward": "Next Reward",
  "dashboard.orderHistory": "Order History",
  "dashboard.trackOrder": "Track Order",
  "dashboard.rewards": "Rewards",
  "dashboard.reorder": "Reorder",
  "dashboard.dealTitle": "Deal Title",
  "dashboard.dealDescription": "Description of the deal",
  "dashboard.claimOffer": "Claim Offer",
  "dashboard.quickReorder": "Quick Reorder",
  "dashboard.personalizedDeals": "Personalized Deals",
  "dashboard.activeOrders": "Active Orders",
  "dashboard.completedOrders": "Completed Orders",
  "dashboard.track": "Track",
  "dashboard.noActiveOrders": "You have no active orders.",
  "dashboard.startShopping": "Start Shopping",
  "dashboard.noCompletedOrders": "You have no completed orders.",
  "dashboard.openOrders": "Open Orders",
  "dashboard.noOpenOrders": "No open orders",
  "dashboard.openOrdersDescription": "Open orders will appear here when customers place new orders.",
  "orders.orderId": "Order ID",
  "orders.customerDetails": "Customer Details",
  "orders.items": "Items",
  "orders.total": "Total",
  "orders.deliveryAddress": "Delivery Address",
  "orders.estimatedDelivery": "Estimated Delivery",
  "orders.statusOpen": "Open",
  "common.details": "Details",
  "common.process": "Process",
  "common.newest": "Newest",
  "common.oldest": "Oldest",
  "delivery.newDelivery": "New Delivery",
  "delivery.trackOrders": "Track Orders",
  "delivery.orderHistory": "Order History",
  "delivery.profile": "Profile",
  "delivery.createDelivery": "Create a delivery",
  "delivery.pickupAddress": "Pickup Address",
  "delivery.deliveryAddress": "Delivery Address",
  "delivery.packageDetails": "Package Details",
  "delivery.preferredTime": "Preferred Delivery Time",
  "delivery.notes": "Additional Notes",
  "delivery.submitRequest": "Submit Delivery Request",
  "delivery.from": "From",
  "delivery.to": "To",
  "delivery.status": "Delivery Status",
  "delivery.estimatedDelivery": "Estimated delivery",
  "delivery.driverInfo": "Driver Information",
  "delivery.customerInfo": "Customer",
  "delivery.deliveryDetails": "Delivery Details",
  "delivery.navigate": "Navigate",
  "delivery.updateStatus": "Update Status",
  "delivery.accept": "Accept",
  "delivery.decline": "Decline",
  "delivery.distance": "Distance",
  "delivery.deliveredOn": "Delivered On",
  "delivery.myDeliveries": "My Deliveries",
  "delivery.orderDetails": "Order Details",
  "delivery.calculating": "Calculating...",
  "delivery.markInTransit": "Mark In Transit",
  "delivery.markDelivered": "Mark Delivered",
  "delivery.cancel": "Cancel Delivery",
  "common.backToDashboard": "Back to Dashboard",
  "common.retry": "Retry",
  "errors.error": "Error",
  "errors.fetchFailed": "Failed to fetch data",
  "errors.updateFailed": "Failed to update",
  "orders.statusUpdated": "Status Updated",
  "orders.orderStatus": "Order Status",
  "parcel.title": "Parcel Delivery",
  "parcel.send": "Send Parcel",
  "parcel.receive": "Receive Parcel",
  "parcel.track": "Track Parcel",
  "parcel.history": "Parcel History",
  "parcel.createNew": "Create New Parcel",
  "parcel.pickupDetails": "Pickup Details",
  "parcel.deliveryDetails": "Delivery Details",
  "parcel.parcelDetails": "Parcel Details",
  "parcel.weight": "Weight",
  "parcel.dimensions": "Dimensions",
  "parcel.fragile": "Fragile",
  "parcel.trackingNumber": "Tracking Number",
  "parcel.status": "Status",
  "parcel.estimatedDelivery": "Estimated Delivery",
  "support.title": "Support",
  "support.contactUs": "Contact Us",
  "support.email": "Email",
  "support.phone": "Phone",
  "support.chat": "Live Chat",
  "support.faq": "FAQ",
  "support.helpCenter": "Help Center",
  "faq.title": "Frequently Asked Questions",
  "faq.deliveryQuestion": "How long does delivery take?",
  "faq.deliveryAnswer": "Delivery times vary based on your location and the vendor. The estimated delivery time is shown before you place your order.",
  "faq.paymentQuestion": "What payment methods are accepted?",
  "faq.paymentAnswer": "We accept credit/debit cards, mobile wallets, and cash on delivery in most locations.",
  "faq.accountQuestion": "How do I create an account?",
  "faq.accountAnswer": "You can create an account by clicking the Sign Up button and following the registration process.",
  "faq.refundQuestion": "What is the refund policy?",
  "faq.refundAnswer": "Refunds are processed within 5-7 business days. Please contact support for specific refund requests.",
  "faq.contactQuestion": "How can I contact customer support?",
  "faq.contactAnswer": "You can reach our customer support team via email, phone, or live chat in the Support section.",
  "wallet.title": "My Wallet",
  "wallet.balance": "Balance",
  "wallet.addFunds": "Add Funds",
  "wallet.withdraw": "Withdraw",
  "wallet.transactions": "Transactions",
  "wallet.topUp": "Top Up",
  "wallet.paymentMethods": "Payment Methods",
  "wallet.addCard": "Add Card",
  "referral.title": "Refer a Friend",
  "referral.description": "Invite your friends to Deliverzler and earn rewards!",
  "referral.yourCode": "Your Referral Code",
  "referral.shareCode": "Share Code",
  "referral.inviteFriends": "Invite Friends",
  "referral.reward": "Earn $5 for each friend who signs up and places their first order",
  "referral.termsAndConditions": "Terms & Conditions",
  "settings.title": "Settings",
  "settings.language": "Language",
  "settings.theme": "Theme",
  "settings.notifications": "Notifications",
  "settings.account": "Account",
  "settings.help": "Help & Support",
  "settings.about": "About",
  "settings.logout": "Logout",
  "settings.darkMode": "Dark Mode",
  "settings.lightMode": "Light Mode",
  "settings.systemTheme": "System Theme",
  "common.loading": "Loading...",
  "common.submit": "Submit",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.edit": "Edit",
  "common.delete": "Delete",
  "common.back": "Back",
  "common.next": "Next",
  "common.done": "Done",
  "common.error": "Error",
  "common.close": "Close",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.sort": "Sort",
  "common.all": "All",
  "common.km": "km",
  "common.min": "min",
  "common.off": "off",
  "common.free": "Free",
  "common.greeting": "Hello",
  "common.viewDetails": "View Details",
  "recommendations.error": "Unable to load recommendations at this time",
  "recommendations.refresh": "Refresh",
  "recommendations.noRecommendations": "No recommendations available yet",
  "home.recommendedForYou": "Recommended for You",
  "home.dailyDeal": "Daily Deal #{number}",
  "home.dealDescription": "Special offers just for you",
  "home.shopNow": "Shop Now",
  "common.showMore": "Show More",
  "common.showLess": "Show Less",
  "recommendations.tryAgain": "Try Again",
  "registerAs": "Register as",
  "name": "Name",
  "email": "Email",
  "password": "Password",
  "confirmPassword": "Confirm Password",
  "alreadyHaveAccount": "Already have an account?",
  "login": "Login",
  "dashboard.viewDetails": "View Details",
  "dashboard.recentOrders": "Recent Orders",
  "dashboard.title": "Dashboard",
  "auth.loginCustomerAccount": "login Customer Account",
  "auth.loginDriverAccount": "login Driver Account",
  "Delivered": "Delivered",
  "marketplace.items": "items",
  "marketplace.allProducts": "All Products",
  "marketplace.title": "Marketplace",
  "category.nameKey": "category name",
  "home.goodMorning": "Good Morning",
  "home.goodAfternoon": "Good Afternoon",
  "home.goodEvening": "Good Evening",
  "navigation.inbox": "Inbox",
  "home.smartSuggestion": "Smart Suggestions",
  "navigation.messages": "Messages",
  "messages.empty": "Your messages will appear here",
  "filter.byRating": "Sort by Rating",
  "filter.byDistance": "Sort by Distance",
  "filter.byPopularity": "Sort by Popularity",
  "filter.title": "Filter Options",
  "search.noNearbyRestaurants": "No nearby restaurants found",
  "home.nearbyRestaurants": "Nearby Restaurants",
  "geoNotSupported": "Geolocation not supported",
  "error.title": "Filter options",
  "error.byRating": "Top Rated",
  "error.byDistance": "Nearest",
  "error.byPopularity": "Most Popular",
  "error.locationAccess": "Location Access",
  "byRating": "",
  "byDistance": "",
  "byPopularity": "",
  "locationAccess": "",
  "error.geoNotSupported": "",
  "errors.locationAccess": "Location access is required to show nearby vendors",
  "errors.geoNotSupported": "Geolocation is not supported by this browser",
  "categories.cart": "Cart",
  "dashboard.viewRewards": "View Rewards",
  "rewards.availablePoints": "Available Points",
  "rewards.totalSpent": "Total Spent",
  "rewards.pointsToNextLevel": "Points to Next Level",
  "rewards.earned": "Points Earned",
  "rewards.redeemed": "Points Redeemed",
  "rewards.expired": "Points Expired",
  "rewards.adjusted": "Points Adjusted",
  "rewards.points": "Points",
  "rewards.freeDelivery": "Free Delivery",
  "rewards.freeDeliveryDesc": "Enjoy free delivery on your next order.",
  "rewards.discount10": "10% Discount",
  "rewards.discount10Desc": "Get 10% off your next purchase.",
  "rewards.discount25": "25% Discount",
  "rewards.discount25Desc": "Save 25% on your next order.",
  "rewards.redeem": "Redeem",
  "rewards.transactionHistory": "Transaction History",
  "rewards.redeemError": "Redeem Error",
  "rewards.insufficientPoints": "You do not have enough points to redeem this reward.",
  "rewards.redeemErrorMessage": "An error occurred while redeeming the reward.",
  "rewards.levelBenefits": "Level Benefits",
  "rewards.levelBenefitsDesc": "Benefits for each reward level.",
  "rewards.bronzeDesc": "Basic benefits for Bronze level.",
  "rewards.silverDesc": "Enhanced benefits for Silver level.",
  "rewards.goldDesc": "Premium benefits for Gold level.",
  "rewards.platinumDesc": "Exclusive benefits for Platinum level.",
  "rewards.current": "Current Level",
  "rewards.availableRewards": "Available Rewards",
  "rewards.redeemSuccess": "Reward Redeemed Successfully",
  "rewards.redeemSuccessMessage": "You have successfully redeemed {title}.",
  "rewards.title": "Rewards",
  "rewards.level": "Level",
  "rewards.maxLevelReached": "You've reached the maximum level!",
  "dashboard.earnMore": "Earn More Points",
  "navigation.checkout": "Checkout",
  "errors.failedProducts": "Failed to load products",
  "common.Retry": "Retry",
  "common.refresh": "Refresh",
  "loading.message": "Loading...",
  "errors.noProducts": "No products available",
   "favorites.products" : "Products",
  "favorites.vendors" : "Vendors",
  "favorites.empty" : "No favorites yet",
  "navigation.browse": "Browse",
  "favorites.all": "All",
  "favorites.categories": "Categories",
  "favorites.collections": "Collections",
  "favorites.myCollections": "My Collections",
  "favorites.newCollection": "New Collection",
  "favorites.items": "items",
  "favorites.collectionProducts": "Products in Collection",
  "favorites.collectionVendors": "Vendors in Collection",
  "favorites.collectionCategories": "Categories in Collection",
  "favorites.addToCollection": "Add to Collection",
  "favorites.emptyCollection": "This collection is empty",
  "favorites.noCollections": "You don't have any collections yet",
  "favorites.createCollection": "Create Collection",
  "favorites.createCollectionDesc": "Create a new collection to organize your favorite items",
  "favorites.collectionName": "Collection Name",
  "favorites.collectionNamePlaceholder": "Enter collection name",
  "favorites.collectionNameAr": "Collection Name (Arabic)",
  "favorites.collectionNameArPlaceholder": "أدخل اسم المجموعة",
  "favorites.collectionDesc": "Description",
  "favorites.collectionDescPlaceholder": "Enter collection description",
  "favorites.collectionDescAr": "Description (Arabic)",
  "favorites.collectionDescArPlaceholder": "أدخل وصف المجموعة",
  "favorites.selectCollection": "Select a collection to add this item to",
  "filters.category": "Category",
  "filters.allCategories": "All Categories",
  "filters.minRating": "Minimum Rating",
  "filters.default": "Default",
  "filters.nameAsc": "Name (A-Z)",
  "filters.nameDesc": "Name (Z-A)",
  "filters.priceAsc": "Price (Low to High)",
  "filters.priceDesc": "Price (High to Low)",
  "filters.ratingAsc": "Rating (Low to High)",
  "filters.ratingDesc": "Rating (High to Low)",
  "common.create": "Create",
  "filters.title": "Filters",
  "filters.tags": "Product Tags",
  "filters.additional": "Additional Filters",
  "filters.inStock": "In Stock",
  "filters.onSale": "On Sale",
  "filters.clearAll": "Clear All",
  "filters.apply": "Apply Filters",
  "product.glutenFree": "Gluten Free",
  "product.dairyFree": "Dairy Free",
  "product.local": "Local",
  "product.imported": "Imported",
  "filters.price-asc": "Price (Low to High)",
  "filters.price-desc": "Price (High to Low)",
  "filters.rating-desc": "Rating (High to Low)",
  "filters.name-asc": "Name (A-Z)",
  "driver.deliveries": "Deliveries",
  "driver.transactions": "Transactions",
  "driver.orderID": "Order ID",
  "driver.noTransactionHistory": "No transaction history available",
  "driver.profile": "Profile",
  "driver.wallet": "Wallet",
  "driver.history": "History",
  "transaction.status.completed": "Completed",
  "transaction.status.pending": "Pending",
  "transaction.status.failed": "Failed",
  "driver.historyAndTransactions": "History & Transactions",
"delivery.noCompletedDeliveries" : "No completed deliveries yet",
"delivery.completed" : "Completed",
"delivery.customer" : "Customer",
"delivery.earnings" : "Earnings"
}

// Arabic translations
export const arTranslations: Record<TranslationKey, string> = {
  "dashboard.title": "لوحة التحكم",
  "some.other.key": "بعض المفاتيح الأخرى",
  "another.key": "مفتاح آخر",
  "cart.items": "عناصر",
  "marketplace.items": "عناصر السوق",
  "marketplace.allProducts": "جميع المنتجات",
  "marketplace.title": "السوق",
  "dashboard.recentOrders": "الطلبات الأخيرة",
  "dashboard.viewDetails": "عرض التفاصيل",
  "registerAs": "سجل كـ",
  "name": "الاسم",
  "Decrease quantity": "تقليل الكمية",
  "Increase quantity": "زيادة الكمية",
  "Add to Cart": "أضف إلى السلة",
  "reviews": "المراجعات",
  "email": "البريد الإلكتروني",
  "password": "كلمة المرور",
  "product.vegan": "نباتي",
  "confirmPassword": "تأكيد كلمة المرور",
  "alreadyHaveAccount": "لديك حساب بالفعل؟",
  "login": "تسجيل الدخول",
  "app.name": "ديليفرزلر",
  "product.organic": "عضوي",
  "categories.emptyCart": "عربة التسوق فارغة.",
  "categories.addGrocery": "أضف عنصرًا إلى البقالة",
  "categories.addToCart": "أضف إلى السلة",
  "categories.remove": "إزالة",
  "app.description": "منصة توصيل متعددة الخدمات",
  "auth.createCustomerAccount": "إنشاء حساب عميل",
  "auth.createDriverAccount": "إنشاء حساب سائق",
  "app.language.english": "English",
  "app.language.arabic": "العربية",
  "app.language.select": "اختر اللغة",
  "app.language.settings": "إعدادات اللغة",
  "auth.login": "تسجيل الدخول",
  "auth.register": "إنشاء حساب",
  "auth.forgotPassword": "نسيت كلمة المرور؟",
  "auth.email": "البريد الإلكتروني",
  "auth.password": "كلمة المرور",
  "auth.confirmPassword": "تأكيد كلمة المرور",
  "auth.fullName": "الاسم الكامل",
  "auth.createAccount": "إنشاء حساب",
  "auth.alreadyHaveAccount": "لديك حساب بالفعل؟",
  "auth.dontHaveAccount": "ليس لديك حساب؟",
  "auth.resetPassword": "إعادة تعيين كلمة المرور",
  "auth.resetPasswordDescription": "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور",
  "auth.sendResetLink": "إرسال رابط إعادة التعيين",
  "auth.backToSignIn": "العودة إلى تسجيل الدخول",
  "auth.resetLinkSent": "تم إرسال رابط إعادة التعيين",
  "auth.checkEmail": "تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور",
  "auth.userType": "نوع المستخدم",
  "auth.userTypeClient": "عميل",
  "auth.userTypeDriver": "سائق",
  "auth.loginCustomerAccount": "تسجيل دخول حساب العميل",
  "auth.loginDriverAccount": "تسجيل دخول حساب السائق",
  "home.welcome": "مرحبًا بك في ديليفرزلر",
  "home.chooseRole": "اختر كيف تريد استخدام التطبيق",
  "home.continueAsCustomer": "المتابعة كعميل",
  "home.continueAsDriver": "المتابعة كسائق",
  "home.selectLanguage": "اختر اللغة",
  "home.categories": "الفئات",
  "home.seeAll": "عرض الكل",
  "home.searchPlaceholder": "ابحث عن مطاعم، بقالة، إلخ.",
  "home.nearbyVendors": "المتاجر القريبة",
  "home.popularVendors": "المتاجر الشائعة",
  "home.recentOrders": "الطلبات الأخيرة",
  "home.promotions": "العروض",
  "home.setLocation": "تحديد الموقع",
  "home.savedLocations": "المواقع المحفوظة",
  "home.locationPermission": "إذن الموقع",
  "home.locationPermissionDenied": "تم رفض إذن الموقع. يرجى تمكين خدمات الموقع لرؤية المتاجر القريبة.",
  "categories.food": "الطعام",
  "Delivered": "تم التوصيل",
  "categories.groceries": "البقالة",
  "categories.pharmacy": "الصيدلية",
  "categories.parcel": "الطرود",
  "categories.seeAll": "عرض جميع الفئات",
  "subcategories.food.pizza": "بيتزا",
  "subcategories.food.burgers": "برجر",
  "subcategories.food.sushi": "سوشي",
  "subcategories.food.chinese": "صيني",
  "subcategories.food.italian": "إيطالي",
  "subcategories.food.indian": "هندي",
  "subcategories.groceries.produce": "منتجات طازجة",
  "subcategories.groceries.dairy": "ألبان",
  "subcategories.groceries.snacks": "وجبات خفيفة",
  "subcategories.groceries.beverages": "مشروبات",
  "subcategories.groceries.bakery": "مخبوزات",
  "subcategories.groceries.household": "مستلزمات منزلية",
  "subcategories.pharmacy.prescriptions": "وصفات طبية",
  "subcategories.pharmacy.wellness": "العناية الصحية",
  "subcategories.pharmacy.babyCare": "عناية بالأطفال",
  "subcategories.pharmacy.personalCare": "العناية الشخصية",
  "subcategories.pharmacy.vitamins": "فيتامينات",
  "subcategories.pharmacy.firstAid": "إسعافات أولية",
  "subcategories.parcel.send": "إرسال طرد",
  "subcategories.parcel.receive": "استلام طرد",
  "subcategories.parcel.track": "تتبع طرد",
  "vendor.openNow": "مفتوح الآن",
  "vendor.closed": "مغلق",
  "vendor.rating": "التقييم",
  "vendor.distance": "المسافة",
  "vendor.deliveryTime": "وقت التوصيل",
  "vendor.deliveryFee": "رسوم التوصيل",
  "vendor.minOrder": "الحد الأدنى للطلب",
  "vendor.favorite": "إضافة إلى المفضلة",
  "vendor.unfavorite": "إزالة من المفضلة",
  "vendor.viewMenu": "عرض القائمة",
  "vendor.viewProducts": "عرض المنتجات",
  "vendor.viewItems": "عرض العناصر",
  "vendor.results": "نتائج",
  "search.placeholder": "بحث...",
  "search.recentSearches": "عمليات البحث الأخيرة",
  "search.clearAll": "مسح الكل",
  "search.noResults": "لم يتم العثور على نتائج",
  "search.tryAgain": "جرب كلمات مختلفة",
  "filters.sortBy": "ترتيب حسب",
  "filters.distance": "المسافة",
  "filters.rating": "التقييم",
  "filters.deliveryTime": "وقت التوصيل",
  "filters.price": "السعر",
  "filters.priceRange": "نطاق السعر",
  "filters.dietary": "التفضيلات الغذائية",
  "filters.vegetarian": "نباتي",
  "filters.vegan": "نباتي صرف",
  "filters.halal": "حلال",
  "filters.glutenFree": "خالي من الغلوتين",
  "filters.apply": "تطبيق الفلاتر",
  "filters.reset": "إعادة ضبط",
  "navigation.home": "الرئيسية",
  "navigation.favorites": "المفضلة",
  "navigation.orders": "الطلبات",
  "navigation.profile": "الملف الشخصي",
  "location.current": "الموقع الحالي",
  "location.searching": "جاري البحث عن موقعك...",
  "location.notFound": "لم يتم العثور على الموقع",
  "location.permissionDenied": "تم رفض إذن الموقع",
  "location.permissionRequired": "إذن الموقع مطلوب",
  "location.enableLocation": "تمكين الموقع",
  "location.searchPlaceholder": "ابحث عن عنوان",
  "location.recentLocations": "المواقع الأخيرة",
  "location.savedLocations": "المواقع المحفوظة",
  "location.addHome": "إضافة المنزل",
  "location.addWork": "إضافة العمل",
  "location.addNew": "إضافة موقع جديد",
  "location.kmAway": "كم بعيد",
  "dashboard.customer": "لوحة التحكم",
  "dashboard.driver": "لوحة تحكم السائق",
  "dashboard.activeDeliveries": "التوصيلات النشطة",
  "dashboard.noActiveDeliveries": "ليس لديك أي توصيلات نشطة",
  "dashboard.quickActions": "إجراءات سريعة",
  "dashboard.loyaltyPoints": "نقاط الولاء",
  "dashboard.nextReward": "الجائزة التالية",
  "dashboard.orderHistory": "سجل الطلبات",
  "dashboard.trackOrder": "تتبع الطلب",
  "dashboard.rewards": "المكافآت",
  "dashboard.reorder": "إعادة الطلب",
  "dashboard.dealTitle": "العرض",
  "dashboard.dealDescription": "الوصف",
  "dashboard.claimOffer": "الحصول على العرض",
  "dashboard.quickReorder": "طلب سريع",
  "dashboard.personalizedDeals": "عروض خاصة لك",
  "dashboard.activeOrders": "الطلبات النشطة",
  "dashboard.completedOrders": "الطلبات المكتملة",
  "dashboard.track": "تتبع",
  "dashboard.noActiveOrders": "ليس لديك طلبات نشطة.",
  "dashboard.startShopping": "ابدأ التسوق",
  "dashboard.noCompletedOrders": "ليس لديك طلبات مكتملة.",
  "dashboard.openOrders": "الطلبات المفتوحة",
  "dashboard.noOpenOrders": "لا توجد طلبات مفتوحة",
  "dashboard.openOrdersDescription": "ستظهر الطلبات المفتوحة هنا عندما يضع العملاء طلبات جديدة.",
  "orders.orderId": "رقم الطلب",
  "orders.customerDetails": "تفاصيل العميل",
  "orders.items": "العناصر",
  "orders.total": "المجموع",
  "orders.deliveryAddress": "عنوان التوصيل",
  "orders.estimatedDelivery": "التوصيل المتوقع",
  "orders.statusOpen": "مفتوح",
  "common.details": "التفاصيل",
  "common.process": "معالجة",
  "common.newest": "الأحدث",
  "common.oldest": "الأقدم",
  "delivery.newDelivery": "توصيل جديد",
  "delivery.trackOrders": "تتبع الطلبات",
  "delivery.orderHistory": "سجل الطلبات",
  "delivery.profile": "الملف الشخصي",
  "delivery.createDelivery": "إنشاء توصيل",
  "delivery.pickupAddress": "عنوان الاستلام",
  "delivery.deliveryAddress": "عنوان التوصيل",
  "delivery.packageDetails": "تفاصيل الطرد",
  "delivery.preferredTime": "وقت التوصيل المفضل",
  "delivery.notes": "ملاحظات إضافية",
  "delivery.submitRequest": "إرسال طلب التوصيل",
  "delivery.from": "من",
  "delivery.to": "إلى",
  "delivery.status": "حالة التوصيل",
  "delivery.estimatedDelivery": "التوصيل المتوقع",
  "delivery.driverInfo": "معلومات السائق",
  "delivery.customerInfo": "العميل",
  "delivery.deliveryDetails": "تفاصيل التوصيل",
  "delivery.navigate": "التنقل",
  "delivery.updateStatus": "تحديث الحالة",
  "delivery.accept": "قبول",
  "delivery.decline": "رفض",
  "delivery.distance": "المسافة",
  "delivery.deliveredOn": "تم التوصيل في",
  "delivery.myDeliveries": "توصيلاتي",
  "delivery.orderDetails": "تفاصيل الطلب",
  "delivery.calculating": "جاري الحساب...",
  "delivery.markInTransit": "تحديد قيد التوصيل",
  "delivery.markDelivered": "تحديد تم التوصيل",
  "delivery.cancel": "إلغاء التوصيل",
  "common.backToDashboard": "العودة إلى لوحة التحكم",
  "common.retry": "إعادة المحاولة",
  "errors.error": "خطأ",
  "errors.updateFailed": "فشل في التحديث",
  "orders.statusUpdated": "تم تحديث الحالة",
  "orders.orderStatus": "حالة الطلب",
  "parcel.title": "توصيل الطرود",
  "parcel.send": "إرسال طرد",
  "parcel.receive": "استلام طرد",
  "parcel.track": "تتبع طرد",
  "parcel.history": "سجل الطرود",
  "parcel.createNew": "إنشاء طرد جديد",
  "parcel.pickupDetails": "تفاصيل الاستلام",
  "parcel.deliveryDetails": "تفاصيل التوصيل",
  "parcel.parcelDetails": "تفاصيل الطرد",
  "parcel.weight": "الوزن",
  "parcel.dimensions": "الأبعاد",
  "parcel.fragile": "قابل للكسر",
  "parcel.trackingNumber": "رقم التتبع",
  "parcel.status": "الحالة",
  "parcel.estimatedDelivery": "التوصيل المتوقع",
  "support.title": "الدعم",
  "support.contactUs": "اتصل بنا",
  "support.email": "البريد الإلكتروني",
  "support.phone": "الهاتف",
  "support.chat": "الدردشة المباشرة",
  "support.faq": "الأسئلة الشائعة",
  "support.helpCenter": "مركز المساعدة",
  "faq.title": "الأسئلة الشائعة",
  "faq.deliveryQuestion": "كم من الوقت يستغرق التوصيل؟",
  "faq.deliveryAnswer": "تختلف أوقات التوصيل بناءً على موقعك والبائع. يتم عرض وقت التوصيل المقدر قبل تقديم طلبك.",
  "faq.paymentQuestion": "ما هي طرق الدفع المقبولة؟",
  "faq.paymentAnswer": "نقبل بطاقات الائتمان/الخصم، والمحافظ الإلكترونية، والدفع عند الاستلام في معظم المواقع.",
  "faq.accountQuestion": "كيف يمكنني إنشاء حساب؟",
  "faq.accountAnswer": "يمكنك إنشاء حساب بالنقر على زر التسجيل واتباع عملية التسجيل.",
  "faq.refundQuestion": "ما هي سياسة الاسترداد؟",
  "faq.refundAnswer": "تتم معالجة المبالغ المستردة في غضون 5-7 أيام عمل. يرجى الاتصال بالدعم لطلبات الاسترداد المحددة.",
  "faq.contactQuestion": "كيف يمكنني الاتصال بدعم العملاء؟",
  "faq.contactAnswer": "يمكنك الوصول إلى فريق دعم العملاء عبر البريد الإلكتروني أو الهاتف أو الدردشة المباشرة في قسم الدعم.",
  "wallet.title": "محفظتي",
  "wallet.balance": "الرصيد",
  "wallet.addFunds": "إضافة أموال",
  "wallet.withdraw": "سحب",
  "wallet.transactions": "المعاملات",
  "wallet.topUp": "شحن",
  "wallet.paymentMethods": "طرق الدفع",
  "wallet.addCard": "إضافة بطاقة",
  "referral.title": "دعوة صديق",
  "referral.description": "ادعُ أصدقاءك إلى ديليفرزلر واحصل على مكافآت!",
  "referral.yourCode": "رمز الإحالة الخاص بك",
  "referral.shareCode": "مشاركة الرمز",
  "referral.inviteFriends": "دعوة الأصدقاء",
  "referral.reward": "احصل على 5$ لكل صديق يسجل ويقدم طلبه الأول",
  "referral.termsAndConditions": "الشروط والأحكام",
  "settings.title": "الإعدادات",
  "settings.language": "اللغة",
  "settings.theme": "المظهر",
  "settings.notifications": "الإشعارات",
  "settings.account": "الحساب",
  "settings.help": "المساعدة والدعم",
  "settings.about": "حول",
  "settings.logout": "تسجيل الخروج",
  "settings.darkMode": "الوضع الداكن",
  "settings.lightMode": "الوضع الفاتح",
  "settings.systemTheme": "مظهر النظام",
  "common.loading": "جاري التحميل...",
  "common.submit": "إرسال",
  "common.cancel": "إلغاء",
  "common.save": "حفظ",
  "common.edit": "تعديل",
  "common.delete": "حذف",
  "common.back": "رجوع",
  "common.next": "التالي",
  "common.done": "تم",
  "common.error": "خطأ",
  "common.close": "إغلاق",
  "common.search": "بحث",
  "common.filter": "تصفية",
  "common.sort": "ترتيب",
  "common.all": "الكل",
  "common.km": "كم",
  "common.min": "دقيقة",
  "common.off": "خصم",
  "common.free": "مجاني",
  "common.greeting": "مرحباً",
  "common.viewDetails": "عرض التفاصيل",
  "cart.yourCart": "عربة التسوق الخاصة بك",
  "cart.startShopping": "ابدأ التسوق",
  "cart.subtotal": "المجموع ",
  "cart.promoCode": "رمز خصم",
  "cart.apply": "تطبيق",
  "cart.checkout": "الدفع",
  "cart.remove": "إزالة",
  "cart.empty": "عربة التسوق فارغة",
  "recommendations.error": "غير قادر على تحميل التوصيات في هذا الوقت",
  "recommendations.refresh": "تحديث",
  "recommendations.noRecommendations": "لا توجد توصيات متاحة بعد",
  "home.recommendedForYou": "موصى به لك",
  "home.dailyDeal": "العرض اليومي #{number}",
  "home.dealDescription": "عروض خاصة لك",
  "home.shopNow": "تسوق الآن",
  "common.showMore": "عرض المزيد",
  "common.showLess": "عرض أقل",
  "home.currentLocation": "الموقع الحالي",
  "recommendations.tryAgain": "حاول مرة أخرى",
  "category.nameKey": "اسم الفئة",
  "categories.more": "المزيد",
  "home.goodMorning": "صباح الخير",
  "home.goodAfternoon": "مساء الخير",
  "home.goodEvening": "مساء الخير",
  "navigation.inbox": "صندوق الوارد",
  "home.smartSuggestion": "اقتراحات ذكية",
  "navigation.messages": "الرسائل",
  "messages.empty": "رسائلك ستظهر هنا",
  "filter.byRating": "ترتيب حسب التقييم",
  "filter.byDistance": "ترتيب حسب المسافة",
  "filter.byPopularity": "ترتيب حسب الشعبية",
  "byRating": "الأعلى تقييماً",
  "byDistance": "الأقرب",
  "byPopularity": "الأكثر شعبية",
  "search.noNearbyRestaurants": "لا توجد مطاعم قريبة",
  "home.nearbyRestaurants": "مطاعم قريبة",
  "locationAccess": "الوصول للموقع",
  "geoNotSupported": "المتصفح لا يدعم تحديد الموقع الجغرافي",
  "error.title": "خيارات التصفية",
  "error.byRating": "الأعلى تقييماً",
  "error.byDistance": "الأقرب",
  "error.byPopularity": "الأكثر شعبية",
  "error.locationAccess": "الوصول للموقع",
  "error.geoNotSupported": "المتصفح لا يدعم تحديد الموقع الجغرافي",
  "errors.locationAccess": "الوصول للموقع مطلوب لعرض المتاجر القريبة",
  "errors.geoNotSupported": "المتصفح لا يدعم تحديد الموقع الجغرافي",
  "filter.title": "خيارات التصفية",
  "categories.cart": "عربة التسوق",
  "dashboard.viewRewards": "عرض المكافآت",
  "rewards.availablePoints": "النقاط المتاحة",
  "rewards.totalSpent": "إجمالي الإنفاق",
  "rewards.pointsToNextLevel": "النقاط للمستوى التالي",
  "rewards.earned": "النقاط المكتسبة",
  "rewards.redeemed": "النقاط المستبدلة",
  "rewards.expired": "النقاط المنتهية",
  "rewards.adjusted": "النقاط المعدلة",
  "rewards.points": "النقاط",
  "rewards.freeDelivery": "توصيل مجاني",
  "rewards.freeDeliveryDesc": "استمتع بتوصيل مجاني على طلبك التالي.",
  "rewards.discount10": "خصم 10%",
  "rewards.discount10Desc": "احصل على خصم 10% على مشترياتك القادمة.",
  "rewards.discount25": "خصم 25%",
  "rewards.discount25Desc": "وفر 25% على طلبك التالي.",
  "rewards.redeem": "استبدال",
  "rewards.transactionHistory": "سجل المعاملات",
  "rewards.redeemError": "خطأ في الاستبدال",
  "rewards.insufficientPoints": "ليس لديك نقاط كافية لاستبدال هذه المكافأة.",
  "rewards.redeemErrorMessage": "حدث خطأ أثناء استبدال المكافأة.",
  "rewards.levelBenefits": "مزايا المستوى",
  "rewards.levelBenefitsDesc": "المزايا لكل مستوى مكافأة.",
  "rewards.bronzeDesc": "مزايا أساسية لمستوى البرونز.",
  "rewards.silverDesc": "مزايا محسنة لمستوى الفضة.",
  "rewards.goldDesc": "مزايا مميزة لمستوى الذهب.",
  "rewards.platinumDesc": "مزايا حصرية لمستوى البلاتين.",
  "rewards.current": "المستوى الحالي",
  "rewards.availableRewards": "المكافآت المتاحة",
  "rewards.redeemSuccess": "تم استبدال المكافأة بنجاح",
  "rewards.redeemSuccessMessage": "لقد قمت باستبدال {title} بنجاح.",
  "rewards.title": "المكافآت",
  "rewards.level": "مستوى",
  "rewards.maxLevelReached": "لقد وصلت إلى أعلى مستوى!",
  "dashboard.earnMore": "اكسب المزيد من النقاط",
  "navigation.checkout": "الدفع",
  "errors.fetchFailed": "فشل في جلب البيانات",
  "errors.failedProducts": "فشل في تحميل المنتجات",
  "common.Retry": "إعادة المحاولة",
  "common.refresh": "تحديث",
  "loading.message": "جاري التحميل...",
  "errors.noProducts": "لا توجد منتجات متاحة",
  "favorites.products": "المنتجات",
  "favorites.vendors": "المتاجر",
  "favorites.empty": "لا توجد عناصر مفضلة",
  "navigation.browse": "تصفح",
  "favorites.all": "الكل",
  "favorites.categories": "الفئات",
  "favorites.collections": "المجموعات",
  "favorites.myCollections": "مجموعاتي",
  "favorites.newCollection": "مجموعة جديدة",
  "favorites.items": "عناصر",
  "favorites.collectionProducts": "المنتجات في المجموعة",
  "favorites.collectionVendors": "المتاجر في المجموعة",
  "favorites.collectionCategories": "الفئات في المجموعة",
  "favorites.addToCollection": "إضافة إلى مجموعة",
  "favorites.emptyCollection": "هذه المجموعة فارغة",
  "favorites.noCollections": "ليس لديك أي مجموعات بعد",
  "favorites.createCollection": "إنشاء مجموعة",
  "favorites.createCollectionDesc": "إنشاء مجموعة جديدة لتنظيم العناصر المفضلة لديك",
  "favorites.collectionName": "اسم المجموعة",
  "favorites.collectionNamePlaceholder": "أدخل اسم المجموعة",
  "favorites.collectionNameAr": "اسم المجموعة (بالعربية)",
  "favorites.collectionNameArPlaceholder": "أدخل اسم المجموعة",
  "favorites.collectionDesc": "الوصف",
  "favorites.collectionDescPlaceholder": "أدخل وصف المجموعة",
  "favorites.collectionDescAr": "الوصف (بالعربية)",
  "favorites.collectionDescArPlaceholder": "أدخل وصف المجموعة",
  "favorites.selectCollection": "اختر مجموعة لإضافة هذا العنصر إليها",
  "filters.category": "الفئة",
  "filters.allCategories": "جميع الفئات",
  "filters.minRating": "الحد الأدنى للتقييم",
  "filters.default": "الافتراضي",
  "filters.nameAsc": "الاسم (أ-ي)",
  "filters.nameDesc": "الاسم (ي-أ)",
  "filters.priceAsc": "السعر (الأقل إلى الأعلى)",
  "filters.priceDesc": "السعر (الأعلى إلى الأقل)",
  "filters.ratingAsc": "التقييم (الأقل إلى الأعلى)",
  "filters.ratingDesc": "التقييم (الأعلى إلى الأقل)",
  "common.create": "إنشاء",
  "filters.title": "خيارات التصفية",
  "filters.tags": "علامات المنتج",
  "filters.additional": "تصفية إضافية",
  "filters.inStock": "متوفر",
  "filters.onSale": "عروض",
  "filters.clearAll": "مسح الكل",
  "product.glutenFree": "خالي من الغلوتين",
  "product.dairyFree": "خالي من منتجات الألبان",
  "product.local": "محلي",
  "product.imported": "مستورد",
  "filters.price-asc": "السعر (الأقل إلى الأعلى)",
  "filters.price-desc": "السعر (الأعلى إلى الأقل)",
  "filters.rating-desc": "التقييم (الأعلى إلى الأقل)",
  "filters.name-asc": "الاسم (أ-ي)",
  "driver.deliveries": "التوصيلات",
  "driver.transactions": "المعاملات",
  "driver.orderID": "رقم الطلب",
  "driver.noTransactionHistory": "لا يوجد سجل معاملات متاح",
  "driver.profile": "الملف الشخصي",
  "driver.wallet": "المحفظة",
  "driver.history": "السجل",
  "transaction.status.completed": "مكتمل",
  "transaction.status.pending": "قيد الانتظار",
  "transaction.status.failed": "فشل",
  "driver.historyAndTransactions": "سجل التوصيلات وسجل المعاملات",
  "delivery.noCompletedDeliveries": "لا توجد توصيلات مكتملة حتى الآن",
  "delivery.completed": "مكتمل",
  "delivery.customer": "العميل",
  "delivery.earnings": "الإيرادات",
}
