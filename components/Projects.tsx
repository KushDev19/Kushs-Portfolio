'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project, projectsData } from '@/lib/projectsData';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectCardProps {
  project: Project;
  reverse?: boolean;
}

function ProjectCard({ project, reverse = false }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerCardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const techBadgesRef = useRef<HTMLDivElement>(null);
  const impactMetricsRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for gradient border (disabled on touch devices)
  useEffect(() => {
    const innerCard = innerCardRef.current;
    if (!innerCard) return;

    // Disable mouse tracking on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = innerCard.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    innerCard.addEventListener('mousemove', handleMouseMove);
    innerCard.addEventListener('mouseenter', handleMouseEnter);
    innerCard.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      innerCard.removeEventListener('mousemove', handleMouseMove);
      innerCard.removeEventListener('mouseenter', handleMouseEnter);
      innerCard.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Scan-line effect on hover
  useEffect(() => {
    const scanLine = scanLineRef.current;
    if (!scanLine) return;

    if (isHovered) {
      // Start the scan animation
      gsap.fromTo(
        scanLine,
        { top: '0%', opacity: 0 },
        {
          top: '100%',
          opacity: 1,
          duration: 1.5,
          ease: 'power1.inOut',
          repeat: -1,
        }
      );
    } else {
      // Fade out and reset when hover ends
      gsap.to(scanLine, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(scanLine, { top: '0%' });
        },
      });
    }

    return () => {
      gsap.killTweensOf(scanLine);
    };
  }, [isHovered]);

  useEffect(() => {
    const card = cardRef.current;
    const techBadges = techBadgesRef.current;
    const impactMetrics = impactMetricsRef.current;
    if (!card || !techBadges || !impactMetrics) return;

    // Slide in animation
    gsap.fromTo(
      card,
      {
        opacity: 0,
        x: reverse ? 100 : -100,
        y: 50,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      }
    );

    // Tech badges pop-in animation
    const badges = techBadges.querySelectorAll('.tech-badge');
    gsap.fromTo(
      badges,
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: techBadges,
          start: 'top 85%',
        },
      }
    );

    // Impact metrics count-up animation
    const metricElements = impactMetrics.querySelectorAll('.metric-badge');
    ScrollTrigger.create({
      trigger: impactMetrics,
      start: 'top 85%',
      onEnter: () => {
        metricElements.forEach((element) => {
          gsap.fromTo(
            element,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(1.7)',
            }
          );
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === card || trigger.vars.trigger === techBadges || trigger.vars.trigger === impactMetrics) {
          trigger.kill();
        }
      });
    };
  }, [reverse]);

  // Ripple effect handler
  const handleRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <div
      ref={cardRef}
      className={`flex flex-col lg:flex-row gap-8 items-center ${
        reverse ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Mission Number */}
      <div className="flex-shrink-0">
        <div className="text-8xl md:text-9xl font-heading font-bold text-cyan/10 select-none">
          {String(project.id).padStart(2, '0')}
        </div>
      </div>

      {/* Card */}
      <div ref={innerCardRef} className="group relative flex-1 p-6 md:p-8 rounded-2xl border border-cyan/20 bg-deepBlue/30 backdrop-blur-sm active:border-cyan/50 md:hover:border-cyan/50 active:shadow-[0_0_40px_rgba(100,255,218,0.2)] md:hover:shadow-[0_0_40px_rgba(100,255,218,0.2)] transition-all duration-500 md:hover:-translate-y-2 cursor-hover overflow-hidden touch-manipulation">
        {/* Animated gradient border following cursor (desktop only) */}
        <div
          ref={borderRef}
          className="absolute inset-0 rounded-2xl opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mobile-hide"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(100, 255, 218, 0.15), transparent 40%)`,
          }}
        />

        {/* Scan-line effect (desktop only) */}
        <div
          ref={scanLineRef}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan to-transparent opacity-0 pointer-events-none mobile-hide"
          style={{ top: 0 }}
        />

        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-orange/5 rounded-2xl opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          {/* Project Tag */}
          <div className="inline-block px-4 py-1 mb-4 text-xs font-mono font-bold tracking-widest text-cyan border border-cyan/30 rounded-full bg-cyan/10">
            PROJECT #{String(project.id).padStart(2, '0')}
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-4 text-gradient">
            {project.title}
          </h3>

          {/* Challenge */}
          <div className="mb-6">
            <h4 className="text-sm font-mono text-orange mb-2 tracking-wider">
              CHALLENGE
            </h4>
            <p className="text-slate/80 leading-relaxed">{project.challenge}</p>
          </div>

          {/* Approach */}
          <div className="mb-6">
            <h4 className="text-sm font-mono text-cyan mb-2 tracking-wider">
              APPROACH
            </h4>
            <ul className="space-y-2">
              {project.approach.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate/80">
                  <span className="text-cyan mt-1">▹</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Impact */}
          <div className="mb-6" ref={impactMetricsRef}>
            <h4 className="text-sm font-mono text-orange mb-2 tracking-wider">
              IMPACT
            </h4>
            {project.impact.description && (
              <p className="text-slate/80 mb-3">{project.impact.description}</p>
            )}
            <div className="flex flex-wrap gap-3">
              {project.impact.accuracy && (
                <div className="metric-badge px-3 py-1 bg-orange/10 border border-orange/30 rounded-lg text-orange text-sm font-mono">
                  {project.impact.accuracy}
                </div>
              )}
              {project.impact.r2Score && (
                <div className="metric-badge px-3 py-1 bg-orange/10 border border-orange/30 rounded-lg text-orange text-sm font-mono">
                  {project.impact.r2Score}
                </div>
              )}
              <div className="metric-badge px-3 py-1 bg-orange/10 border border-orange/30 rounded-lg text-orange text-sm font-mono">
                {project.impact.status}
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-6" ref={techBadgesRef}>
            <h4 className="text-sm font-mono text-slate/60 mb-3 tracking-wider">
              TECH STACK
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="tech-badge px-3 py-1 bg-deepBlue/50 border border-cyan/20 rounded-lg text-cyan text-xs sm:text-sm font-mono active:border-cyan/50 md:hover:border-cyan/50 md:hover:scale-105 transition-all duration-300 touch-manipulation"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 md:gap-4">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleRipple}
              className="group/btn relative overflow-hidden px-5 py-3 md:px-6 bg-cyan/10 border border-cyan/30 rounded-lg text-cyan font-mono text-sm active:bg-cyan/20 md:hover:bg-cyan/20 active:border-cyan md:hover:border-cyan active:shadow-[0_0_20px_rgba(100,255,218,0.3)] md:hover:shadow-[0_0_20px_rgba(100,255,218,0.3)] transition-all duration-300 flex items-center gap-2 min-h-[48px] touch-manipulation"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View Code
            </a>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleRipple}
                className="relative overflow-hidden px-5 py-3 md:px-6 bg-orange/10 border border-orange/30 rounded-lg text-orange font-mono text-sm active:bg-orange/20 md:hover:bg-orange/20 active:border-orange md:hover:border-orange active:shadow-[0_0_20px_rgba(255,107,53,0.3)] md:hover:shadow-[0_0_20px_rgba(255,107,53,0.3)] transition-all duration-300 flex items-center gap-2 min-h-[48px] touch-manipulation"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 border-t-2 border-r-2 border-cyan/30 rounded-tr-2xl md:group-hover:border-cyan transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 border-b-2 border-l-2 border-orange/30 rounded-bl-2xl md:group-hover:border-orange transition-colors duration-500" />
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    // Cinematic title reveal
    const chars = title.textContent?.split('') || [];
    title.innerHTML = chars.map((char) => `<span class="inline-block opacity-0">${char === ' ' ? '&nbsp;' : char}</span>`).join('');

    const charElements = title.querySelectorAll('span');

    gsap.to(charElements, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
      },
    });

    gsap.set(charElements, {
      y: 50,
      rotationX: -90,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === title) trigger.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-almostBlack relative overflow-hidden px-4 sm:px-6 pt-12 pb-12 md:px-12 md:pt-16 md:pb-16 lg:px-24"
    >
      {/* Gradient fade from previous section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-almostBlack pointer-events-none" />

      {/* Background effects (hidden on mobile for performance) */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl mobile-hide" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-orange/5 rounded-full blur-3xl mobile-hide" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="mb-12 md:mb-20 text-center">
          <h2
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-9xl font-heading font-bold mb-4 md:mb-6"
            style={{ perspective: '1000px' }}
          >
            PROJECTS
          </h2>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-cyan via-orange to-cyan rounded-full mx-auto" />
        </div>

        {/* Projects Grid */}
        <div className="space-y-16 md:space-y-24 lg:space-y-32">
          {projectsData.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>

        {/* More Projects Coming */}
        <div className="mt-32 text-center">
          <div className="relative inline-block">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan/20 via-orange/20 to-cyan/20 blur-3xl animate-pulse" />

            {/* Content */}
            <div className="relative px-12 py-8 rounded-2xl border border-cyan/30 bg-deepBlue/50 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="w-2 h-2 bg-orange rounded-full animate-pulse" />
                <p className="text-sm font-mono text-orange tracking-[0.3em] uppercase">
                  In Development
                </p>
                <div className="w-2 h-2 bg-orange rounded-full animate-pulse" />
              </div>

              <h3 className="text-3xl md:text-4xl font-heading font-bold mb-3">
                <span className="text-gradient">More Projects</span> Incoming
              </h3>

              <p className="text-slate/70 font-mono text-sm">
                Building the future, one commit at a time
              </p>

              {/* Animated dots */}
              <div className="flex justify-center gap-2 mt-6">
                <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient fade to next section - seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 md:h-48 bg-gradient-to-b from-transparent via-almostBlack/60 to-almostBlack pointer-events-none z-20" />
    </section>
  );
}
