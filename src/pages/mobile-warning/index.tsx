import { motion } from 'framer-motion';
import React from 'react';

const MobileView = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <motion.span
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="animate-bounce text-base font-bold text-yellow"
      >
        Website không khả dụng trên mobile
      </motion.span>
    </div>
  );
};

export default MobileView;
