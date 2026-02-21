import { Cpu } from 'lucide-react';

export function Header() {
  return (
    <header className="relative z-10">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center animate-pulse-glow">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-neon-green rounded-full border border-surface-dark animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                <span className="neon-text">Matrix</span>
                <span className="text-slate-300">Lab</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-600 font-mono tracking-widest uppercase">
                Advanced Linear Algebra Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 font-mono bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
              <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
