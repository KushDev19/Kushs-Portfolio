'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Disable custom cursor on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const cursorOuter = cursorOuterRef.current;
    const cursorInner = cursorInnerRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursorOuter || !cursorInner || !cursorDot) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };

      // Animate outer circle (slower, more lag)
      gsap.to(cursorOuter, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power2.out',
      });

      // Animate inner circle (medium lag)
      gsap.to(cursorInner, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Animate dot (fast, responsive)
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    // Handle hover on interactive elements
    const handleMouseEnter = () => {
      // Expand outer circle (3x bigger with vignette)
      gsap.to(cursorOuter, {
        width: 120,
        height: 120,
        duration: 0.4,
        ease: 'back.out(1.7)',
      });

      // Expand inner circle to match outer edge
      gsap.to(cursorInner, {
        width: 120,
        height: 120,
        duration: 0.4,
        ease: 'back.out(1.7)',
      });

      // Keep dot same size
      gsap.to(cursorDot, {
        scale: 1,
        duration: 0.3,
      });
    };

    const handleMouseLeave = () => {
      // Reset outer circle
      gsap.to(cursorOuter, {
        width: 40,
        height: 40,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Reset inner circle
      gsap.to(cursorInner, {
        width: 20,
        height: 20,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Reset dot
      gsap.to(cursorDot, {
        scale: 1,
        duration: 0.3,
      });
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);

    // Add hover listeners to text elements and interactive elements
    const interactiveElements = document.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, a, button, input, textarea, select, [role="button"], .cursor-hover'
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

  // Don't render on touch devices
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Outer Circle - Vignette effect with text inversion */}
      <div
        ref={cursorOuterRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: '40px',
          height: '40px',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(100, 255, 218, 0.6) 0%, rgba(100, 255, 218, 0.3) 40%, rgba(100, 255, 218, 0.1) 70%, transparent 100%)',
            filter: 'blur(4px)',
          }}
        />
      </div>

      {/* Inner Circle - Sticks to outer edge on hover */}
      <div
        ref={cursorInnerRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          width: '20px',
          height: '20px',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      >
        <div
          className="w-full h-full rounded-full border-2 border-cyan"
          style={{
            background: 'radial-gradient(circle, rgba(100, 255, 218, 0.4) 0%, rgba(100, 255, 218, 0.2) 50%, transparent 100%)',
            boxShadow: '0 0 20px rgba(100, 255, 218, 0.4)',
          }}
        />
      </div>

      {/* Center Dot - Always stays small */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[10001]"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="w-full h-full rounded-full bg-cyan"
          style={{
            boxShadow: '0 0 10px rgba(100, 255, 218, 1)',
          }}
        />
      </div>
    </>
  );
}
