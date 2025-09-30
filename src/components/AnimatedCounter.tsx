import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from '../utils/matrixOperations';

interface AnimatedCounterProps {
  value: number;
  precision: number;
  className?: string;
  id?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  precision,
  className = '',
  id
}) => {
  const [showAddition, setShowAddition] = useState(false);
  const [addedValue, setAddedValue] = useState(0);
  const previousValueRef = useRef(value);

  useEffect(() => {
    // Only animate if the value actually changed
    if (value !== previousValueRef.current) {
      const difference = value - previousValueRef.current;
      console.log(`Addition: ${previousValueRef.current} + ${difference} = ${value}`);
      
      // Only show addition if the value is actually increasing (positive difference)
      if (difference > 0) {
        setAddedValue(difference);
        setShowAddition(true);
        
        // Hide addition after 800ms to give more time to read
        const additionTimer = setTimeout(() => {
          setShowAddition(false);
        }, 800);

        // Update previous value
        previousValueRef.current = value;

        return () => clearTimeout(additionTimer);
      } else {
        // For decreases or resets, just update the value without showing addition
        previousValueRef.current = value;
      }
    }
  }, [value, precision]);

  return (
    <div className="relative inline-flex items-center">
      <motion.span
        id={id}
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {formatNumber(value, precision)}
      </motion.span>
      
      <AnimatePresence>
        {showAddition && (
          <motion.span
            className="absolute left-full ml-2 text-green-600 font-bold text-xl bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded shadow-lg whitespace-nowrap"
            initial={{ opacity: 0, x: -10, scale: 0.8 }}
            animate={{ opacity: 0.8, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            +{formatNumber(addedValue, precision)}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
