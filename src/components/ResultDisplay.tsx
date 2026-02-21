import { formatNumber, type OperationResult } from '@/lib/matrix';
import { CheckCircle, XCircle, Hash, Grid3X3 } from 'lucide-react';

interface ResultDisplayProps {
  result: OperationResult | null;
  error: string | null;
  computeTimeMs: number | null;
}

export function ResultDisplay({ result, error, computeTimeMs }: ResultDisplayProps) {
  if (error) {
    return (
      <div className="animate-slide-up">
        <div className="glass-panel p-6 border-neon-red/20 toast-error">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-neon-red flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-neon-red font-semibold text-sm mb-1">Operation Failed</h4>
              <p className="text-red-300/80 text-sm leading-relaxed">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="animate-slide-up">
      <div className="glass-panel p-6 neon-border animate-pulse-glow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {result.type === 'matrix' ? (
              <Grid3X3 className="w-4 h-4 text-neon-cyan" />
            ) : result.type === 'scalar' ? (
              <Hash className="w-4 h-4 text-neon-cyan" />
            ) : (
              <CheckCircle className="w-4 h-4 text-neon-cyan" />
            )}
            <h3 className="text-sm font-semibold text-neon-cyan tracking-wide">
              {result.label}
            </h3>
          </div>
          {computeTimeMs !== null && (
            <span className="text-[10px] font-mono text-slate-600 bg-slate-800/50 px-2 py-1 rounded-full">
              {computeTimeMs < 1 ? '<1' : computeTimeMs.toFixed(1)}ms
            </span>
          )}
        </div>

        {result.type === 'matrix' && (
          <MatrixResultView matrix={result.matrix} />
        )}

        {result.type === 'scalar' && (
          <ScalarResultView value={result.value} label={result.label} />
        )}

        {result.type === 'boolean' && (
          <BooleanResultView value={result.value} message={result.message} />
        )}

        {result.steps && result.steps.length > 0 && (
          <div className="mt-6 border-t border-slate-700/50 pt-4 animate-fade-in">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Step-by-Step Explanation
            </h4>
            <div className="bg-slate-950/50 rounded-lg p-4 font-mono text-xs text-slate-400 space-y-2 max-h-60 overflow-y-auto custom-scrollbar border border-slate-800/50">
              {result.steps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-slate-600 select-none">{(index + 1).toString().padStart(2, '0')}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MatrixResultView({ matrix }: { matrix: number[][] }) {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;

  return (
    <div>
      <div className="flex justify-center overflow-x-auto py-2">
        <div className="relative px-5 py-3">
          {/* Left bracket */}
          <div className="absolute left-0 top-0 bottom-0 w-2 border-l-2 border-t-2 border-b-2 rounded-l-sm border-neon-cyan/50" />
          {/* Right bracket */}
          <div className="absolute right-0 top-0 bottom-0 w-2 border-r-2 border-t-2 border-b-2 rounded-r-sm border-neon-cyan/50" />

          <div className="flex flex-col gap-2">
            {matrix.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((val, j) => (
                  <div key={j} className="result-cell animate-fade-in" style={{ animationDelay: `${(i * cols + j) * 30}ms` }}>
                    {formatNumber(val)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-slate-600 mt-2 font-mono">
        Result: {rows} × {cols}
      </p>
    </div>
  );
}

function ScalarResultView({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center py-6">
      <div className="text-4xl font-mono font-bold neon-text mb-2">
        {value}
      </div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
    </div>
  );
}

function BooleanResultView({ value, message }: { value: boolean; message: string }) {
  return (
    <div className="flex flex-col items-center py-6">
      <div className="mb-3">
        {value ? (
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/30">
            <CheckCircle className="w-8 h-8 text-neon-green" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-neon-red/10 border border-neon-red/30">
            <XCircle className="w-8 h-8 text-neon-red" />
          </div>
        )}
      </div>
      <p className={`text-sm font-medium ${value ? 'text-neon-green' : 'text-red-400'}`}>
        {message}
      </p>
    </div>
  );
}
