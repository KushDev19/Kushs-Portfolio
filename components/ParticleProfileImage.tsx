'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  orbitAngle: number;
  orbitSpeed: number;
  orbitRadius: number;
}

interface ParticleProfileImageProps {
  imageSrc: string;
  className?: string;
}

export default function ParticleProfileImage({
  imageSrc,
  className = '',
}: ParticleProfileImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Create particles
    const colors = ['#64ffda', '#ff6b35'];
    const particleCount = 120;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 200 + 100;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      particlesRef.current.push({
        x,
        y,
        targetX: centerX + Math.cos(angle) * (150 + Math.random() * 50),
        targetY: centerY + Math.sin(angle) * (150 + Math.random() * 50),
        vx: 0,
        vy: 0,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0,
        orbitAngle: angle,
        orbitSpeed: (Math.random() - 0.5) * 0.01,
        orbitRadius: 150 + Math.random() * 50,
      });
    }

    // Animate particles appearing
    gsap.to(particlesRef.current, {
      alpha: 0.8,
      duration: 2,
      delay: 0.5,
      stagger: 0.02,
      ease: 'power2.out',
    });

    setIsLoaded(true);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particlesRef.current.forEach((particle, i) => {
        // Orbit animation
        particle.orbitAngle += particle.orbitSpeed;
        const targetX = centerX + Math.cos(particle.orbitAngle) * particle.orbitRadius;
        const targetY = centerY + Math.sin(particle.orbitAngle) * particle.orbitRadius;

        // Add some floating motion
        const floatX = Math.sin(time * 2 + i * 0.1) * 3;
        const floatY = Math.cos(time * 1.5 + i * 0.15) * 3;

        particle.targetX = targetX + floatX;
        particle.targetY = targetY + floatY;

        // Smooth movement
        particle.vx += (particle.targetX - particle.x) * 0.02;
        particle.vy += (particle.targetY - particle.y) * 0.02;
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const force = (120 - dist) / 120;
          particle.x -= (dx / dist) * force * 5;
          particle.y -= (dy / dist) * force * 5;
        }

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3
        );
        gradient.addColorStop(0, particle.color + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, particle.color + '40');
        gradient.addColorStop(1, particle.color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw core particle
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw connections
        if (i % 2 === 0) {
          particlesRef.current.slice(i + 1, i + 5).forEach((other) => {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = particle.color;
              ctx.globalAlpha = (1 - distance / 80) * particle.alpha * 0.3;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          });
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoaded]);

  // Animate image layer on mount
  useEffect(() => {
    if (imageLayerRef.current) {
      gsap.fromTo(
        imageLayerRef.current,
        {
          scale: 0.8,
          opacity: 0,
          y: 50,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.5,
          delay: 0.3,
          ease: 'power3.out',
        }
      );

      // Continuous floating animation
      gsap.to(imageLayerRef.current, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square max-w-md mx-auto ${className}`}
    >
      {/* Background blob shape */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute w-[85%] h-[90%] opacity-20"
          style={{
            background: 'linear-gradient(135deg, #64ffda 0%, #ff6b35 100%)',
            borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
            animation: 'morph 8s ease-in-out infinite',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Particle canvas - Behind image */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Organic shape container for bottom layer */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 2 }}
      >
        <div
          className="relative w-[70%] h-[75%]"
          style={{
            background: 'linear-gradient(135deg, rgba(100, 255, 218, 0.15) 0%, rgba(255, 107, 53, 0.15) 100%)',
            borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(100, 255, 218, 0.3)',
            boxShadow: '0 0 60px rgba(100, 255, 218, 0.2), inset 0 0 60px rgba(100, 255, 218, 0.1)',
            animation: 'morph 8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Profile Image Layer - 3D layered effect */}
      <div
        ref={imageLayerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          zIndex: 3,
          transform: 'translateZ(50px)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative w-[75%] h-[80%]">
          {/* Image with mask to create cut effect */}
          <img
            src={imageSrc}
            alt="Profile"
            className="w-full h-full object-contain object-center"
            style={{
              filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 20px rgba(100, 255, 218, 0.3))',
              clipPath: 'polygon(0 0, 100% 0, 100% 85%, 75% 92%, 50% 88%, 25% 92%, 0 85%)',
            }}
            onLoad={() => setIsLoaded(true)}
          />

          {/* Top highlight layer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(100, 255, 218, 0.1) 0%, transparent 50%)',
              clipPath: 'polygon(0 0, 100% 0, 100% 85%, 75% 92%, 50% 88%, 25% 92%, 0 85%)',
            }}
          />
        </div>
      </div>

      {/* Front particle layer for depth */}
      <div className="absolute inset-0" style={{ zIndex: 4, pointerEvents: 'none' }}>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-cyan animate-pulse"
          style={{ boxShadow: '0 0 20px #64ffda' }}
        />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-orange animate-pulse delay-75"
          style={{ boxShadow: '0 0 20px #ff6b35', animationDelay: '0.5s' }}
        />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-cyan animate-pulse delay-150"
          style={{ boxShadow: '0 0 20px #64ffda', animationDelay: '1s' }}
        />
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan z-10" />
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyan z-10" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-orange z-10" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-orange z-10" />

      {/* CSS animations */}
      <style jsx>{`
        @keyframes morph {
          0%, 100% {
            border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
          }
          25% {
            border-radius: 48% 52% 68% 32% / 42% 58% 42% 58%;
          }
          50% {
            border-radius: 38% 62% 58% 42% / 68% 35% 65% 32%;
          }
          75% {
            border-radius: 58% 42% 48% 52% / 38% 62% 38% 62%;
          }
        }
      `}</style>
    </div>
  );
}
