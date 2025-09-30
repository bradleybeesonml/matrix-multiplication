import { useEffect, useRef, useCallback } from 'react';
import { DotProductStep, AnimationState, CellPosition } from '../types/matrix';
import { generateDotProductSteps } from '../utils/matrixOperations';
import { useMatrixStore } from '../store/matrixStore';

export interface UseAnimatorReturn {
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setSpeed: (speed: number) => void;
  setStepMode: (mode: 'factor' | 'cell') => void;
  isPlaying: boolean;
  currentStep: DotProductStep | null;
  progress: AnimationState['progress'];
  currentDotProductSteps: DotProductStep[];
}

export function useAnimator(): UseAnimatorReturn {
  const {
    matrixA,
    matrixB,
    matrixC,
    animationState,
    currentDotProductSteps,
    setAnimationState,
    setCurrentDotProductSteps,
    setHighlight,
    clearHighlight,
    updateMatrixCell,
    triggerFloatingNumber,
    hideFloatingNumber,
  } = useMatrixStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentStepIndexRef = useRef<number>(-1);
  const currentCellRef = useRef<CellPosition | null>(null);
  const currentStepsRef = useRef<DotProductStep[]>([]);

  // Generate all animation steps for the current matrices
  const generateAllSteps = useCallback(() => {
    if (!matrixC || !matrixC.rows || !matrixC.cols) return [];

    const allSteps: DotProductStep[] = [];
    const totalCells = matrixC.rows * matrixC.cols;
    let completedCells = 0;

    for (let i = 0; i < matrixC.rows; i++) {
      for (let j = 0; j < matrixC.cols; j++) {
        const steps = generateDotProductSteps(matrixA, matrixB, i, j);
        allSteps.push(...steps);
        completedCells++;
        
        // Update progress
        setAnimationState({
          progress: {
            currentCell: { row: i, col: j },
            totalCells,
            completedCells
          }
        });
      }
    }

    return allSteps;
  }, [matrixA, matrixB, matrixC, setAnimationState]);

  // Reset animation to initial state
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    currentStepIndexRef.current = -1;
    currentCellRef.current = null;
    currentStepsRef.current = [];

    setAnimationState({
      isPlaying: false,
      currentStep: null,
      progress: {
        currentCell: null,
        totalCells: matrixC ? matrixC.rows * matrixC.cols : 0,
        completedCells: 0
      }
    });

    clearHighlight('A');
    clearHighlight('B');
    setCurrentDotProductSteps([]);
  }, [matrixC, setAnimationState, clearHighlight, setCurrentDotProductSteps]);

  // Play animation
  const play = useCallback(() => {
    if (!matrixC) {
      console.warn('No result matrix to animate');
      return;
    }

    // Generate steps if not already done
    if (currentStepsRef.current.length === 0) {
      currentStepsRef.current = generateAllSteps();
      setCurrentDotProductSteps(currentStepsRef.current);
    }

    setAnimationState({ isPlaying: true });

    // Start interval
    const stepDuration = 1000 / animationState.speed; // Convert steps per second to milliseconds
    intervalRef.current = setInterval(() => {
      stepForward();
    }, stepDuration);
  }, [matrixC, generateAllSteps, animationState.speed, setAnimationState, setCurrentDotProductSteps]);

  // Pause animation
  const pause = useCallback(() => {
    setAnimationState({ isPlaying: false });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [setAnimationState]);

  // Step forward
  const stepForward = useCallback(() => {
    if (currentStepsRef.current.length === 0) {
      currentStepsRef.current = generateAllSteps();
      setCurrentDotProductSteps(currentStepsRef.current);
    }

    if (currentStepIndexRef.current < currentStepsRef.current.length - 1) {
      currentStepIndexRef.current++;
      const step = currentStepsRef.current[currentStepIndexRef.current];
      
      setAnimationState({ currentStep: step });

      // Clear previous highlights first
      clearHighlight('A');
      clearHighlight('B');

      // Update highlights - only for the current step
      setHighlight('A', {
        row: step.i,
        activePair: {
          a: { row: step.i, col: step.k },
          b: { row: step.k, col: step.j }
        }
      });

      setHighlight('B', {
        col: step.j,
        activePair: {
          a: { row: step.i, col: step.k },
          b: { row: step.k, col: step.j }
        }
      });

      // If this completes a cell, trigger the floating number animation
      if (step.isComplete && matrixC) {
        // Small delay to ensure DOM elements are ready
        setTimeout(() => {
          const startId = 'dot-product-sum';
          const endId = `matrix-cell-C-${step.i}-${step.j}`;
          
          triggerFloatingNumber(step.partialSum, startId, endId);

          // After the animation, update the cell and hide the number
          setTimeout(() => {
            updateMatrixCell('C', step.i, step.j, step.partialSum);
            hideFloatingNumber();
            
            // Clear highlights after a short delay to let the number settle
            setTimeout(() => {
              clearHighlight('A');
              clearHighlight('B');
            }, 100);

          }, 700); // This duration must match the animation duration in FloatingNumber.tsx
        }, 50);
      }
    } else {
      // Animation complete, clear all highlights and reset current step
      pause();
      setAnimationState({ currentStep: null });
      clearHighlight('A');
      clearHighlight('B');
    }
  }, [generateAllSteps, setAnimationState, setHighlight, clearHighlight, setCurrentDotProductSteps, matrixC, updateMatrixCell, pause, triggerFloatingNumber, hideFloatingNumber]);

  // Step backward
  const stepBackward = useCallback(() => {
    if (currentStepIndexRef.current > 0) {
      currentStepIndexRef.current--;
      const step = currentStepsRef.current[currentStepIndexRef.current];
      
      setAnimationState({ currentStep: step });

      // Clear previous highlights first
      clearHighlight('A');
      clearHighlight('B');

      // Update highlights - only for the current step
      setHighlight('A', {
        row: step.i,
        activePair: {
          a: { row: step.i, col: step.k },
          b: { row: step.k, col: step.j }
        }
      });

      setHighlight('B', {
        col: step.j,
        activePair: {
          a: { row: step.i, col: step.k },
          b: { row: step.k, col: step.j }
        }
      });
    }
  }, [setAnimationState, setHighlight, clearHighlight]);

  // Set animation speed
  const setSpeed = useCallback((speed: number) => {
    setAnimationState({ speed });
    
    // Restart interval with new speed if currently playing
    if (intervalRef.current && animationState.isPlaying) {
      clearInterval(intervalRef.current);
      const stepDuration = 1000 / speed;
      intervalRef.current = setInterval(() => {
        stepForward();
      }, stepDuration);
    }
  }, [setAnimationState, animationState.isPlaying, stepForward]);

  // Set step mode
  const setStepMode = useCallback((mode: 'factor' | 'cell') => {
    setAnimationState({ stepMode: mode });
  }, [setAnimationState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setSpeed,
    setStepMode,
    isPlaying: animationState.isPlaying,
    currentStep: animationState.currentStep,
    progress: animationState.progress,
    currentDotProductSteps
  };
}
