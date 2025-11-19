'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillCategory {
  id: string;
  icon: string;
  name: string;
  skills: string[];
  backInfo: string;
  color: 'cyan' | 'orange';
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const categories: SkillCategory[] = [
    {
      id: 'languages',
      icon: '💻',
      name: 'Languages',
      skills: ['Python', 'JavaScript', 'TypeScript', 'Java'],
      backInfo: 'Core Proficiency',
      color: 'cyan',
    },
    {
      id: 'ml-ai',
      icon: '🤖',
      name: 'ML & AI',
      skills: ['Scikit-learn', 'PyTorch', 'TensorFlow', 'Keras', 'MLFlow', 'XGBoost'],
      backInfo: '5+ Projects • Advanced',
      color: 'cyan',
    },
    {
      id: 'genai',
      icon: '🧠',
      name: 'GenAI & LLMs',
      skills: ['LangChain', 'Transformers', 'Agentic AI', 'GenAI'],
      backInfo: 'Cutting Edge',
      color: 'cyan',
    },
    {
      id: 'data',
      icon: '📊',
      name: 'Data Science',
      skills: ['Pandas', 'NumPy', 'EDA', 'Matplotlib', 'Plotly'],
      backInfo: 'Expert Level',
      color: 'cyan',
    },
    {
      id: 'web',
      icon: '🌐',
      name: 'Web & Full Stack',
      skills: ['Next.js', 'React.js', 'Node.js', 'TailwindCSS', 'Three.js', 'Flask', 'Streamlit'],
      backInfo: '4+ Projects',
      color: 'cyan',
    },
    {
      id: 'database',
      icon: '🗄️',
      name: 'Databases',
      skills: ['MySQL', 'MongoDB'],
      backInfo: 'Production Ready',
      color: 'cyan',
    },
    {
      id: 'devops',
      icon: '🚀',
      name: 'DevOps & Tools',
      skills: ['Docker', 'Git + GitHub', 'CI/CD', 'n8n', 'Jupyter', 'VS Code', 'Conda/venv'],
      backInfo: 'Daily Workflow',
      color: 'cyan',
    },
    {
      id: 'learning',
      icon: '🔥',
      name: 'Currently Learning',
      skills: ['PySpark', 'MLOps', 'Deep Learning', 'LightGBM', 'CatBoost', 'CNNs', 'RNNs'],
      backInfo: 'In Progress',
      color: 'orange',
    },
  ];

  // Glitch effect for title
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    // Initial glitch animation
    const glitchTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
        once: true,
      },
    });

    glitchTimeline
      .fromTo(
        title,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5 }
      )
      .to(title, {
        x: 5,
        duration: 0.05,
        repeat: 3,
        yoyo: true,
      })
      .to(title, {
        x: -5,
        duration: 0.05,
        repeat: 2,
        yoyo: true,
      })
      .to(title, { x: 0, duration: 0.1 });

    // Random glitch every 5-8 seconds
    const randomGlitch = () => {
      gsap
        .timeline()
        .to(title, {
          x: Math.random() > 0.5 ? 3 : -3,
          duration: 0.05,
          repeat: 2,
          yoyo: true,
        })
        .to(title, { x: 0, duration: 0.05 });
    };

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        randomGlitch();
      }
    }, 5000);

    return () => {
      clearInterval(glitchInterval);
    };
  }, []);

  // Staggered card animations
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll('.skill-card');

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 60,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: grid,
          start: 'top 75%',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === grid) trigger.kill();
      });
    };
  }, []);

  const handleCardClick = (id: string) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-almostBlack relative overflow-hidden px-6 pt-8 pb-6 md:px-12 md:pt-12 md:pb-8 lg:px-24"
    >
      {/* Background effects */}
      {/* Decorative elements (hidden on mobile for performance) */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl mobile-hide" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-orange/5 rounded-full blur-3xl mobile-hide" />

      {/* Gradient fade from previous section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-almostBlack pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="mb-20 text-center">
          <h2
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-9xl font-heading font-bold mb-6 relative inline-block"
          >
            <span className="text-gradient">THE ARSENAL</span>
            {/* Glitch overlay effect */}
            <span
              className="absolute inset-0 text-cyan opacity-30 mix-blend-difference"
              style={{ transform: 'translate(-2px, 2px)' }}
            >
              THE ARSENAL
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan via-orange to-cyan rounded-full mx-auto" />
        </div>

        {/* Skills Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
          {categories.map((category) => {
            const isFlipped = flippedCards.has(category.id);
            const isLearning = category.color === 'orange';

            return (
              <div
                key={category.id}
                className="skill-card perspective-1000"
                onClick={() => handleCardClick(category.id)}
              >
                <div
                  className={`relative w-full h-72 sm:h-80 transition-transform duration-700 transform-style-3d cursor-pointer touch-manipulation ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Front of card */}
                  <div
                    className={`absolute inset-0 p-6 rounded-2xl border ${
                      isLearning
                        ? 'border-orange/20 bg-deepBlue/30'
                        : 'border-cyan/20 bg-deepBlue/30'
                    } backdrop-blur-sm backface-hidden group hover:border-${
                      category.color
                    }/50 hover:shadow-[0_0_40px_rgba(${
                      isLearning ? '255,107,53' : '100,255,218'
                    },0.2)] transition-all duration-500`}
                  >
                    {/* Icon */}
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>

                    {/* Category Name */}
                    <h3
                      className={`text-2xl font-heading font-bold mb-6 ${
                        isLearning ? 'text-orange' : 'text-cyan'
                      }`}
                    >
                      {category.name}
                    </h3>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, index) => (
                        <span
                          key={skill}
                          className={`skill-tag px-3 py-1 ${
                            isLearning
                              ? 'bg-orange/10 border-orange/30 text-orange'
                              : 'bg-cyan/10 border-cyan/30 text-cyan'
                          } border rounded-lg text-sm font-mono hover:scale-105 transition-transform duration-300`}
                          style={{
                            animationDelay: `${index * 0.1}s`,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Click hint */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className={`px-3 py-1 ${
                          isLearning
                            ? 'bg-orange/20 border-orange/30'
                            : 'bg-cyan/20 border-cyan/30'
                        } border rounded-full text-xs font-mono ${
                          isLearning ? 'text-orange' : 'text-cyan'
                        }`}
                      >
                        Click to flip
                      </div>
                    </div>

                    {/* Corner accents */}
                    <div
                      className={`absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 ${
                        isLearning ? 'border-orange/30' : 'border-cyan/30'
                      } rounded-tr-2xl group-hover:border-${
                        category.color
                      } transition-colors duration-500`}
                    />
                    <div
                      className={`absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 ${
                        isLearning ? 'border-orange/30' : 'border-cyan/30'
                      } rounded-bl-2xl group-hover:border-${
                        category.color
                      } transition-colors duration-500`}
                    />
                  </div>

                  {/* Back of card */}
                  <div
                    className={`absolute inset-0 p-6 rounded-2xl border ${
                      isLearning
                        ? 'border-orange/20 bg-gradient-to-br from-orange/20 to-deepBlue/40'
                        : 'border-cyan/20 bg-gradient-to-br from-cyan/20 to-deepBlue/40'
                    } backdrop-blur-sm backface-hidden rotate-y-180 flex flex-col items-center justify-center`}
                  >
                    <div className="text-7xl mb-6 animate-pulse">
                      {category.icon}
                    </div>

                    <h3
                      className={`text-3xl font-heading font-bold mb-4 ${
                        isLearning ? 'text-orange' : 'text-cyan'
                      }`}
                    >
                      {category.name}
                    </h3>

                    <p
                      className={`text-2xl font-mono font-bold ${
                        isLearning ? 'text-orange/80' : 'text-cyan/80'
                      }`}
                    >
                      {category.backInfo}
                    </p>

                    {/* Click hint */}
                    <div className="absolute bottom-4 text-center">
                      <div
                        className={`px-3 py-1 ${
                          isLearning
                            ? 'bg-orange/20 border-orange/30'
                            : 'bg-cyan/20 border-cyan/30'
                        } border rounded-full text-xs font-mono ${
                          isLearning ? 'text-orange' : 'text-cyan'
                        }`}
                      >
                        Click to flip back
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-almostBlack pointer-events-none" />
    </section>
  );
}
