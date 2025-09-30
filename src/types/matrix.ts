export interface Matrix {
  data: number[][];
  rows: number;
  cols: number;
}

export interface MatrixDimensions {
  rows: number;
  cols: number;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface HighlightState {
  row?: number;
  col?: number;
  activePair?: {
    a: CellPosition;
    b: CellPosition;
  };
}

export interface DotProductStep {
  i: number; // result row
  j: number; // result col
  k: number; // current multiplication index
  aValue: number; // A[i, k]
  bValue: number; // B[k, j]
  product: number; // A[i, k] * B[k, j]
  partialSum: number; // running sum up to k
  isComplete: boolean; // whether this completes the dot product
}

export interface AnimationState {
  isPlaying: boolean;
  speed: number; // steps per second
  currentStep: DotProductStep | null;
  stepMode: 'factor' | 'cell'; // step by factor or by complete cell
  progress: {
    currentCell: CellPosition | null;
    totalCells: number;
    completedCells: number;
  };
}

export interface MatrixState {
  matrixA: Matrix;
  matrixB: Matrix;
  matrixC: Matrix | null;
  dimensions: {
    m: number; // A rows
    n: number; // A cols / B rows
    p: number; // B cols
  };
  validation: {
    isValid: boolean;
    error?: string;
  };
  highlight: {
    a: HighlightState;
    b: HighlightState;
  };
  settings: {
    precision: number; // decimal places to show
  };
}

export interface PresetMatrix {
  name: string;
  description: string;
  matrixA: number[][];
  matrixB: number[][];
}

