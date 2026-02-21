import type { Mode } from '@/App';
import { SINGLE_OPERATIONS, DUAL_OPERATIONS } from '@/lib/matrix';
import {
  Grid3X3,
  ArrowRightLeft,
  Sigma,
  Divide,
  Activity,
  ListOrdered,
  Plus,
  Minus,
  X,
  Check,
  Zap
} from 'lucide-react';

interface CalculatorPanelProps {
  mode: Mode;
  selectedOp: string;
  onOpSelect: (op: string) => void;
  onCalculate: () => void;
}

export function CalculatorPanel({ mode, selectedOp, onOpSelect, onCalculate }: CalculatorPanelProps) {
  const operations = mode === 'single' ? SINGLE_OPERATIONS : DUAL_OPERATIONS;

  const getIcon = (id: string) => {
    switch (id) {
      case 'transpose': return <ArrowRightLeft className="w-5 h-5" />;
      case 'determinant': return <Sigma className="w-5 h-5" />;
      case 'adjoint': return <Grid3X3 className="w-5 h-5" />;
      case 'inverse': return <Divide className="w-5 h-5" />;
      case 'rank': return <Activity className="w-5 h-5" />;
      case 'ref': return <ListOrdered className="w-5 h-5" />;
      case 'rref': return <ListOrdered className="w-5 h-5 font-bold" />;
      case 'identity': return <Check className="w-5 h-5" />;
      case 'add': return <Plus className="w-5 h-5" />;
      case 'subtract': return <Minus className="w-5 h-5" />;
      case 'multiply': return <X className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-slate-400 text-xs font-mono uppercase tracking-widest">
        <Zap className="w-4 h-4 text-neon-amber" />
        <span>Operations Deck</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-6">
        {operations.map((op) => {
          const isSelected = selectedOp === op.id;
          return (
            <button
              key={op.id}
              onClick={() => onOpSelect(op.id)}
              className={`
                relative group flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300
                ${isSelected 
                  ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300 hover:bg-slate-800/60'
                }
              `}
            >
              <div className={`mb-2 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                {getIcon(op.id)}
              </div>
              <span className="text-xs font-semibold text-center">{op.label}</span>
              
              {/* Tooltip-ish description on hover if needed, or just keep clean */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <div className="p-4 rounded-lg bg-slate-950/30 border border-slate-800/50 mb-4 min-h-[60px]">
           <p className="text-xs text-slate-500 font-mono">
             {operations.find(op => op.id === selectedOp)?.description}
           </p>
        </div>

        <button
          onClick={onCalculate}
          className="w-full relative overflow-hidden group btn-primary py-4 text-lg tracking-wide uppercase font-bold shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Calculate
            <ArrowRightLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-white/20 to-neon-cyan/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
        </button>
      </div>
    </div>
  );
}
