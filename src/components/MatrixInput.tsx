import { useCallback, useRef, useEffect, useState } from 'react';
import type { Matrix } from '@/lib/matrix';

interface MatrixInputProps {
  label: string;
  rows: number;
  cols: number;
  matrix: Matrix;
  onMatrixChange: (matrix: Matrix) => void;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
  accentColor?: string;
}

export function MatrixInput({
  label,
  rows,
  cols,
  matrix,
  onMatrixChange,
  onRowsChange,
  onColsChange,
  accentColor = 'neon-cyan',
}: MatrixInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);
  // Local state to handle string input properly (allow "-", "0.", etc.)
  const [localGrid, setLocalGrid] = useState<string[][]>([]);

  // Sync local grid when matrix dimensions change or if external update happens
  // We use a simple strategy: if dimensions differ, reset. 
  // If values differ significantly, update local (unless focused?). 
  // For simplicity in this app, we trust the local state while editing, 
  // and sync from props only when dimensions change or "reset" happens (which usually changes reference).
  useEffect(() => {
    setLocalGrid(prev => {
      const newGrid: string[][] = [];
      for(let i=0; i<rows; i++) {
        const row: string[] = [];
        for(let j=0; j<cols; j++) {
           const propVal = matrix[i]?.[j] ?? 0;
           // If the grid was resized, we try to preserve what we can, else use propVal
           // To avoid overwriting user typing "0." with "0", we only sync if the numeric value is different
           // OR if the prev grid is not initialized at this cell
           const currentLocal = prev[i]?.[j];
           
           if (currentLocal === undefined) {
             row.push(propVal.toString());
           } else {
             const parsedLocal = parseFloat(currentLocal);
             // If local is valid number and matches prop, keep local to preserve format (e.g. "1.00")
             // If local is invalid (e.g. "-"), keep local
             if (!isNaN(parsedLocal) && Math.abs(parsedLocal - propVal) < 1e-9) {
               row.push(currentLocal);
             } else if (isNaN(parsedLocal) && currentLocal !== '' && currentLocal !== '-') {
                // If local is garbage, overwrite
                row.push(propVal.toString());
             } else if ((currentLocal === '' || currentLocal === '-') && propVal === 0) {
                 // Keep "empty" or "-" if the value is 0
                 row.push(currentLocal);
             } else {
                // Value changed externally (e.g. example loaded)
                row.push(propVal.toString());
             }
           }
        }
        newGrid.push(row);
      }
      return newGrid;
    });
    inputRefs.current = Array.from({ length: rows }, () => Array(cols).fill(null));
  }, [rows, cols, matrix]);

  const handleLocalChange = (i: number, j: number, value: string) => {
    const newGrid = [...localGrid];
    if (!newGrid[i]) newGrid[i] = []; // Should exist, but safety
    newGrid[i][j] = value;
    setLocalGrid(newGrid);

    // Parse
    let numVal = 0;
    const cleanValue = value.trim();
    if (cleanValue === '' || cleanValue === '-' || cleanValue === '.' || cleanValue === '-.') {
      numVal = 0;
    } else {
      const parsed = parseFloat(cleanValue);
      if (!isNaN(parsed)) numVal = parsed;
    }

    // Update parent
    if (matrix[i]?.[j] !== numVal) {
      const newMatrix = matrix.map(row => [...row]);
      if (!newMatrix[i]) newMatrix[i] = [];
      newMatrix[i][j] = numVal;
      onMatrixChange(newMatrix);
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, i: number, j: number) => {
      let nextI = i;
      let nextJ = j;

      switch (e.key) {
        case 'ArrowRight':
        case 'Tab':
          if (!e.shiftKey) {
            e.preventDefault();
            nextJ = j + 1;
            if (nextJ >= cols) {
              nextJ = 0;
              nextI = i + 1;
            }
          } else {
            e.preventDefault();
            nextJ = j - 1;
            if (nextJ < 0) {
              nextJ = cols - 1;
              nextI = i - 1;
            }
          }
          break;
        case 'ArrowLeft':
          nextJ = j - 1;
          if (nextJ < 0) {
            nextJ = cols - 1;
            nextI = i - 1;
          }
          break;
        case 'ArrowDown':
        case 'Enter':
          e.preventDefault();
          nextI = i + 1;
          break;
        case 'ArrowUp':
          nextI = i - 1;
          break;
        default:
          return;
      }

      if (nextI >= 0 && nextI < rows && nextJ >= 0 && nextJ < cols) {
        inputRefs.current[nextI]?.[nextJ]?.focus();
        inputRefs.current[nextI]?.[nextJ]?.select();
      }
    },
    [rows, cols]
  );

  const borderColorClass =
    accentColor === 'neon-purple'
      ? 'border-neon-purple/30 focus:border-neon-purple text-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.1)]'
      : 'border-neon-cyan/30 focus:border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.1)]';

  const bracketColor =
    accentColor === 'neon-purple'
      ? 'rgba(168, 85, 247, 0.6)'
      : 'rgba(0, 240, 255, 0.6)';

  return (
    <div className="animate-slide-up w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          {label}
        </h3>
        <div className="flex items-center gap-3 bg-slate-900/40 p-1 rounded-lg border border-white/5">
          <div className="flex items-center gap-1.5 px-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Rows</label>
            <select
              value={rows}
              onChange={e => onRowsChange(parseInt(e.target.value))}
              className="bg-transparent text-slate-300 text-xs font-mono font-bold focus:outline-none cursor-pointer hover:text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <option key={n} value={n} className="bg-slate-900">{n}</option>
              ))}
            </select>
          </div>
          <div className="w-px h-3 bg-slate-700"></div>
          <div className="flex items-center gap-1.5 px-2">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Cols</label>
            <select
              value={cols}
              onChange={e => onColsChange(parseInt(e.target.value))}
              className="bg-transparent text-slate-300 text-xs font-mono font-bold focus:outline-none cursor-pointer hover:text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <option key={n} value={n} className="bg-slate-900">{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="relative p-6 bg-slate-900/20 rounded-xl border border-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-slate-900/30 group">
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[size:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] rounded-xl" />

        <div className="flex justify-center overflow-x-auto custom-scrollbar pb-2">
          <div
            className="relative px-6 py-2"
          >
            {/* Left bracket */}
            <div
              className="absolute left-0 top-0 bottom-0 w-3 border-l-2 border-t-2 border-b-2 rounded-l-md transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]"
              style={{ borderColor: bracketColor }}
            />
            {/* Right bracket */}
            <div
              className="absolute right-0 top-0 bottom-0 w-3 border-r-2 border-t-2 border-b-2 rounded-r-md transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]"
              style={{ borderColor: bracketColor }}
            />

            <div className="flex flex-col gap-3">
              {localGrid.map((row, i) => (
                <div key={i} className="flex gap-3">
                  {row.map((val, j) => (
                    <input
                      key={`${i}-${j}`}
                      ref={el => {
                        if (!inputRefs.current[i]) inputRefs.current[i] = [];
                        inputRefs.current[i][j] = el;
                      }}
                      type="text"
                      inputMode="decimal"
                      className={`
                        w-16 sm:w-20 h-10 sm:h-12 
                        text-center font-mono text-sm sm:text-base font-medium
                        bg-slate-950/50 rounded-lg 
                        border transition-all duration-200
                        placeholder:text-slate-700
                        focus:ring-2 focus:ring-opacity-20 focus:scale-105 focus:z-10
                        ${borderColorClass}
                      `}
                      placeholder="0"
                      value={val}
                      onChange={e => handleLocalChange(i, j, e.target.value)}
                      onKeyDown={e => handleKeyDown(e, i, j)}
                      onFocus={e => e.target.select()}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
