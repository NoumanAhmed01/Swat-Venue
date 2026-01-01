// src/components/animations/LayoutWrapper.js
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

const LayoutWrapper = () => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Outlet /> {/* This renders current page */}
    </motion.div>
  );
};

export default LayoutWrapper;
