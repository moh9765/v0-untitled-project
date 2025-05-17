import { motion } from 'framer-motion';

const HologramSuggestion = ({ text }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="hologram-effect"
  >
    <div className="hologram-content">{text}</div>
  </motion.div>
);