'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [animatedStats, setAnimatedStats] = useState({
    projects: 0,
    models: 0,
    hackathons: 0,
  });

  const stats: Stat[] = [
    { label: 'Projects Completed', value: 5, suffix: '+', prefix: '' },
    { label: 'ML Models Deployed', value: 4, suffix: '', prefix: '' },
    { label: 'Hackathon Finalists', value: 1, suffix: '', prefix: '' },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const statsContainer = statsRef.current;

    if (!section || !image || !content || !statsContainer) return;

    // Fade from black transition
    gsap.fromTo(
      section,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      }
    );

    // Parallax effect on image
    gsap.to(image, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Content fade in
    gsap.fromTo(
      content,
      {
        opacity: 0,
        x: 50,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: content,
          start: 'top 80%',
        },
      }
    );

    // Animated stats counter
    ScrollTrigger.create({
      trigger: statsContainer,
      start: 'top 80%',
      onEnter: () => {
        // Animate projects counter
        gsap.to(animatedStats, {
          projects: stats[0].value,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            setAnimatedStats((prev) => ({
              ...prev,
              projects: Math.floor(this.targets()[0].projects),
            }));
          },
        });

        // Animate models counter
        gsap.to(animatedStats, {
          models: stats[1].value,
          duration: 2,
          delay: 0.2,
          ease: 'power2.out',
          onUpdate: function () {
            setAnimatedStats((prev) => ({
              ...prev,
              models: Math.floor(this.targets()[0].models),
            }));
          },
        });

        // Animate hackathons counter
        gsap.to(animatedStats, {
          hackathons: stats[2].value,
          duration: 2,
          delay: 0.4,
          ease: 'power2.out',
          onUpdate: function () {
            setAnimatedStats((prev) => ({
              ...prev,
              hackathons: Math.floor(this.targets()[0].hackathons),
            }));
          },
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-deepBlue relative overflow-hidden pb-12 md:pb-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-deepBlue via-almostBlack to-almostBlack opacity-70" />

      {/* Gradient fade from previous section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-deepBlue to-transparent pointer-events-none z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan to-orange rounded-full" />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <div ref={imageRef} className="relative">
            {/* Image Container with glow effect */}
            <div className="relative aspect-square max-w-xs sm:max-w-sm md:max-w-md mx-auto lg:mx-0">
              {/* Enhanced Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/40 to-orange/30 rounded-2xl blur-2xl" />
              <div className="absolute inset-0 bg-cyan/20 rounded-2xl blur-xl animate-pulse" />

              {/* Image */}
              <div className="relative w-full h-full rounded-2xl border-2 border-cyan/50 overflow-hidden bg-deepBlue/50 backdrop-blur-sm shadow-[0_0_60px_rgba(100,255,218,0.4)]">
                {/* Profile Image */}
                <img
                  src="/assets/profile.jpg"
                  alt="Kush Rank - Data Scientist Aspirant"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />

                {/* Enhanced Vignette effect */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(10, 25, 47, 0.4) 70%, rgba(10, 25, 47, 0.8) 100%)'
                  }}
                />

                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-deepBlue/70 via-transparent to-transparent" />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange" />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div ref={contentRef} className="space-y-8">
            {/* Bio */}
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-heading text-cyan mb-4">
                Brief
              </h3>
              <p className="text-lg leading-relaxed text-slate/90">
                <span className="text-cyan font-semibold">Learning by building:</span>{' '}
                ML projects with real datasets, clean{' '}
                <span className="text-orange font-semibold">EDA</span>, and{' '}
                <span className="text-cyan font-semibold">reproducible results</span>.
                Currently exploring{' '}
                <span className="text-orange font-semibold">GenAI</span> and automation
                while maintaining focus on practical,{' '}
                <span className="text-cyan font-semibold">deployable solutions</span>.
              </p>
            </div>

            {/* Animated Stats */}
            <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-8">
              {/* Projects */}
              <div className="text-center p-4 md:p-6 rounded-xl bg-deepBlue/30 border border-cyan/20 active:border-cyan/40 md:hover:border-cyan/40 transition-colors cursor-pointer touch-manipulation">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-cyan mb-2">
                  {animatedStats.projects}
                  <span className="text-orange">+</span>
                </div>
                <div className="text-sm text-slate/70 font-mono">
                  Projects Completed
                </div>
              </div>

              {/* Models */}
              <div className="text-center p-4 md:p-6 rounded-xl bg-deepBlue/30 border border-orange/20 active:border-orange/40 md:hover:border-orange/40 transition-colors cursor-pointer touch-manipulation">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-orange mb-2">
                  {animatedStats.models}
                </div>
                <div className="text-sm text-slate/70 font-mono">
                  ML Models Deployed
                </div>
              </div>

              {/* Hackathons */}
              <div className="text-center p-4 md:p-6 rounded-xl bg-deepBlue/30 border border-cyan/20 active:border-cyan/40 md:hover:border-cyan/40 transition-colors cursor-pointer touch-manipulation">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-cyan mb-2">
                  {animatedStats.hackathons}
                </div>
                <div className="text-sm text-slate/70 font-mono">Hackathon Finalists</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements (hidden on mobile for performance) */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan/5 rounded-full blur-3xl mobile-hide" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange/5 rounded-full blur-3xl mobile-hide" />

      {/* Gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-almostBlack pointer-events-none" />
    </section>
  );
}
