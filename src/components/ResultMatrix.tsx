import React from 'react';
import { Matrix } from '../types/matrix';
import { MatrixEditor } from './MatrixEditor';

interface ResultMatrixProps {
  matrix: Matrix;
  title?: string;
  className?: string;
}

export const ResultMatrix: React.FC<ResultMatrixProps> = ({
  matrix,
  title = "Result Matrix",
  className
}) => {
  return (
    <MatrixEditor
      matrix={matrix}
      matrixType="C"
      title={title}
      isReadOnly={true}
      className={className}
    />
  );
};
