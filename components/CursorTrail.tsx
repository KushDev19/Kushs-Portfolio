'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface CursorTrailProps {
  enabled?: boolean;
}

export default function CursorTrail({ enabled = true }: CursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState('hero');

  // Section color mapping
  const sectionColors: { [key: string]: string[] } = {
    hero: ['#64ffda', '#00bfa5'],
    about: ['#64ffda', '#ff6b35'],
    skills: ['#00bfa5', '#64ffda'],
    projects: ['#ff6b35', '#ffd700'],
    github: ['#64ffda', '#00ff00'],
    contact: ['#ff6b35', '#64ffda'],
  };

  // Detect current section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = ['hero', 'about', 'skills', 'projects', 'github', 'contact'];
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Disable on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Create particles at mouse position
      const colors = sectionColors[currentSection] || sectionColors.hero;
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < 2; i++) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 60,
          maxLife: 60,
          size: Math.random() * 4 + 2,
          color,
        });
      }

      // Limit particle count
      if (particlesRef.current.length > 150) {
        particlesRef.current = particlesRef.current.slice(-150);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        const alpha = particle.life / particle.maxLife;

        if (particle.life > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
          ctx.fill();

          // Glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;
          ctx.fill();
          ctx.shadowBlur = 0;

          return true;
        }

        return false;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, currentSection]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
