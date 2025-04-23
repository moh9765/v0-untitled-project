// Translation keys for the application
export type TranslationKey =
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

// English translations
export const enTranslations: Record<TranslationKey, string> = {
  "app.name": "Deliverzler",
  "app.description": "Multi-service delivery platform",
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
  "filters.apply": "Apply Filters",
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
  "faq.deliveryAnswer":
    "Delivery times vary based on your location and the vendor. The estimated delivery time is shown before you place your order.",
  "faq.paymentQuestion": "What payment methods are accepted?",
  "faq.paymentAnswer": "We accept credit/debit cards, mobile wallets, and cash on delivery in most locations.",
  "faq.accountQuestion": "How do I create an account?",
  "faq.accountAnswer":
    "You can create an account by clicking the Sign Up button and following the registration process.",
  "faq.refundQuestion": "What is the refund policy?",
  "faq.refundAnswer":
    "Refunds are processed within 5-7 business days. Please contact support for specific refund requests.",
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
  "common.retry": "Retry",
  "common.close": "Close",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.sort": "Sort",
  "common.all": "All",
  "common.km": "km",
  "common.min": "min",
  "common.off": "off",
  "common.free": "Free",
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
}

// Arabic translations
export const arTranslations: Record<TranslationKey, string> = {
  "app.name": "ديليفرزلر",
  "app.description": "منصة توصيل متعددة الخدمات",
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
  "home.currentLocation": "الموقع الحالي",
  "home.savedLocations": "المواقع المحفوظة",
  "home.locationPermission": "إذن الموقع",
  "home.locationPermissionDenied": "تم رفض إذن الموقع. يرجى تمكين خدمات الموقع لرؤية المتاجر القريبة.",
  "categories.food": "الطعام",
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
  "dashboard.loyaltyPoints": "نقاط الولاء :)",
  "dashboard.nextReward" : "الجائزة التالية",
  "dashboard.orderHistory" : "سجل الطلبات",
  "dashboard.trackOrder" : "تتبع الطلب",
  "dashboard.rewards" : "المكافآت",
  "dashboard.reorder" : "إعادة الطلب",
  "dashboard.dealTitle": "العرض",
  "dashboard.dealDescription":"الوصف",
  "dashboard.claimOffer":"الحصول على العرض",
  "dashboard.quickReorder":"طلب سريع",
  "dashboard.personalizedDeals":"عروض خاصة لك",
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
  "faq.contactAnswer":
    "يمكنك الوصول إلى فريق دعم العملاء عبر البريد الإلكتروني أو الهاتف أو الدردشة المباشرة في قسم الدعم.",
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
  "common.retry": "إعادة المحاولة",
  "common.close": "إغلاق",
  "common.search": "بحث",
  "common.filter": "تصفية",
  "common.sort": "ترتيب",
  "common.all": "الكل",
  "common.km": "كم",
  "common.min": "دقيقة",
  "common.off": "خصم",
  "common.free": "مجاني",
  "recommendations.error": "غير قادر على تحميل التوصيات في هذا الوقت",
  "recommendations.refresh": "تحديث",
  "recommendations.noRecommendations": "لا توجد توصيات متاحة بعد",
  "home.recommendedForYou": "موصى به لك",
  "home.dailyDeal": "العرض اليومي #{number}",
  "home.dealDescription": "عروض خاصة لك",
  "home.shopNow": "تسوق الآن",
  "common.showMore": "عرض المزيد",
  "common.showLess": "عرض أقل",
  "recommendations.tryAgain": "حاول مرة أخرى",
}
