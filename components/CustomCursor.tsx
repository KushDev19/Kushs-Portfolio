'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursor || !cursorDot) return;

    // Hide default cursor on interactive elements
    document.body.style.cursor = 'none';

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };

      // Animate cursor with GSAP
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out',
      });

      // Animate dot with less delay
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    // Handle hover on interactive elements
    const handleMouseEnter = () => {
      gsap.to(cursor, {
        scale: 2,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], .cursor-hover'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Cleanup
    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);

      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Main cursor with glow */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-full h-full rounded-full border-2 border-cyan bg-cyan/10 blur-[2px] shadow-[0_0_20px_rgba(100,255,218,0.5)]" />
      </div>

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[10000]"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-full h-full rounded-full bg-cyan shadow-[0_0_10px_rgba(100,255,218,0.8)]" />
      </div>
    </>
  );
}
