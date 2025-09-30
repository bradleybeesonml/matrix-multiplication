import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Matrix, MatrixState, AnimationState, HighlightState, DotProductStep } from '../types/matrix';
import {
  createMatrix,
  validateMultiplication,
  resizeMatrix,
  PRESET_MATRICES
} from '../utils/matrixOperations';

interface FloatingNumberState {
  isVisible: boolean;
  value: number | null;
  startPosition: { x: number; y: number } | null;
  endPosition: { x: number; y: number } | null;
}

interface MatrixStore extends MatrixState {
  // Matrix operations
  updateMatrixA: (matrix: Matrix) => void;
  updateMatrixB: (matrix: Matrix) => void;
  updateMatrixCell: (matrix: 'A' | 'B' | 'C', row: number, col: number, value: number) => void;
  resizeMatrix: (matrix: 'A' | 'B', rows: number, cols: number) => void;
  loadPreset: (preset: typeof PRESET_MATRICES[0]) => void;
  
  // Result computation
  computeResult: () => void;
  clearResult: () => void;
  
  // Floating Number Animation
  floatingNumber: FloatingNumberState;
  triggerFloatingNumber: (value: number, startElementId: string, endElementId: string) => void;
  hideFloatingNumber: () => void;

  // Highlighting
  setHighlight: (matrix: 'A' | 'B', highlight: HighlightState) => void;
  clearHighlight: (matrix: 'A' | 'B') => void;
  
  // Settings
  setPrecision: (precision: number) => void;
  
  // Animation state
  animationState: AnimationState;
  setAnimationState: (state: Partial<AnimationState>) => void;
  currentDotProductSteps: DotProductStep[];
  setCurrentDotProductSteps: (steps: DotProductStep[]) => void;
  
  // Animation controls
  playAnimation: () => void;
  pauseAnimation: () => void;
  resetAnimation: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setSpeed: (speed: number) => void;
  setStepMode: (mode: 'factor' | 'cell') => void;
}

const initialAnimationState: AnimationState = {
  isPlaying: false,
  speed: 1,
  currentStep: null,
  stepMode: 'factor',
  progress: {
    currentCell: null,
    totalCells: 0,
    completedCells: 0
  }
};

export const useMatrixStore = create<MatrixStore>()(
  persist(
    (set, get) => ({
      // Initial state
      matrixA: createMatrix(2, 3),
      matrixB: createMatrix(3, 2),
      matrixC: null,
      dimensions: { m: 2, n: 3, p: 2 },
      validation: { isValid: true },
      highlight: {
        a: {},
        b: {}
      },
      settings: {
        precision: 2
      },
      animationState: initialAnimationState,
      currentDotProductSteps: [],
      floatingNumber: {
        isVisible: false,
        value: null,
        startPosition: null,
        endPosition: null
      },

      // Matrix operations
      updateMatrixA: (matrix: Matrix) => {
        const validation = validateMultiplication(matrix, get().matrixB);
        set((state) => ({
          matrixA: matrix,
          dimensions: { m: matrix.rows, n: matrix.cols, p: state.matrixB.cols },
          validation,
          matrixC: validation.isValid ? createMatrix(matrix.rows, state.matrixB.cols, 0) : null
        }));
      },

      updateMatrixB: (matrix: Matrix) => {
        const validation = validateMultiplication(get().matrixA, matrix);
        set((state) => ({
          matrixB: matrix,
          dimensions: { m: state.matrixA.rows, n: state.matrixA.cols, p: matrix.cols },
          validation,
          matrixC: validation.isValid ? createMatrix(state.matrixA.rows, matrix.cols, 0) : null
        }));
      },

      updateMatrixCell: (matrix: 'A' | 'B' | 'C', row: number, col: number, value: number) => {
        if (matrix === 'A') {
          const currentMatrix = get().matrixA;
          const updatedMatrix = {
            data: currentMatrix.data.map((r, i) => 
              r.map((c, j) => (i === row && j === col) ? value : c)
            ),
            rows: currentMatrix.rows,
            cols: currentMatrix.cols
          };
          get().updateMatrixA(updatedMatrix);
        } else if (matrix === 'B') {
          const currentMatrix = get().matrixB;
          const updatedMatrix = {
            data: currentMatrix.data.map((r, i) => 
              r.map((c, j) => (i === row && j === col) ? value : c)
            ),
            rows: currentMatrix.rows,
            cols: currentMatrix.cols
          };
          get().updateMatrixB(updatedMatrix);
        } else if (matrix === 'C') {
          // Only allow updating Matrix C during animation
          const currentMatrix = get().matrixC;
          if (currentMatrix) {
            const updatedMatrix = {
              data: currentMatrix.data.map((r, i) => 
                r.map((c, j) => (i === row && j === col) ? value : c)
              ),
              rows: currentMatrix.rows,
              cols: currentMatrix.cols
            };
            set({ matrixC: updatedMatrix });
          }
        }
      },

      resizeMatrix: (matrix: 'A' | 'B', rows: number, cols: number) => {
        const currentMatrix = matrix === 'A' ? get().matrixA : get().matrixB;
        const resizedMatrix = resizeMatrix(currentMatrix, rows, cols);
        
        if (matrix === 'A') {
          get().updateMatrixA(resizedMatrix);
        } else {
          get().updateMatrixB(resizedMatrix);
        }
      },


      loadPreset: (preset: typeof PRESET_MATRICES[0]) => {
        const matrixA: Matrix = {
          data: preset.matrixA,
          rows: preset.matrixA.length,
          cols: preset.matrixA[0].length
        };
        const matrixB: Matrix = {
          data: preset.matrixB,
          rows: preset.matrixB.length,
          cols: preset.matrixB[0].length
        };
        
        get().updateMatrixA(matrixA);
        get().updateMatrixB(matrixB);
        get().computeResult();
      },

      // Result computation
      computeResult: () => {
        const { matrixA, matrixB, validation } = get();
        if (validation.isValid) {
          try {
            // Create a zero-filled result matrix for animation
            const result = createMatrix(matrixA.rows, matrixB.cols, 0);
            set({ matrixC: result });
          } catch (error) {
            console.error('Error computing matrix multiplication:', error);
          }
        }
      },

      clearResult: () => {
        set({ matrixC: null });
      },

      // Floating Number Animation
      triggerFloatingNumber: (value, startElementId, endElementId) => {
        const startEl = document.getElementById(startElementId);
        const endEl = document.getElementById(endElementId);

        if (startEl && endEl) {
          const startRect = startEl.getBoundingClientRect();
          const endRect = endEl.getBoundingClientRect();

          set({
            floatingNumber: {
              isVisible: true,
              value,
              startPosition: { 
                x: startRect.left + startRect.width / 2, 
                y: startRect.top + startRect.height / 2 
              },
              endPosition: { 
                x: endRect.left + endRect.width / 2, 
                y: endRect.top + endRect.height / 2 
              },
            },
          });
        }
      },

      hideFloatingNumber: () => {
        set((state) => ({
          floatingNumber: {
            ...state.floatingNumber,
            isVisible: false,
            value: null,
            startPosition: null,
            endPosition: null
          }
        }));
      },

      // Highlighting
      setHighlight: (matrix: 'A' | 'B', highlight: HighlightState) => {
        set((state) => ({
          highlight: {
            ...state.highlight,
            [matrix.toLowerCase()]: highlight
          }
        }));
      },

      clearHighlight: (matrix: 'A' | 'B') => {
        set((state) => ({
          highlight: {
            ...state.highlight,
            [matrix.toLowerCase()]: {}
          }
        }));
      },

      // Settings
      setPrecision: (precision: number) => {
        set((state) => ({
          settings: { ...state.settings, precision }
        }));
      },

      // Animation state
      setAnimationState: (state: Partial<AnimationState>) => {
        set((current) => ({
          animationState: { ...current.animationState, ...state }
        }));
      },

      setCurrentDotProductSteps: (steps: DotProductStep[]) => {
        set({ currentDotProductSteps: steps });
      },

      // Animation controls
      playAnimation: () => {
        set((state) => ({
          animationState: { ...state.animationState, isPlaying: true }
        }));
      },

      pauseAnimation: () => {
        set((state) => ({
          animationState: { ...state.animationState, isPlaying: false }
        }));
      },

      resetAnimation: () => {
        set({
          animationState: initialAnimationState,
          currentDotProductSteps: [],
          highlight: { a: {}, b: {} },
          floatingNumber: {
            isVisible: false,
            value: null,
            startPosition: null,
            endPosition: null
          }
        });
      },

      stepForward: () => {
        // Implementation will be added when animation logic is created
      },

      stepBackward: () => {
        // Implementation will be added when animation logic is created
      },

      setSpeed: (speed: number) => {
        set((state) => ({
          animationState: { ...state.animationState, speed }
        }));
      },

      setStepMode: (mode: 'factor' | 'cell') => {
        set((state) => ({
          animationState: { ...state.animationState, stepMode: mode }
        }));
      }
    }),
    {
      name: 'matrix-calculator-storage',
      partialize: (state) => ({
        matrixA: state.matrixA,
        matrixB: state.matrixB
      })
    }
  )
);
