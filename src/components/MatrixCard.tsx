import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { MatrixEditor } from './MatrixEditor';
import { useMatrixStore } from '../store/matrixStore';
import { Matrix, HighlightState } from '../types/matrix';

interface MatrixCardProps {
  matrix: Matrix;
  matrixType: 'A' | 'B' | 'C';
  highlight?: HighlightState;
  title: string;
  isReadOnly?: boolean;
  className?: string;
}

export const MatrixCard: React.FC<MatrixCardProps> = ({
  matrix,
  matrixType,
  highlight,
  title,
  isReadOnly = false,
  className
}) => {
  const { resizeMatrix, animationState } = useMatrixStore();
  
  // Check if editing is disabled during animation
  const isEditingDisabled = animationState.isPlaying || animationState.currentStep;

  const handleDimensionChange = (dimension: 'rows' | 'cols', value: string) => {
    if (isReadOnly) return;
    
    // Don't allow dimension changes during animation
    const { animationState } = useMatrixStore.getState();
    if (animationState.isPlaying || animationState.currentStep) return;
    
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > 10) return;

    if (matrixType !== 'C') {
      if (dimension === 'rows') {
        resizeMatrix(matrixType as 'A' | 'B', numValue, matrix.cols);
      } else {
        resizeMatrix(matrixType as 'A' | 'B', matrix.rows, numValue);
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="rounded-2xl shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-xl">
            {title}
          </CardTitle>
          
          {/* Dimension Controls - only show for editable matrices */}
          {!isReadOnly && (
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Input
                type="number"
                min="1"
                max="10"
                value={matrix.rows}
                onChange={(e) => handleDimensionChange('rows', e.target.value)}
                className="h-8 w-16 text-center text-sm"
                aria-label={`${title} rows`}
                disabled={!!isEditingDisabled}
              />
              <span className="text-sm text-muted-foreground">×</span>
              <Input
                type="number"
                min="1"
                max="10"
                value={matrix.cols}
                onChange={(e) => handleDimensionChange('cols', e.target.value)}
                className="h-8 w-16 text-center text-sm"
                aria-label={`${title} columns`}
                disabled={!!isEditingDisabled}
              />
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <MatrixEditor
            matrix={matrix}
            matrixType={matrixType}
            highlight={highlight}
            title={title}
            isReadOnly={isReadOnly}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
