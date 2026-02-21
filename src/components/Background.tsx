import { useEffect, useRef } from 'react';

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let columns: number[] = [];
    const chars = '0123456789+-×÷=∑∫∂∆πλσΩ∞≈≠≤≥'.split('');
    const fontSize = 14;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const colCount = Math.floor(canvas.width / fontSize);
      columns = Array(colCount).fill(0).map(() => Math.random() * canvas.height / fontSize);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(11, 15, 26, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < columns.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = columns[i] * fontSize;

        const opacity = 0.03 + Math.random() * 0.06;
        const hue = 180 + Math.random() * 40;
        ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${opacity})`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          columns[i] = 0;
        }
        columns[i] += 0.3 + Math.random() * 0.3;
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}

export function GlowOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-purple/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-neon-pink/3 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '3s' }} />
    </div>
  );
}
