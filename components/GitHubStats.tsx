'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatCard {
  label: string;
  value: string;
  icon: string;
}

interface PinnedRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
}

export default function GitHubStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'MISSION CONTROL';

  const stats: StatCard[] = [
    { label: 'PUBLIC_REPOS', value: '17+', icon: '📦' },
    { label: 'ACTIVE_PROJECTS', value: '5+', icon: '🚀' },
    { label: 'TECH_STACK', value: 'ML/AI', icon: '⚡' },
  ];

  const pinnedRepos: PinnedRepo[] = [
    {
      name: 'UniWallet-Dev',
      description: 'AI-powered campus financial platform with Plaid integration',
      language: 'TypeScript',
      stars: 2,
      url: 'https://github.com/JiyanBhalara/Uni-Wallet-Dev',
    },
    {
      name: 'ML-Project',
      description: 'Student performance prediction with 8 ML models comparison',
      language: 'Python',
      stars: 1,
      url: 'https://github.com/KushDev19/ML-Project',
    },
    {
      name: 'Flight-Price-Prediction',
      description: 'Comprehensive EDA and feature engineering for flight pricing',
      language: 'Jupyter Notebook',
      stars: 0,
      url: 'https://github.com/KushDev19/Flight-EDA-and-Price-Prediction',
    },
    {
      name: 'jarvis',
      description: 'Personal AI assistant with voice commands and API integration',
      language: 'Python',
      stars: 1,
      url: 'https://github.com/KushDev19/jarvis',
    },
  ];

  // Generate contribution data (52 weeks x 7 days)
  const generateContributionData = () => {
    const data = [];
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        const level = Math.floor(Math.random() * 5); // 0-4 contribution levels
        data.push({ week, day, level });
      }
    }
    return data;
  };

  const contributionData = generateContributionData();

  // Typing animation for title
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Contribution graph animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const squares = section.querySelectorAll('.contribution-square');

    gsap.fromTo(
      squares,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.05,
        stagger: {
          amount: 2,
          from: 'start',
        },
        scrollTrigger: {
          trigger: '.contribution-graph',
          start: 'top 80%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const getContributionColor = (level: number) => {
    const colors = [
      'bg-deepBlue/30',
      'bg-cyan/20',
      'bg-cyan/40',
      'bg-cyan/60',
      'bg-cyan/80',
    ];
    return colors[level];
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-almostBlack relative overflow-hidden px-6 py-12 md:px-12 md:py-16 lg:px-24"
    >
      {/* Background effects (hidden on mobile for performance) */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl mobile-hide" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl mobile-hide" />

      {/* Gradient fade from previous section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-almostBlack pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Terminal-style Title */}
        <div className="mb-16">
          <div className="p-6 rounded-lg border-2 border-green-500/30 bg-almostBlack/80 backdrop-blur-sm font-mono">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="text-green-500/50 text-sm">terminal</div>
            </div>
            <h2
              ref={titleRef}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-green-500"
            >
              {'> '}
              {displayedText}
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                _
              </span>
            </h2>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group p-4 md:p-6 rounded-lg border-2 border-cyan/20 bg-almostBlack/60 backdrop-blur-sm active:border-cyan/50 md:hover:border-cyan/50 active:shadow-[0_0_30px_rgba(100,255,218,0.2)] md:hover:shadow-[0_0_30px_rgba(100,255,218,0.2)] transition-all duration-300 touch-manipulation"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{stat.icon}</span>
                <div className="text-xs font-mono text-cyan/60 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
              <div className="text-2xl font-mono font-bold text-cyan">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Pinned Repositories */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-heading font-bold mb-8 text-cyan flex items-center gap-3">
            <span className="text-orange">📌</span> PINNED REPOSITORIES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pinnedRepos.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-lg border-2 border-cyan/20 bg-almostBlack/60 backdrop-blur-sm hover:border-cyan/50 hover:shadow-[0_0_30px_rgba(100,255,218,0.2)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-cyan"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                    </svg>
                    <h4 className="font-mono font-bold text-cyan group-hover:text-orange transition-colors duration-300">
                      {repo.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-slate/60">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                    </svg>
                    <span className="text-xs font-mono">{repo.stars}</span>
                  </div>
                </div>

                <p className="text-sm text-slate/70 mb-4 line-clamp-2">
                  {repo.description}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        repo.language === 'Python'
                          ? 'bg-blue-500'
                          : repo.language === 'TypeScript'
                          ? 'bg-cyan'
                          : 'bg-orange'
                      }`}
                    />
                    <span className="text-xs font-mono text-slate/60">
                      {repo.language}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-heading font-bold mb-8 text-cyan flex items-center gap-3">
            <span className="text-orange">📊</span> CONTRIBUTION ACTIVITY
          </h3>
          <div className="p-6 rounded-lg border-2 border-cyan/20 bg-almostBlack/60 backdrop-blur-sm overflow-x-auto">
            <div className="contribution-graph inline-flex gap-1 min-w-full md:justify-center">
              {Array.from({ length: 52 }).map((_, week) => (
                <div key={week} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, day) => {
                    const data = contributionData.find(
                      (d) => d.week === week && d.day === day
                    );
                    return (
                      <div
                        key={`${week}-${day}`}
                        className={`contribution-square w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm ${getContributionColor(
                          data?.level || 0
                        )} border border-cyan/10 cursor-pointer hover:border-cyan/50 hover:scale-125 transition-all duration-200`}
                        title={`Week ${week + 1}, Day ${day + 1}: ${data?.level || 0} commits`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-6 text-xs font-mono text-slate/60">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm ${getContributionColor(level)} border border-cyan/10`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
            {/* Scroll hint for mobile */}
            <div className="md:hidden text-center mt-4 text-xs font-mono text-slate/50">
              ← Scroll to see full year →
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a
            href="https://github.com/KushDev19"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan/20 to-green-500/20 border-2 border-cyan/50 rounded-lg font-mono font-bold text-cyan hover:border-green-500 hover:shadow-[0_0_40px_rgba(100,255,218,0.4)] transition-all duration-300 hover:scale-105"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="text-lg">EXPLORE FULL LAB</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-almostBlack pointer-events-none" />
    </section>
  );
}
