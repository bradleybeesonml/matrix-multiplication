import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotProductStep } from '../types/matrix';
import { formatNumber } from '../utils/matrixOperations';
import { useMatrixStore } from '../store/matrixStore';
import { cn } from '../lib/utils';

interface DotProductStackProps {
  currentStep: DotProductStep | null;
  allSteps: DotProductStep[];
  className?: string;
}

interface StepItemProps {
  step: DotProductStep;
  isActive: boolean;
  isCompleted: boolean;
  precision: number;
}

const StepItem: React.FC<StepItemProps> = ({ step, isActive, isCompleted, precision }) => {
  return (
    <motion.div
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border transition-all duration-300',
        {
          'bg-primary/10 border-primary shadow-md': isActive,
          'bg-muted/50 border-muted': !isActive && isCompleted,
          'bg-background border-border': !isActive && !isCompleted,
        }
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-1 text-sm">
          <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
            A[{step.i},{step.k}]
          </span>
          <span className="text-muted-foreground">×</span>
          <span className="font-mono bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
            B[{step.k},{step.j}]
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-mono text-blue-600 font-bold text-lg">
            {formatNumber(step.aValue, precision)}
          </span>
          <span className="text-muted-foreground text-lg">×</span>
          <span className="font-mono text-green-600 font-bold text-lg">
            {formatNumber(step.bValue, precision)}
          </span>
          <span className="text-muted-foreground text-lg">=</span>
          <span className="font-mono font-bold text-red-600 text-lg bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
            {formatNumber(step.product, precision)}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Sum:</span>
        <span id="dot-product-sum" className="font-mono font-bold text-lg">
          {formatNumber(step.partialSum, precision)}
        </span>
      </div>
    </motion.div>
  );
};

export const DotProductStack: React.FC<DotProductStackProps> = ({
  currentStep,
  allSteps,
  className
}) => {
  const { settings } = useMatrixStore();
  const { precision } = settings;

  // Filter steps to show only those for the current cell
  const currentCellSteps = currentStep && allSteps
    ? allSteps.filter(step => step.i === currentStep.i && step.j === currentStep.j)
    : [];

  // Determine which step is currently active
  const activeStepIndex = currentStep ? currentStep.k : -1;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">
          Dot Product Calculation
        </h3>
        {currentStep && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Computing C[{currentStep.i},{currentStep.j}]
            </p>
            <p className="text-xs text-muted-foreground">
              Row {currentStep.i + 1} from Matrix A • Column {currentStep.j + 1} from Matrix B
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {currentCellSteps.map((step, index) => {
            const isActive = index === activeStepIndex;
            const isCompleted = index < activeStepIndex;
            
            return (
              <StepItem
                key={`${step.i}-${step.j}-${step.k}`}
                step={step}
                isActive={isActive}
                isCompleted={isCompleted}
                precision={precision}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {currentStep && (
        <motion.div
          className="p-4 bg-muted/20 rounded-lg border-2 border-dashed border-primary/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Current operation:
            </p>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-lg text-lg font-bold">
                  A[{currentStep.i},{currentStep.k}] = {formatNumber(currentStep.aValue, precision)}
                </span>
                <span className="text-2xl text-muted-foreground">×</span>
                <span className="font-mono bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg text-lg font-bold">
                  B[{currentStep.k},{currentStep.j}] = {formatNumber(currentStep.bValue, precision)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl text-muted-foreground">=</span>
                <span className="font-mono font-bold text-2xl text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
                  {formatNumber(currentStep.product, precision)}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Running sum: <span className="font-mono font-bold">
                {formatNumber(currentStep.partialSum, precision)}
              </span>
            </p>
          </div>
        </motion.div>
      )}

      {!currentStep && (
        <div className="text-center text-muted-foreground py-8">
          <p>Click "Play" or "Step Forward" to start the animation</p>
        </div>
      )}
    </div>
  );
};
