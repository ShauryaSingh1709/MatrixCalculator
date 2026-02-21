import { useState, useCallback, useMemo, useEffect } from 'react';
import { Snowfall } from '@/components/Snowfall';
import { GlowOrbs } from '@/components/Background';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MatrixInput } from '@/components/MatrixInput';
import { ResultDisplay } from '@/components/ResultDisplay';
import { CalculatorPanel } from '@/components/CalculatorPanel';
import {
  type Matrix,
  type OperationResult,
  SINGLE_OPERATIONS,
  DUAL_OPERATIONS,
  EXAMPLES,
  executeSingleOp,
  executeDualOp,
  zeroMatrix,
} from '@/lib/matrix';
import {
  RotateCcw,
  Sparkles,
  Calculator,
  Layers,
  ChevronDown,
  BookOpen,
  Sun,
  Moon,
} from 'lucide-react';

export type Mode = 'single' | 'dual';

function createMatrix(rows: number, cols: number): Matrix {
  return zeroMatrix(rows, cols);
}

export function App() {
  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Mode
  const [mode, setMode] = useState<Mode>('single');

  // Matrix A
  const [rowsA, setRowsA] = useState(3);
  const [colsA, setColsA] = useState(3);
  const [matrixA, setMatrixA] = useState<Matrix>(() => createMatrix(3, 3));

  // Matrix B
  const [rowsB, setRowsB] = useState(3);
  const [colsB, setColsB] = useState(3);
  const [matrixB, setMatrixB] = useState<Matrix>(() => createMatrix(3, 3));

  // Operation
  const [singleOp, setSingleOp] = useState('transpose');
  const [dualOp, setDualOp] = useState('add');

  // Results
  const [result, setResult] = useState<OperationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [computeTime, setComputeTime] = useState<number | null>(null);

  // Examples dropdown
  const [showExamples, setShowExamples] = useState(false);

  // Resize matrix A
  const handleRowsAChange = useCallback((newRows: number) => {
    setRowsA(newRows);
    setMatrixA(prev => {
      const newMatrix = createMatrix(newRows, colsA);
      for (let i = 0; i < Math.min(prev.length, newRows); i++) {
        for (let j = 0; j < Math.min(prev[0]?.length ?? 0, colsA); j++) {
          newMatrix[i][j] = prev[i][j];
        }
      }
      return newMatrix;
    });
  }, [colsA]);

  const handleColsAChange = useCallback((newCols: number) => {
    setColsA(newCols);
    setMatrixA(prev => {
      const newMatrix = createMatrix(rowsA, newCols);
      for (let i = 0; i < Math.min(prev.length, rowsA); i++) {
        for (let j = 0; j < Math.min(prev[0]?.length ?? 0, newCols); j++) {
          newMatrix[i][j] = prev[i][j];
        }
      }
      return newMatrix;
    });
  }, [rowsA]);

  // Resize matrix B
  const handleRowsBChange = useCallback((newRows: number) => {
    setRowsB(newRows);
    setMatrixB(prev => {
      const newMatrix = createMatrix(newRows, colsB);
      for (let i = 0; i < Math.min(prev.length, newRows); i++) {
        for (let j = 0; j < Math.min(prev[0]?.length ?? 0, colsB); j++) {
          newMatrix[i][j] = prev[i][j];
        }
      }
      return newMatrix;
    });
  }, [colsB]);

  const handleColsBChange = useCallback((newCols: number) => {
    setColsB(newCols);
    setMatrixB(prev => {
      const newMatrix = createMatrix(rowsB, newCols);
      for (let i = 0; i < Math.min(prev.length, rowsB); i++) {
        for (let j = 0; j < Math.min(prev[0]?.length ?? 0, newCols); j++) {
          newMatrix[i][j] = prev[i][j];
        }
      }
      return newMatrix;
    });
  }, [rowsB]);

  // Load example
  const loadExample = useCallback((name: string) => {
    const ex = EXAMPLES[name as keyof typeof EXAMPLES];
    if (!ex) return;

    const aRows = ex.a.length;
    const aCols = ex.a[0].length;
    setRowsA(aRows);
    setColsA(aCols);
    setMatrixA(ex.a.map(row => [...row]));

    const bRows = ex.b.length;
    const bCols = ex.b[0].length;
    setRowsB(bRows);
    setColsB(bCols);
    setMatrixB(ex.b.map(row => [...row]));

    setShowExamples(false);
    setResult(null);
    setError(null);
    setComputeTime(null);
  }, []);

  // Calculate
  const handleCalculate = useCallback(() => {
    setResult(null);
    setError(null);
    setComputeTime(null);

    const start = performance.now();

    try {
      let res: OperationResult;
      if (mode === 'single') {
        res = executeSingleOp(singleOp, matrixA);
      } else {
        res = executeDualOp(dualOp, matrixA, matrixB);
      }
      const elapsed = performance.now() - start;
      setResult(res);
      setComputeTime(elapsed);
    } catch (err) {
      const elapsed = performance.now() - start;
      setComputeTime(elapsed);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  }, [mode, singleOp, dualOp, matrixA, matrixB]);

  // Reset
  const handleReset = useCallback(() => {
    setRowsA(3);
    setColsA(3);
    setMatrixA(createMatrix(3, 3));
    setRowsB(3);
    setColsB(3);
    setMatrixB(createMatrix(3, 3));
    setResult(null);
    setError(null);
    setComputeTime(null);
  }, []);

  // Current operation info
  const currentOpInfo = useMemo(() => {
    if (mode === 'single') {
      return SINGLE_OPERATIONS.find(op => op.id === singleOp);
    }
    return DUAL_OPERATIONS.find(op => op.id === dualOp);
  }, [mode, singleOp, dualOp]);

  return (
    <div className="min-h-screen bg-surface-dark bg-grid-pattern relative transition-colors duration-500">
      <Snowfall />
      <GlowOrbs />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex items-center justify-between max-w-6xl mx-auto w-full px-4 pt-4">
           {/* Theme Toggle - Fixed bottom right */}
           
        </div>

        <Header />

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 pb-8">
          {/* Top Bar: Mode & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
            {/* Mode Tabs */}
            <div className="flex rounded-xl overflow-hidden border border-glass-border bg-glass-bg backdrop-blur-xl p-1 gap-1">
              <button
                onClick={() => { setMode('single'); setResult(null); setError(null); }}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
                  mode === 'single' 
                    ? 'bg-slate-800 text-neon-cyan shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Single Matrix</span>
              </button>
              <button
                onClick={() => { setMode('dual'); setResult(null); setError(null); }}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
                  mode === 'dual' 
                    ? 'bg-slate-800 text-neon-cyan shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Two Matrices</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="btn-secondary flex items-center gap-2 h-10"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Examples</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExamples ? 'rotate-180' : ''}`} />
                </button>

                {showExamples && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowExamples(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 w-64 glass-panel-strong p-2 animate-slide-up shadow-2xl border border-slate-700">
                      {Object.keys(EXAMPLES).map(name => (
                        <button
                          key={name}
                          onClick={() => loadExample(name)}
                          className="w-full text-left px-4 py-3 text-sm text-slate-400 hover:text-neon-cyan hover:bg-slate-800/50 rounded-lg transition-all duration-200 flex items-center gap-3 group"
                        >
                          <Sparkles className="w-4 h-4 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                          <span className="font-medium">{name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button onClick={handleReset} className="btn-danger flex items-center gap-2 h-10">
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Calculator Panel (Operations) */}
            <div className="lg:col-span-3 order-2 lg:order-1">
               <CalculatorPanel 
                 mode={mode}
                 selectedOp={mode === 'single' ? singleOp : dualOp}
                 onOpSelect={(op) => {
                    if (mode === 'single') setSingleOp(op);
                    else setDualOp(op);
                    setResult(null);
                    setError(null);
                 }}
                 onCalculate={handleCalculate}
               />
            </div>

            {/* Middle/Right Column: Inputs & Results */}
            <div className="lg:col-span-9 order-1 lg:order-2 space-y-6">
              
              {/* Inputs */}
              <div className={`grid grid-cols-1 ${mode === 'dual' ? 'md:grid-cols-2' : 'place-items-center'} gap-6`}>
                <div className={`glass-panel p-1 ${mode === 'single' ? 'w-full max-w-xl' : 'w-full'}`}>
                  <MatrixInput
                    label="Matrix A"
                    rows={rowsA}
                    cols={colsA}
                    matrix={matrixA}
                    onMatrixChange={setMatrixA}
                    onRowsChange={handleRowsAChange}
                    onColsChange={handleColsAChange}
                    accentColor="neon-cyan"
                  />
                </div>

                {mode === 'dual' && (
                  <div className="glass-panel p-1 animate-slide-in-right w-full">
                    <MatrixInput
                      label="Matrix B"
                      rows={rowsB}
                      cols={colsB}
                      matrix={matrixB}
                      onMatrixChange={setMatrixB}
                      onRowsChange={handleRowsBChange}
                      onColsChange={handleColsBChange}
                      accentColor="neon-purple"
                    />
                  </div>
                )}
              </div>

              {/* Results Area */}
              <div className="min-h-[200px]">
                {(result || error) ? (
                  <ResultDisplay
                    result={result}
                    error={error}
                    computeTimeMs={computeTime}
                  />
                ) : (
                  <EmptyState mode={mode} opLabel={currentOpInfo?.label ?? ''} />
                )}
              </div>
              
              {/* Quick Info */}
              <QuickInfoCards mode={mode} rowsA={rowsA} colsA={colsA} rowsB={rowsB} colsB={colsB} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function EmptyState({ mode, opLabel }: { mode: Mode; opLabel: string }) {
  return (
    <div className="glass-panel p-8 flex flex-col items-center justify-center text-center h-full border-dashed border-2 border-slate-800 bg-slate-900/20">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-4">
        <Sparkles className="w-7 h-7 text-slate-600" />
      </div>
      <h3 className="text-sm font-semibold text-slate-500 mb-1">
        Ready to Compute
      </h3>
      <p className="text-xs text-slate-600 max-w-xs">
        Select an operation from the deck and press Calculate.
      </p>
    </div>
  );
}

interface QuickInfoProps {
  mode: Mode;
  rowsA: number;
  colsA: number;
  rowsB: number;
  colsB: number;
}

function QuickInfoCards({ mode, rowsA, colsA, rowsB, colsB }: QuickInfoProps) {
  return (
    <div className={`grid ${mode === 'dual' ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
      <div className="glass-panel p-4 flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            <span className="text-xs font-bold text-slate-500 uppercase">Matrix A</span>
          </div>
          <div className="text-[10px] text-slate-600">
             {rowsA === colsA ? 'Square' : 'Rectangular'} Matrix
          </div>
        </div>
        <div className="font-mono text-xl font-bold text-slate-300 tracking-tighter">
          {rowsA}×{colsA}
        </div>
      </div>

      {mode === 'dual' && (
        <div className="glass-panel p-4 flex items-center justify-between animate-fade-in">
          <div>
             <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              <span className="text-xs font-bold text-slate-500 uppercase">Matrix B</span>
            </div>
            <div className="text-[10px] text-slate-600">
               {rowsB === colsB ? 'Square' : 'Rectangular'} Matrix
            </div>
          </div>
          <div className="font-mono text-xl font-bold text-slate-300 tracking-tighter">
            {rowsB}×{colsB}
          </div>
        </div>
      )}
    </div>
  );
}
