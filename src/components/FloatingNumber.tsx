import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMatrixStore } from '../store/matrixStore';
import { formatNumber } from '../utils/matrixOperations';

export const FloatingNumber: React.FC = () => {
  const { floatingNumber, settings } = useMatrixStore();
  const { isVisible, value, startPosition, endPosition } = floatingNumber;
  const { precision } = settings;

  const variants = {
    initial: {
      opacity: 0,
      x: startPosition?.x ?? 0,
      y: startPosition?.y ?? 0,
      scale: 0.8,
    },
    animate: {
      opacity: [0.8, 1, 1, 0.8],
      x: endPosition?.x ?? 0,
      y: endPosition?.y ?? 0,
      scale: [1.2, 1, 0.8, 0.5],
      transition: {
        duration: 0.7,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <AnimatePresence>
      {isVisible && value !== null && (
        <motion.div
          className="fixed z-50 bg-primary/80 text-primary-foreground font-bold text-lg rounded-full shadow-lg flex items-center justify-center px-4 py-2"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {formatNumber(value, precision)}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
