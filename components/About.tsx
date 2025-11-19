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

      {/* Gradient fade from previous section - smoother blend */}
      <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-deepBlue/80 via-deepBlue/40 to-transparent pointer-events-none z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan to-orange rounded-full mx-auto" />
        </div>

        {/* Single Column Centered Layout */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Bio Section */}
          <div ref={contentRef} className="text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-heading text-cyan mb-4">
              Brief
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-slate/90 max-w-3xl mx-auto">
              I&apos;m Kush, a{' '}
              <span className="text-cyan font-semibold">data science and ML engineer-in-progress</span>,
              turning messy real-world datasets into clean insights, practical models, and small{' '}
              <span className="text-orange font-semibold">&quot;Jarvis-style&quot; tools</span>{' '}
              — from flight prices to food delivery — and shipping them as{' '}
              <span className="text-cyan font-semibold">web apps people can actually use</span>.
            </p>
          </div>

          {/* Animated Stats */}
          <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {/* Projects */}
            <div className="text-center p-6 md:p-8 rounded-xl bg-deepBlue/30 border border-cyan/20 active:border-cyan/40 md:hover:border-cyan/40 transition-colors cursor-pointer touch-manipulation">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-cyan mb-2">
                {animatedStats.projects}
                <span className="text-orange">+</span>
              </div>
              <div className="text-sm md:text-base text-slate/70 font-mono">
                Projects Completed
              </div>
            </div>

            {/* Models */}
            <div className="text-center p-6 md:p-8 rounded-xl bg-deepBlue/30 border border-orange/20 active:border-orange/40 md:hover:border-orange/40 transition-colors cursor-pointer touch-manipulation">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-orange mb-2">
                {animatedStats.models}
              </div>
              <div className="text-sm md:text-base text-slate/70 font-mono">
                ML Models Deployed
              </div>
            </div>

            {/* Hackathons */}
            <div className="text-center p-6 md:p-8 rounded-xl bg-deepBlue/30 border border-cyan/20 active:border-cyan/40 md:hover:border-cyan/40 transition-colors cursor-pointer touch-manipulation">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-cyan mb-2">
                {animatedStats.hackathons}
              </div>
              <div className="text-sm md:text-base text-slate/70 font-mono">Hackathon Finalists</div>
            </div>
          </div>

          {/* Key Highlights */}
          <div ref={imageRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            {/* Education */}
            <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-deepBlue/50 to-almostBlack/50 border border-cyan/20 active:border-cyan/30 md:hover:border-cyan/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="text-3xl md:text-4xl">🎓</div>
                <div className="flex-1">
                  <h4 className="text-xl md:text-2xl font-heading text-cyan mb-2">Education</h4>
                  <p className="text-slate/80 font-mono text-sm md:text-base">
                    New Jersey Institute of Technology
                  </p>
                  <p className="text-slate/60 text-sm mt-1">
                    Bachelors of Computer Science • 27&apos;
                  </p>
                </div>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-deepBlue/50 to-almostBlack/50 border border-orange/20 active:border-orange/30 md:hover:border-orange/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="text-3xl md:text-4xl">🎯</div>
                <div className="flex-1">
                  <h4 className="text-xl md:text-2xl font-heading text-orange mb-2">Focus Areas</h4>
                  <p className="text-slate/80 font-mono text-sm md:text-base">
                    Machine Learning • GenAI
                  </p>
                  <p className="text-slate/60 text-sm mt-1">
                    End-to-end ML pipelines
                  </p>
                </div>
              </div>
            </div>

            {/* Currently Learning */}
            <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-deepBlue/50 to-almostBlack/50 border border-cyan/20 active:border-cyan/30 md:hover:border-cyan/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="text-3xl md:text-4xl">🚀</div>
                <div className="flex-1">
                  <h4 className="text-xl md:text-2xl font-heading text-cyan mb-2">Currently Learning</h4>
                  <p className="text-slate/80 font-mono text-sm md:text-base">
                    MLOps • PySpark • Deep Learning
                  </p>
                  <p className="text-slate/60 text-sm mt-1">
                    Scaling ML to production
                  </p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-deepBlue/50 to-almostBlack/50 border border-orange/20 active:border-orange/30 md:hover:border-orange/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="text-3xl md:text-4xl">💼</div>
                <div className="flex-1">
                  <h4 className="text-xl md:text-2xl font-heading text-orange mb-2">Status</h4>
                  <p className="text-slate/80 font-mono text-sm md:text-base">
                    Open to Opportunities
                  </p>
                  <p className="text-slate/60 text-sm mt-1">
                    Internships • Full-time roles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements (hidden on mobile for performance) */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan/5 rounded-full blur-3xl mobile-hide" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange/5 rounded-full blur-3xl mobile-hide" />

      {/* Gradient fade to next section - smoother */}
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-b from-transparent via-almostBlack/40 to-almostBlack pointer-events-none" />
    </section>
  );
}
