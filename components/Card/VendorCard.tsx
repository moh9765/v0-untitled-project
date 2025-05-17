import { motion } from 'framer-motion'

export interface Vendor {
  id: string
  name: string
  rating: number
  deliveryTime: string
  image: string
  distance?: number
  lat(lat: number, lng: number, lat1: any, lng1: any): any
  lng(lat: number, lng: number, lat1: any, lng1: any): any
  popularity: any
  nameAr?: string
  logo: string
  coverImage: string
  ratingCount: number
  address: string
  addressAr?: string
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

export const VendorCard = ({ vendor }: { vendor: Vendor }) => (
  <motion.div
    className="vendor-card"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <img src={vendor.image} alt={vendor.name} className="vendor-image" />
    <div className="vendor-info">
      <h4>{vendor.name}</h4>
      <div className="rating">{'★'.repeat(vendor.rating)}</div>
      <p>Delivery: {vendor.deliveryTime}</p>
    </div>
  </motion.div>
)