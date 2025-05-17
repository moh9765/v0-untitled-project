import { motion } from 'framer-motion'

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export const CategoryCard = ({ category }: { category: Category }) => (
  <motion.div
    className="category-card"
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className={`icon-container ${category.color}`}>
      <img src={category.icon} alt={category.name} />
    </div>
    <h3 className="category-title">{category.name}</h3>
  </motion.div>
)