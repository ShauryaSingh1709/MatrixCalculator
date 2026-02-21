import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-glass-border mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-mono">MatrixLab</span>
            <span>·</span>
            <span>Advanced Matrix Calculator</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-600">
              Built with <Heart className="w-3 h-3 text-neon-pink" /> by
              <span className="text-slate-400 font-medium">Your Name</span>
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-400 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/50">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-slate-700 font-mono">
            <span>Gaussian Elimination</span>
            <span>·</span>
            <span>Gauss-Jordan</span>
            <span>·</span>
            <span>Partial Pivoting</span>
            <span>·</span>
            <span>Pure JavaScript</span>
            <span>·</span>
            <span>Zero Dependencies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
