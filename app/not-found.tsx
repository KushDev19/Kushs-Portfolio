'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export default function NotFound() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  // Glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...konamiSequence, e.key].slice(-10);
      setKonamiSequence(newSequence);

      if (newSequence.join(',') === konamiCode.join(',')) {
        setKonamiActivated(true);

        // Epic animation
        gsap.to('.secret-message', {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'elastic.out(1, 0.3)',
        });

        gsap.to('.particle', {
          y: -500,
          opacity: 0,
          duration: 2,
          stagger: 0.05,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiSequence]);

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 107, 53, 0.3)';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-almostBlack relative overflow-hidden flex items-center justify-center">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 text-center px-6">
        {/* 404 with glitch effect */}
        <div
          ref={titleRef}
          className={`text-9xl md:text-[200px] font-heading font-bold mb-8 relative ${
            glitchActive ? 'animate-glitch' : ''
          }`}
        >
          <span className="text-gradient">404</span>
          {glitchActive && (
            <>
              <span
                className="absolute inset-0 text-cyan opacity-70"
                style={{ transform: 'translate(-4px, 2px)' }}
              >
                404
              </span>
              <span
                className="absolute inset-0 text-orange opacity-70"
                style={{ transform: 'translate(4px, -2px)' }}
              >
                404
              </span>
            </>
          )}
        </div>

        {/* Mission Failed */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-cyan mb-4">
            MISSION FAILED
          </h1>
          <p className="text-xl md:text-2xl text-slate/80 font-mono">
            The page you're looking for has been{' '}
            <span className="text-orange">terminated</span>
          </p>
        </div>

        {/* Error details */}
        <div className="mb-12 p-6 bg-deepBlue/30 border border-cyan/20 rounded-lg backdrop-blur-sm max-w-2xl mx-auto">
          <div className="font-mono text-sm text-left">
            <div className="text-green-500 mb-2">
              <span className="text-orange">{'>'}</span> STATUS: PAGE_NOT_FOUND
            </div>
            <div className="text-green-500/80 mb-2">
              <span className="text-orange">{'>'}</span> ERROR_CODE: 404
            </div>
            <div className="text-green-500/60 mb-2">
              <span className="text-orange">{'>'}</span> SUGGESTION: RETURN_TO_BASE
            </div>
            <div className="text-green-500/40">
              <span className="text-orange">{'>'}</span> HINT: Try the Konami code...
            </div>
          </div>
        </div>

        {/* Return home button */}
        <Link
          href="/"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan/20 to-orange/20 border-2 border-cyan/50 rounded-lg font-mono font-bold text-cyan hover:border-orange hover:shadow-[0_0_40px_rgba(100,255,218,0.4)] transition-all duration-300 hover:scale-105"
        >
          <svg
            className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-lg">RETURN TO BASE</span>
        </Link>

        {/* Secret message (Konami code activated) */}
        {konamiActivated && (
          <div className="secret-message absolute inset-0 flex items-center justify-center opacity-0 scale-0 pointer-events-none">
            <div className="p-8 bg-gradient-to-br from-cyan/30 to-orange/30 border-4 border-gradient-to-r border-cyan rounded-lg backdrop-blur-md">
              <div className="text-6xl md:text-8xl font-heading font-bold mb-4">
                <span className="text-gradient">KONAMI CODE!</span>
              </div>
              <p className="text-2xl font-mono text-cyan">
                You found the secret! 🎮
              </p>
              <p className="text-lg font-mono text-slate/80 mt-2">
                Achievement Unlocked: True Gamer
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        .animate-glitch {
          animation: glitch 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
