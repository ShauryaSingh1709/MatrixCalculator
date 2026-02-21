import { useEffect, useRef } from 'react';

export function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const snowflakes: { x: number; y: number; r: number; d: number }[] = [];
    const maxFlakes = 100;

    for (let i = 0; i < maxFlakes; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1, // radius
        d: Math.random() * maxFlakes, // density
      });
    }

    let animationId: number;
    let angle = 0;

    function draw() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);
      
      const isLight = document.documentElement.classList.contains('light');
      ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.2)' : 'rgba(255, 255, 255, 0.4)';
      
      ctx.beginPath();

      angle += 0.01;

      for (let i = 0; i < maxFlakes; i++) {
        const p = snowflakes[i];
        
        // Update coordinates
        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
        p.x += Math.sin(angle) * 2;

        // Wrap around
        if (p.x > width + 5 || p.x < -5 || p.y > height) {
          if (i % 3 > 0) { // 66.67% of the flakes
            snowflakes[i] = { x: Math.random() * width, y: -10, r: p.r, d: p.d };
          } else {
            // If the flake is exitting from the right
            if (Math.sin(angle) > 0) {
              // Enter from the left
              snowflakes[i] = { x: -5, y: Math.random() * height, r: p.r, d: p.d };
            } else {
              // Enter from the right
              snowflakes[i] = { x: width + 5, y: Math.random() * height, r: p.r, d: p.d };
            }
          }
        }

        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      }
      
      ctx.fill();
      animationId = requestAnimationFrame(draw);
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    window.addEventListener('resize', handleResize);
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
    />
  );
}
