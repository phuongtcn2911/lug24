
import { motion } from "framer-motion";

export function Fade({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}     // trạng thái ban đầu (ẩn + hơi lệch xuống)
      animate={{ opacity: 1, y: 0 }}      // trạng thái sau khi hiện
      exit={{ opacity: 0, y: -20 }}       // trạng thái khi rời đi
      transition={{ duration: 0.4 }}      // thời gian animation
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

export function SwipeLeft({ children }) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}


{/* <motion.div
  key="email"
  initial={{ x: "100%", opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: "-100%", opacity: 0 }}
  transition={{ duration: 0.5 }}
></motion.div>
 */}
