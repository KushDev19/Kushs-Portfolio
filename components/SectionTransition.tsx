'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SectionTransitionProps {
  children: React.ReactNode;
  delay?: number;
  type?: 'fade' | 'wipe';
}

export default function SectionTransition({
  children,
  delay = 0,
  type = 'fade',
}: SectionTransitionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const overlay = overlayRef.current;

    if (!section || !overlay) return;

    if (type === 'fade') {
      // Fade transition
      gsap.fromTo(
        overlay,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 1,
          delay,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      );
    } else if (type === 'wipe') {
      // Star Wars style horizontal wipe
      gsap.fromTo(
        overlay,
        { scaleX: 1, transformOrigin: 'left' },
        {
          scaleX: 0,
          duration: 1.5,
          delay,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === section) trigger.kill();
      });
    };
  }, [delay, type]);

  return (
    <div ref={sectionRef} className="relative">
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-almostBlack pointer-events-none z-50"
        style={{ willChange: type === 'wipe' ? 'transform' : 'opacity' }}
      />
      {children}
    </div>
  );
}
