import React from 'react';
import { motion } from 'framer-motion';
import { useMatrixStore } from '../store/matrixStore';
import { formatNumber } from '../utils/matrixOperations';
import { AlertCircle, Info } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export const CurrentStepDisplay: React.FC = () => {
  const { animationState, settings, matrixA, matrixB, validation } = useMatrixStore();
  const { currentStep } = animationState;
  const { precision } = settings;


  if (!currentStep) {
    // Show educational messages when matrices are incompatible
    if (!validation.isValid) {
      return (
        <motion.div 
          className="h-24 flex items-center justify-center bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-3 text-red-700 dark:text-red-300">
            <AlertCircle className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Matrix Dimensions Incompatible</div>
              <div className="text-sm opacity-80">{validation.error}</div>
            </div>
          </div>
        </motion.div>
      );
    }

    // Show helpful info when matrices are compatible but animation hasn't started
    if (matrixA && matrixB && validation.isValid) {
      return (
        <motion.div 
          className="h-24 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-3 text-blue-700 dark:text-blue-300">
            <Info className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Ready to Multiply!</div>
              <div className="text-sm opacity-80">
                Result will be {matrixA.rows}×{matrixB.cols} matrix. Click "Play Animation" to see the dot product steps.
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // Default message
    return (
      <div className="h-24 flex items-center justify-center text-muted-foreground bg-muted/30 rounded-lg">
        <span>Start the animation to see the steps here.</span>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 bg-muted/50 rounded-lg border-2 border-primary/20 flex items-center justify-center space-x-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground">From A</span>
        <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-lg text-lg font-bold">
          A[{currentStep.i + 1},{currentStep.k + 1}] = {formatNumber(currentStep.aValue, precision)}
        </span>
      </div>
      <span className="text-2xl text-muted-foreground mt-4">×</span>
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground">From B</span>
        <span className="font-mono bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg text-lg font-bold">
          B[{currentStep.k + 1},{currentStep.j + 1}] = {formatNumber(currentStep.bValue, precision)}
        </span>
      </div>
      <span className="text-2xl text-muted-foreground mt-4">=</span>
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground">Product</span>
        <span className="font-mono font-bold text-2xl text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
          {formatNumber(currentStep.product, precision)}
        </span>
      </div>
       <div className="border-l h-12 mx-4"></div>
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground">Running Sum for C[{currentStep.i + 1},{currentStep.j + 1}]</span>
        <AnimatedCounter
          id="dot-product-sum"
          value={currentStep.partialSum}
          precision={precision}
          className="font-mono font-bold text-2xl px-4 py-2 rounded-lg"
        />
      </div>
    </motion.div>
  );
};
