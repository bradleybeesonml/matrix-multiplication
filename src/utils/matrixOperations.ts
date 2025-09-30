import { Matrix, DotProductStep, PresetMatrix } from '../types/matrix';

/**
 * Creates a new matrix with the specified dimensions
 */
export function createMatrix(rows: number, cols: number, fillValue: number = 0): Matrix {
  const data = Array(rows).fill(null).map(() => Array(cols).fill(fillValue));
  return { data, rows, cols };
}


/**
 * Validates if two matrices can be multiplied
 */
export function validateMultiplication(a: Matrix, b: Matrix): { isValid: boolean; error?: string } {
  if (a.cols !== b.rows) {
    return {
      isValid: false,
      error: `Cannot multiply ${a.rows}×${a.cols} matrix with ${b.rows}×${b.cols} matrix. A's columns (${a.cols}) must equal B's rows (${b.rows}).`
    };
  }
  return { isValid: true };
}

/**
 * Multiplies two matrices and returns the result
 */
export function multiplyMatrices(a: Matrix, b: Matrix): Matrix {
  const validation = validateMultiplication(a, b);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const result = createMatrix(a.rows, b.cols);
  
  for (let i = 0; i < a.rows; i++) {
    for (let j = 0; j < b.cols; j++) {
      let sum = 0;
      for (let k = 0; k < a.cols; k++) {
        sum += a.data[i][k] * b.data[k][j];
      }
      result.data[i][j] = sum;
    }
  }
  
  return result;
}

/**
 * Generates a step-by-step dot product calculation
 */
export function generateDotProductSteps(a: Matrix, b: Matrix, resultRow: number, resultCol: number): DotProductStep[] {
  const steps: DotProductStep[] = [];
  let partialSum = 0;

  for (let k = 0; k < a.cols; k++) {
    const aValue = a.data[resultRow][k];
    const bValue = b.data[k][resultCol];
    const product = aValue * bValue;
    partialSum += product;

    steps.push({
      i: resultRow,
      j: resultCol,
      k,
      aValue,
      bValue,
      product,
      partialSum,
      isComplete: k === a.cols - 1
    });
  }

  return steps;
}


/**
 * Clones a matrix
 */
export function cloneMatrix(matrix: Matrix): Matrix {
  return {
    data: matrix.data.map(row => [...row]),
    rows: matrix.rows,
    cols: matrix.cols
  };
}

/**
 * Updates a single cell in a matrix
 */
export function updateMatrixCell(matrix: Matrix, row: number, col: number, value: number): Matrix {
  const newMatrix = cloneMatrix(matrix);
  newMatrix.data[row][col] = value;
  return newMatrix;
}

/**
 * Resizes a matrix to new dimensions
 */
export function resizeMatrix(matrix: Matrix, newRows: number, newCols: number): Matrix {
  const newMatrix = createMatrix(newRows, newCols);
  
  // Copy existing data
  for (let i = 0; i < Math.min(matrix.rows, newRows); i++) {
    for (let j = 0; j < Math.min(matrix.cols, newCols); j++) {
      newMatrix.data[i][j] = matrix.data[i][j];
    }
  }
  
  return newMatrix;
}

/**
 * Formats a number for display with specified precision
 */
export function formatNumber(value: number, precision: number = 2): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(precision);
}


/**
 * Preset matrices for quick testing
 */
export const PRESET_MATRICES: PresetMatrix[] = [
  {
    name: "2×3 × 3×2 Example",
    description: "Simple example: A(2×3) × B(3×2) = C(2×2)",
    matrixA: [
      [1, 2, 3],
      [4, 5, 6]
    ],
    matrixB: [
      [7, 8],
      [9, 10],
      [11, 12]
    ]
  },
  {
    name: "Identity Test",
    description: "A × I = A (where I is identity matrix)",
    matrixA: [
      [1, 2],
      [3, 4]
    ],
    matrixB: [
      [1, 0],
      [0, 1]
    ]
  },
  {
    name: "Zero Matrix",
    description: "A × 0 = 0",
    matrixA: [
      [1, 2, 3],
      [4, 5, 6]
    ],
    matrixB: [
      [0, 0],
      [0, 0],
      [0, 0]
    ]
  },
  {
    name: "Large Example",
    description: "3×4 × 4×3 example with varied values",
    matrixA: [
      [2, -1, 3, 0],
      [1, 4, -2, 1],
      [0, 2, 1, -3]
    ],
    matrixB: [
      [1, 0, -1],
      [2, 3, 0],
      [-1, 2, 1],
      [0, -1, 2]
    ]
  }
];
