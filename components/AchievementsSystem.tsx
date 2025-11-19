'use client';

import { useEffect, useState } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface ToastNotification {
  id: string;
  achievement: Achievement;
}

export default function AchievementsSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-visit',
      title: 'Welcome Aboard',
      description: 'Visited the portfolio',
      icon: '👋',
      unlocked: false,
    },
    {
      id: 'scroll-explorer',
      title: 'Scroll Explorer',
      description: 'Scrolled 50% of the page',
      icon: '📜',
      unlocked: false,
    },
    {
      id: 'deep-diver',
      title: 'Deep Diver',
      description: 'Scrolled to the bottom',
      icon: '🏊',
      unlocked: false,
    },
    {
      id: 'section-master',
      title: 'Section Master',
      description: 'Visited all sections',
      icon: '🗺️',
      unlocked: false,
    },
    {
      id: 'button-clicker',
      title: 'Button Enthusiast',
      description: 'Clicked 10 buttons',
      icon: '🖱️',
      unlocked: false,
    },
    {
      id: 'jarvis-summoner',
      title: 'AI Whisperer',
      description: 'Summoned JARVIS',
      icon: '🤖',
      unlocked: false,
    },
    {
      id: 'code-master',
      title: 'Code Master',
      description: 'Activated Konami Code',
      icon: '🎮',
      unlocked: false,
    },
    {
      id: 'project-viewer',
      title: 'Project Inspector',
      description: 'Viewed GitHub projects',
      icon: '💻',
      unlocked: false,
    },
    {
      id: 'completionist',
      title: 'Completionist',
      description: 'Unlocked all achievements',
      icon: '🏆',
      unlocked: false,
    },
  ]);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set());
  const [buttonClicks, setButtonClicks] = useState(0);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      // First visit
      if (!achievements.find((a) => a.id === 'first-visit')?.unlocked) {
        unlockAchievement('first-visit');
      }

      // Scroll 50%
      if (
        scrollPercentage >= 50 &&
        !achievements.find((a) => a.id === 'scroll-explorer')?.unlocked
      ) {
        unlockAchievement('scroll-explorer');
      }

      // Scroll to bottom
      if (
        scrollPercentage >= 95 &&
        !achievements.find((a) => a.id === 'deep-diver')?.unlocked
      ) {
        unlockAchievement('deep-diver');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [achievements]);

  // Track visited sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setVisitedSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = ['hero', 'about', 'skills', 'projects', 'github', 'contact'];
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Check if all sections visited
  useEffect(() => {
    if (
      visitedSections.size >= 6 &&
      !achievements.find((a) => a.id === 'section-master')?.unlocked
    ) {
      unlockAchievement('section-master');
    }
  }, [visitedSections, achievements]);

  // Track button clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        setButtonClicks((prev) => {
          const newCount = prev + 1;
          if (
            newCount >= 10 &&
            !achievements.find((a) => a.id === 'button-clicker')?.unlocked
          ) {
            unlockAchievement('button-clicker');
          }
          return newCount;
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [achievements]);

  // Custom event listeners for specific achievements
  useEffect(() => {
    const handleJarvisOpen = () => {
      if (!achievements.find((a) => a.id === 'jarvis-summoner')?.unlocked) {
        unlockAchievement('jarvis-summoner');
      }
    };

    const handleKonamiCode = () => {
      if (!achievements.find((a) => a.id === 'code-master')?.unlocked) {
        unlockAchievement('code-master');
      }
    };

    const handleProjectView = () => {
      if (!achievements.find((a) => a.id === 'project-viewer')?.unlocked) {
        unlockAchievement('project-viewer');
      }
    };

    window.addEventListener('jarvis-opened', handleJarvisOpen);
    window.addEventListener('konami-activated', handleKonamiCode);
    window.addEventListener('project-viewed', handleProjectView);

    return () => {
      window.removeEventListener('jarvis-opened', handleJarvisOpen);
      window.removeEventListener('konami-activated', handleKonamiCode);
      window.removeEventListener('project-viewed', handleProjectView);
    };
  }, [achievements]);

  // Check for completionist
  useEffect(() => {
    const unlockedCount = achievements.filter((a) => a.unlocked).length;
    const totalAchievements = achievements.length - 1; // Exclude completionist itself

    if (
      unlockedCount === totalAchievements &&
      !achievements.find((a) => a.id === 'completionist')?.unlocked
    ) {
      unlockAchievement('completionist');
    }
  }, [achievements]);

  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const updated = prev.map((achievement) =>
        achievement.id === id ? { ...achievement, unlocked: true } : achievement
      );

      // Show toast for newly unlocked achievement
      const unlockedAchievement = updated.find((a) => a.id === id);
      if (unlockedAchievement && !prev.find((a) => a.id === id)?.unlocked) {
        showToast(unlockedAchievement);
      }

      return updated;
    });
  };

  const showToast = (achievement: Achievement) => {
    const toast: ToastNotification = {
      id: `${Date.now()}-${achievement.id}`,
      achievement,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-[90] pointer-events-none">
      <div className="space-y-3 pointer-events-auto">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-deepBlue/95 border-2 border-cyan/50 rounded-lg p-4 shadow-[0_0_40px_rgba(100,255,218,0.3)] backdrop-blur-sm animate-zoom-in min-w-[300px] max-w-[400px]"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{toast.achievement.icon}</div>
              <div className="flex-1">
                <div className="text-orange font-mono text-xs mb-1">
                  ACHIEVEMENT UNLOCKED!
                </div>
                <h4 className="text-cyan font-heading font-bold text-lg mb-1">
                  {toast.achievement.title}
                </h4>
                <p className="text-slate/80 text-sm">
                  {toast.achievement.description}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate/60 hover:text-cyan transition-colors"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
