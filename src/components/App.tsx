import React, { useEffect } from 'react';
import { Github, Calculator, Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { MatrixCard } from './MatrixCard';
import { ControlsPopover } from './ControlsPopover';
import { CurrentStepDisplay } from './CurrentStepDisplay';
import { useMatrixStore } from '../store/matrixStore';
import { useAnimator } from '../hooks/useAnimator';
import { validateMultiplication } from '../utils/matrixOperations';
import { FloatingNumber } from './FloatingNumber';

const App: React.FC = () => {
  const {
    matrixA,
    matrixB,
    matrixC,
    highlight,
    computeResult
  } = useMatrixStore();

  const {
    currentStep,
    play,
    pause,
    isPlaying,
    reset
  } = useAnimator();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      // If animation is complete (no current step), reset and start over
      if (!currentStep && matrixC) {
        // Reset Matrix C to zeros and restart animation
        computeResult(); // This recreates the empty matrix
        reset(); // Reset the animation state completely
      }
      play();
    }
  };

  // Auto-create empty Matrix C when matrices are valid
  useEffect(() => {
    if (matrixA && matrixB && matrixA.rows > 0 && matrixB.rows > 0) {
      const validation = validateMultiplication(matrixA, matrixB);
      if (validation.isValid) {
        computeResult(); // This now creates an empty Matrix C
      }
    }
  }, [matrixA, matrixB, computeResult]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FloatingNumber />
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Matrix Multiplication Calculator
                </h1>
                <p className="text-sm text-muted-foreground">
                  Interactive dot-product visualizer
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a
                  href="https://github.com/bradleybeesonml"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub"
                >
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/github_profile.jpeg" 
                      alt="Bradley Beeson" 
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <Github className="h-4 w-4" />
                  </div>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Top bar for controls and current step */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Matrices</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={handlePlayPause} variant="default">
              {isPlaying ? (
                <Pause className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isPlaying 
                ? 'Pause' 
                : (!currentStep && matrixC ? 'Restart Animation' : 'Play Animation')
              }
            </Button>
            <ControlsPopover />
          </div>
        </div>
        
        <div className="mb-8">
          <CurrentStepDisplay />
        </div>

        {/* Matrices Section - A, B, and C side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Matrix A */}
          <MatrixCard
            matrix={matrixA}
            matrixType="A"
            highlight={highlight.a}
            title="Matrix A"
            isReadOnly={false}
          />

          {/* Matrix B */}
          <MatrixCard
            matrix={matrixB}
            matrixType="B"
            highlight={highlight.b}
            title="Matrix B"
            isReadOnly={false}
          />

          {/* Result Matrix C */}
          {matrixC ? (
            <MatrixCard
              matrix={matrixC}
              matrixType="C"
              title="Result: C = A × B"
              isReadOnly={true}
              className="border-primary/20"
            />
          ) : (
            <div className="flex items-center justify-center text-muted-foreground bg-muted/30 rounded-lg">
              <span>Result matrix will appear here</span>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Built with React, TypeScript, Tailwind CSS, and Framer Motion
            </p>
            <p className="mt-1">
              Interactive matrix multiplication calculator with step-by-step visualization
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
