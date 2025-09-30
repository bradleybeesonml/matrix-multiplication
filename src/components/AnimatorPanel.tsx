import React from 'react';
import { motion } from 'framer-motion';
import { SkipBack, SkipForward, RotateCcw, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Toggle } from './ui/toggle';
import { useAnimator } from '../hooks/useAnimator';
import { useMatrixStore } from '../store/matrixStore';
import { cn } from '../lib/utils';

interface AnimatorPanelProps {
  className?: string;
}

export const AnimatorPanel: React.FC<AnimatorPanelProps> = ({ className }) => {
  const {
    reset,
    stepForward,
    stepBackward,
    setSpeed,
    setStepMode,
    currentStep,
    progress
  } = useAnimator();

  const { animationState } = useMatrixStore();
  const { speed, stepMode } = animationState;

  const handleSpeedChange = (newSpeed: number[]) => {
    setSpeed(newSpeed[0]);
  };

  const handleStepModeChange = (newMode: boolean) => {
    setStepMode(newMode ? 'cell' : 'factor');
  };

  const progressPercentage = progress.totalCells > 0 
    ? (progress.completedCells / progress.totalCells) * 100 
    : 0;

  return (
    <motion.div
      className={cn('space-y-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Controls */}
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Animation Controls</h3>
        
        <div className="flex items-center justify-center space-x-2">
          <Button
            onClick={reset}
            variant="outline"
            size="sm"
            aria-label="Reset animation"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={stepBackward}
            variant="outline"
            size="sm"
            aria-label="Step backward"
            disabled={!currentStep}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={stepForward}
            variant="outline"
            size="sm"
            aria-label="Step forward"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Speed Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="speed-slider" className="text-sm font-medium text-foreground">
            Animation Speed
          </label>
          <span className="text-sm text-muted-foreground">
            {speed.toFixed(2)} steps/sec
          </span>
        </div>
        
        <Slider
          id="speed-slider"
          value={[speed]}
          onValueChange={handleSpeedChange}
          min={0.25}
          max={3}
          step={0.25}
          className="w-full"
          aria-label="Animation speed"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Step Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label htmlFor="step-mode" className="text-sm font-medium text-foreground">
            Step Mode
          </label>
          <p className="text-xs text-muted-foreground">
            {stepMode === 'factor' 
              ? 'Step by each multiplication factor'
              : 'Step by complete cell calculation'
            }
          </p>
        </div>
        
        <Toggle
          id="step-mode"
          pressed={stepMode === 'cell'}
          onPressedChange={handleStepModeChange}
          aria-label="Toggle step mode"
        >
          <Settings className="h-4 w-4" />
        </Toggle>
      </div>

      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">
            {progress.completedCells} / {progress.totalCells} cells
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        
        {progress.currentCell && (
          <p className="text-xs text-muted-foreground text-center">
            Current: C[{progress.currentCell.row},{progress.currentCell.col}]
          </p>
        )}
      </div>

      {/* Current Step Info */}
      {currentStep && (
        <motion.div
          className="p-3 bg-muted/50 rounded-lg border"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-foreground">
              Current Step
            </p>
            <p className="text-xs text-muted-foreground">
              A[{currentStep.i},{currentStep.k}] × B[{currentStep.k},{currentStep.j}]
            </p>
            <p className="text-xs text-muted-foreground">
              Partial sum: {currentStep.partialSum.toFixed(2)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Instructions:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Click <strong>Play</strong> to auto-animate through all calculations</li>
          <li>Use <strong>Step Forward/Backward</strong> for manual control</li>
          <li>Adjust speed with the slider</li>
          <li>Toggle step mode to control granularity</li>
          <li>Click <strong>Reset</strong> to start over</li>
        </ul>
      </div>
    </motion.div>
  );
};
