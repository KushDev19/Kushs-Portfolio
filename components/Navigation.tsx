'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface NavItem {
  label: string;
  href: string;
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'GitHub', href: '#github' },
    { label: 'Contact', href: '#contact' },
  ];

  // Handle scroll for background change and progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);

      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect active section on scroll
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'github', 'contact'];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length === 0) return;

        const maxEntry = visibleEntries.reduce((max, entry) => {
          return entry.intersectionRatio > max.intersectionRatio ? entry : max;
        }, visibleEntries[0]);

        const id = maxEntry.target.id || 'hero';
        setActiveSection(id);
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: '-100px 0px -50% 0px'
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to section
  const scrollToSection = (href: string) => {
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for nav height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }

    setIsMobileMenuOpen(false);
  };

  // Mobile menu animation
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';

      // Stagger menu items
      gsap.fromTo(
        '.mobile-menu-item',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-deepBlue/60 backdrop-blur-lg border-b border-cyan/10 shadow-lg'
            : 'bg-transparent'
        }`}
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Scroll Progress Bar */}
        <div
          ref={progressBarRef}
          className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-cyan via-green-500 to-orange transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Full page reload on click */}
            <a
              href="/"
              className="group relative text-3xl md:text-4xl font-heading font-bold cursor-pointer"
              aria-label="Reload website to home"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
              }}
            >
              <span className="text-gradient">KUSH RANK</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan to-orange group-hover:w-full transition-all duration-300" />
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8" role="menubar">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace('#', '');
                return (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="group relative font-mono text-base md:text-lg transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(100,255,218,0.15)]"
                    aria-label={`Navigate to ${item.label} section`}
                    aria-current={isActive ? 'page' : undefined}
                    role="menuitem"
                  >
                    <span
                      className={`${
                        isActive
                          ? 'text-cyan'
                          : 'text-slate/80 group-hover:bg-gradient-to-r group-hover:from-orange group-hover:via-cyan group-hover:to-orange group-hover:bg-clip-text group-hover:text-transparent'
                      }`}
                    >
                      {item.label}
                    </span>
                    <div
                      className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                        isActive
                          ? 'w-full bg-cyan'
                          : 'w-0 bg-gradient-to-r from-orange via-cyan to-orange group-hover:w-full'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Hamburger Icon (Mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 group z-50"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-cyan transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-cyan transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-cyan transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-almostBlack/95 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Items */}
          <div className="relative h-full flex flex-col items-center justify-center gap-8">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="mobile-menu-item group relative"
                  style={{ opacity: 0 }}
                >
                  <span
                    className={`text-3xl font-heading font-bold transition-colors duration-300 ${
                      isActive ? 'text-gradient' : 'text-slate hover:text-cyan'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan to-orange rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Close hint */}
            <div className="mobile-menu-item absolute bottom-12 text-sm font-mono text-slate/60">
              Tap anywhere to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
