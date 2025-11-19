'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import FancyLoader from './FancyLoader';
import { splitTextToChars, animateScramble } from '@/lib/textAnimations';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const glitchLayerRef = useRef<HTMLDivElement>(null);
  const attitudeLayer1Ref = useRef<HTMLDivElement>(null);
  const attitudeLayer2Ref = useRef<HTMLDivElement>(null);
  const attitudeLayer3Ref = useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [nameChars, setNameChars] = useState(splitTextToChars('KUSH RANK'));
  const [titleText, setTitleText] = useState('');
  const [showCursor, setShowCursor] = useState(false);

  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const glitchIntervalRef = useRef<NodeJS.Timeout>();

  const fullTitle = 'Data Scientist Aspirant';
  const finalName = 'KUSH RANK';

  // Initialize particles
  useEffect(() => {
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

    const colors = ['#64ffda', '#ff6b35'];
    // Reduce particles on mobile for better performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 150;

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0,
      });
    }

    gsap.to(particlesRef.current, {
      alpha: 1,
      duration: 2,
      stagger: 0.01,
      ease: 'power2.out',
    });

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Mouse tracking for particles
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          particle.vx -= (dx / distance) * force * 0.1;
          particle.vy -= (dy / distance) * force * 0.1;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha * 0.6;
        ctx.fill();

        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (1 - distance / 100) * particle.alpha * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoaded(true);
    animateContent();
  };

  // Animate content after loading
  const animateContent = () => {
    // Animate name with scramble effect
    const chars = nameContainerRef.current?.querySelectorAll('.name-char');
    if (chars) {
      // Create unique wave pattern - letters come from below with rotation
      chars.forEach((char, i) => {
        const element = char as HTMLElement;
        const wave = Math.sin(i * 0.5) * 100; // Wave pattern
        const distance = 300 + Math.random() * 200; // Random distance

        gsap.set(element, {
          y: distance,
          x: wave,
          rotation: (Math.random() - 0.5) * 720, // Multiple rotations
          scale: 0,
          opacity: 0,
        });
      });

      // Scramble effect
      const cleanup = animateScramble(finalName, (scrambled) => {
        setNameChars(splitTextToChars(scrambled));
      }, 1000);

      // Create master timeline for coordinated animation
      const tl = gsap.timeline({
        onComplete: () => {
          cleanup();
          setNameChars(splitTextToChars(finalName));
          startTypewriter();
        },
      });

      // Animate each character with wave stagger
      chars.forEach((char, i) => {
        const delay = i * 0.08; // Stagger delay
        const verticalWave = Math.sin(i * 0.8) * 50; // Vertical wave during animation

        tl.to(
          char,
          {
            y: verticalWave, // Overshoot with wave
            x: 0,
            rotation: 360, // Full rotation
            scale: 1.2, // Slight overshoot
            opacity: 1,
            duration: 0.8,
            ease: 'back.out(2)',
          },
          delay
        ).to(
          char,
          {
            y: 0, // Settle to final position
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.inOut',
          },
          delay + 0.5
        );
      });
    }
  };

  // Typewriter effect
  const startTypewriter = () => {
    // Fade in title container first
    gsap.to(titleRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });

    setShowCursor(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullTitle.length) {
        setTitleText(fullTitle.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setShowCursor(false);

        // Animate subtitle
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );

        // Animate scroll indicator with pulse
        gsap.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: animateScrollIndicator,
          }
        );
      }
    }, 80);
  };

  // Scroll indicator animation
  const animateScrollIndicator = () => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(scrollIndicatorRef.current, {
      y: 10,
      duration: 0.8,
      ease: 'power1.inOut',
    }).to(scrollIndicatorRef.current, {
      y: 0,
      duration: 0.8,
      ease: 'power1.inOut',
    });
  };

  // Random glitch effect
  useEffect(() => {
    if (!isLoaded) return;

    const triggerGlitch = () => {
      const layer = glitchLayerRef.current;
      if (!layer) return;

      // Glitch animation
      gsap.to(layer, {
        opacity: 1,
        duration: 0.05,
      });

      // Random transform
      gsap.to(layer, {
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5,
        duration: 0.05,
        repeat: 3,
        yoyo: true,
        onComplete: () => {
          gsap.to(layer, {
            opacity: 0,
            x: 0,
            y: 0,
            duration: 0.1,
          });
        },
      });
    };

    // Random glitch every 5-10 seconds
    const scheduleNextGlitch = () => {
      const delay = 5000 + Math.random() * 5000;
      glitchIntervalRef.current = setTimeout(() => {
        triggerGlitch();
        scheduleNextGlitch();
      }, delay);
    };

    scheduleNextGlitch();

    return () => {
      if (glitchIntervalRef.current) {
        clearTimeout(glitchIntervalRef.current);
      }
    };
  }, [isLoaded]);

  // Attitude background animation - Stable main + floating translucent layers
  useEffect(() => {
    console.log('[DEBUG] Attitude background effect triggered. isLoaded:', isLoaded);

    if (!isLoaded) return;

    const layer1 = attitudeLayer1Ref.current;
    const layer2 = attitudeLayer2Ref.current;
    const layer3 = attitudeLayer3Ref.current;
    console.log('[DEBUG] Attitude layers:', layer1, layer2, layer3);

    if (!layer1 || !layer2 || !layer3) {
      console.warn('[DEBUG] Attitude layer ref is null!');
      return;
    }

    console.log('[DEBUG] Starting GSAP animation for attitude background');

    // Layer 1 - Main stable image (only fade in, no floating)
    gsap.fromTo(
      layer1,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }
    );

    // Layer 2 - First translucent floating layer (lofi x/y only, constrained to move down)
    gsap.fromTo(
      layer2,
      { opacity: 0 },
      { opacity: 1, duration: 2.5, ease: 'power2.out', delay: 0.3 }
    );

    gsap.to(layer2, {
      y: 25,
      x: 15,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2,
    });

    // Layer 3 - Second translucent floating layer (lofi x/y only, constrained to move down)
    gsap.fromTo(
      layer3,
      { opacity: 0 },
      { opacity: 1, duration: 2.8, ease: 'power2.out', delay: 0.6 }
    );

    gsap.to(layer3, {
      y: 30,
      x: -20,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2.5,
    });
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-almostBlack overflow-hidden touch-manipulation"
    >
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Attitude Background - Multi-layer Parallax Effect */}
      {/* Layer 3 - Deepest translucent floating layer */}
      <div
        ref={attitudeLayer3Ref}
        className="absolute inset-0 w-full h-full flex items-end justify-center overflow-hidden"
        style={{
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
          paddingTop: '240px',
        }}
      >
        <div className="relative w-full h-full flex items-end justify-center">
          <img
            src="/assets/attitudeBg.png"
            alt=""
            draggable={false}
            className="w-auto select-none"
            style={{
              height: 'calc(100% + 100px)',
              maxWidth: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom center',
              opacity: 0.12,
              filter: 'grayscale(100%) contrast(1.0) brightness(1.2) blur(3px) drop-shadow(0 0 40px rgba(255, 107, 53, 0.15))',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      </div>

      {/* Layer 2 - Middle translucent floating layer */}
      <div
        ref={attitudeLayer2Ref}
        className="absolute inset-0 w-full h-full flex items-end justify-center overflow-hidden"
        style={{
          zIndex: 3,
          pointerEvents: 'none',
          userSelect: 'none',
          paddingTop: '240px',
        }}
      >
        <div className="relative w-full h-full flex items-end justify-center">
          <img
            src="/assets/attitudeBg.png"
            alt=""
            draggable={false}
            className="w-auto select-none"
            style={{
              height: 'calc(100% + 100px)',
              maxWidth: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom center',
              opacity: 0.18,
              filter: 'grayscale(100%) contrast(1.1) brightness(1.1) blur(2px) drop-shadow(0 0 30px rgba(100, 255, 218, 0.2))',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      </div>

      {/* Layer 1 - Main stable foreground layer */}
      <div
        ref={attitudeLayer1Ref}
        className="absolute inset-0 w-full h-full flex items-end justify-center overflow-hidden"
        style={{
          zIndex: 5,
          pointerEvents: 'none',
          userSelect: 'none',
          paddingTop: '240px',
        }}
      >
        <div className="relative w-full h-full flex items-end justify-center">
          <img
            src="/assets/attitudeBg.png"
            alt=""
            draggable={false}
            className="w-auto select-none"
            style={{
              height: 'calc(100% + 100px)',
              maxWidth: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom center',
              opacity: 0.7,
              filter: 'grayscale(100%) contrast(1.3) brightness(0.9) drop-shadow(0 0 10px rgba(100, 255, 218, 0.3)) drop-shadow(0 0 20px rgba(100, 255, 218, 0.2))',
              mixBlendMode: 'lighten',
            }}
            onLoad={(e) => {
              console.log('[DEBUG] ✅ Attitude image loaded successfully!');
              console.log('[DEBUG] Image dimensions:', (e.target as HTMLImageElement).naturalWidth, 'x', (e.target as HTMLImageElement).naturalHeight);
            }}
            onError={(e) => {
              console.error('[DEBUG] ❌ Failed to load attitude image!');
              console.error('[DEBUG] Image src:', (e.target as HTMLImageElement).src);
              console.error('[DEBUG] Check if file exists at: public/assets/attitudeBg.png');
            }}
          />
        </div>
      </div>

      {/* Fancy Loading Screen */}
      {!isLoaded && <FancyLoader onComplete={handleLoadingComplete} />}

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pt-20 md:pt-0">
        {/* Name with character animation */}
        <div
          ref={nameContainerRef}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold mb-3 relative glitch-text px-4"
        >
          {nameChars.map((charData, i) => (
            <span
              key={i}
              className="name-char inline-block opacity-0"
              style={{ display: 'inline-block' }}
            >
              {charData.char}
            </span>
          ))}

          {/* Glitch layer */}
          <div
            ref={glitchLayerRef}
            className="absolute inset-0 pointer-events-none opacity-0"
            style={{
              textShadow: '2px 0 #64ffda, -2px 0 #ff6b35',
              mixBlendMode: 'screen',
            }}
          >
            {nameChars.map((charData, i) => (
              <span key={i} className="inline-block">
                {charData.char}
              </span>
            ))}
          </div>
        </div>

        {/* Title with typewriter */}
        <h2
          ref={titleRef}
          className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-cyan mb-2 font-display font-semibold h-12 sm:h-16 md:h-20 relative opacity-0 px-4"
        >
          <span>{titleText}</span>
          {showCursor && (
            <span className="animate-pulse ml-1">|</span>
          )}
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl md:text-3xl text-slate/90 opacity-0 -mt-6 mb-8 px-4"
          style={{
            textShadow: '0 0 20px rgba(100, 255, 218, 0.5), 0 0 40px rgba(100, 255, 218, 0.3)',
          }}
        >
          Turning Data into Stories
        </p>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center opacity-0"
      >
        <p className="text-slate/60 text-sm mb-2 font-mono">SCROLL</p>
        <div className="w-6 h-10 border-2 border-cyan/40 rounded-full p-1">
          <div className="w-1 h-2 bg-cyan rounded-full mx-auto" />
        </div>
      </div>

      {/* Gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-b from-transparent via-almostBlack/30 via-almostBlack/60 to-deepBlue pointer-events-none z-20" />

      {/* CSS for glitch effect on hover */}
      <style jsx>{`
        .glitch-text:hover {
          animation: glitch-skew 0.3s ease-in-out;
        }

        @keyframes glitch-skew {
          0% {
            transform: skewX(0deg);
          }
          20% {
            transform: skewX(-2deg);
          }
          40% {
            transform: skewX(2deg);
          }
          60% {
            transform: skewX(-1deg);
          }
          80% {
            transform: skewX(1deg);
          }
          100% {
            transform: skewX(0deg);
          }
        }
      `}</style>
    </section>
  );
}
