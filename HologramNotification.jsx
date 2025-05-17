import { motion } from 'framer-motion'

export const HologramNotification = ({ message }) => (
  <motion.div
    initial={{ x: 300 }}
    animate={{ x: 0 }}
    exit={{ x: 300 }}
    className="hologram-notification"
  >
    <div className="hologram-content">
      {message}
      <div className="hologram-pulse" />
    </div>
  </motion.div>
)