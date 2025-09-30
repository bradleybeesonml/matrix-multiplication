import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Matrix, HighlightState } from '../types/matrix';
import { formatNumber } from '../utils/matrixOperations';
import { useMatrixStore } from '../store/matrixStore';
import { cn } from '../lib/utils';

interface MatrixEditorProps {
  matrix: Matrix;
  matrixType: 'A' | 'B' | 'C';
  highlight?: HighlightState;
  title: string;
  isReadOnly?: boolean;
  className?: string;
}

interface EditableCellProps {
  value: number;
  row: number;
  col: number;
  matrixType: 'A' | 'B' | 'C';
  highlight?: HighlightState;
  isReadOnly: boolean;
  precision: number;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  row,
  col,
  matrixType,
  highlight,
  isReadOnly,
  precision
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const updateMatrixCell = useMatrixStore((state) => state.updateMatrixCell);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value.toString());
  }, [value]);

  const handleClick = () => {
    // Don't allow editing during animation
    if (!isReadOnly && !isEditingDisabled) {
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // TODO: Implement tab navigation between cells
    }
  };

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue)) {
      updateMatrixCell(matrixType, row, col, numValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSave();
  };

  // const isHighlightedRow = highlight?.row === row;
  // const isHighlightedCol = highlight?.col === col;
  let isActivePair = false;
  if (highlight?.activePair) {
    if (matrixType === 'A') {
      isActivePair = highlight.activePair.a.row === row && highlight.activePair.a.col === col;
    } else if (matrixType === 'B') {
      isActivePair = highlight.activePair.b.row === row && highlight.activePair.b.col === col;
    }
  }

  // Determine if this cell is part of the current dot product calculation
  const isDotProductCell = 
    (matrixType === 'A' && highlight?.row === row) ||
    (matrixType === 'B' && highlight?.col === col);

  // Check if editing is disabled during animation
  const { animationState } = useMatrixStore.getState();
  const isEditingDisabled = animationState.isPlaying || animationState.currentStep;

  const cellClasses = cn(
    'matrix-cell',
    {
      'dot-product-cell': isDotProductCell && !isActivePair,
      'active-pair': isActivePair,
      'cursor-pointer': !isReadOnly && !isEditingDisabled,
      'cursor-default': isReadOnly || isEditingDisabled,
      'opacity-75': isEditingDisabled && !isReadOnly,
    }
  );

  return (
    <motion.div
      id={`matrix-cell-${matrixType}-${row}-${col}`}
      className={cellClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isReadOnly ? -1 : 0}
      role="gridcell"
      aria-label={`Cell ${row + 1}, ${col + 1}: ${formatNumber(value, precision)}`}
      whileHover={!isReadOnly ? { scale: 1.05 } : undefined}
      whileTap={!isReadOnly ? { scale: 0.95 } : undefined}
      animate={isActivePair ? { scale: [1, 1.1, 1] } : undefined}
      transition={{ duration: 0.3 }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full text-center bg-transparent border-none outline-none font-mono"
          aria-label={`Editing cell ${row + 1}, ${col + 1}`}
        />
      ) : (
        <span className="font-mono text-sm font-medium">
          {formatNumber(value, precision)}
        </span>
      )}
    </motion.div>
  );
};

export const MatrixEditor: React.FC<MatrixEditorProps> = ({
  matrix,
  matrixType,
  highlight,
  title,
  isReadOnly = false,
  className
}) => {
  const { settings } = useMatrixStore();
  const { precision } = settings;

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {matrix.rows} × {matrix.cols}
        </p>
        
        {/* Highlight indicator */}
        {highlight && (
          <div className="mt-2 text-xs">
            {matrixType === 'A' && highlight.row !== undefined && (
              <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                Row {highlight.row + 1} highlighted
              </span>
            )}
            {matrixType === 'B' && highlight.col !== undefined && (
              <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded ml-2">
                Column {highlight.col + 1} highlighted
              </span>
            )}
          </div>
        )}
      </div>

      <div 
        className="grid gap-1 p-4 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20"
        style={{
          gridTemplateColumns: `repeat(${matrix.cols}, 1fr)`,
          gridTemplateRows: `repeat(${matrix.rows}, 1fr)`,
        }}
        role="grid"
        aria-label={`${title} matrix`}
      >
        {matrix.data.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <EditableCell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              row={rowIndex}
              col={colIndex}
              matrixType={matrixType}
              highlight={highlight}
              isReadOnly={isReadOnly}
              precision={precision}
            />
          ))
        )}
      </div>

    </div>
  );
};
