'use client';

import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function MatrixRain({ isActive, onComplete }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationFrameId: number;

    function draw() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#64ffda';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    // Auto-complete after 5 seconds
    const timeout = setTimeout(() => {
      onComplete?.();
    }, 5000);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[110] pointer-events-none animate-fade-in">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'rgba(10, 25, 47, 0.3)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-8 bg-almostBlack/80 border-2 border-cyan rounded-lg backdrop-blur-sm animate-zoom-in">
          <h2 className="text-4xl font-heading font-bold text-gradient mb-4">
            KONAMI CODE ACTIVATED!
          </h2>
          <p className="text-cyan font-mono text-xl">
            You've unlocked the Matrix! 🎮
          </p>
          <p className="text-slate/70 font-mono text-sm mt-2">
            Achievement: Code Master
          </p>
        </div>
      </div>
    </div>
  );
}
