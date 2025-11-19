'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContactOption {
  id: string;
  label: string;
  icon: string;
  url: string;
  details: string;
}

interface JarvisResponse {
  [key: string]: string;
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showJarvis, setShowJarvis] = useState(false);
  const [jarvisInput, setJarvisInput] = useState('');
  const [jarvisMessages, setJarvisMessages] = useState<Array<{ type: 'user' | 'jarvis'; text: string }>>([]);
  const [keyBuffer, setKeyBuffer] = useState('');
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contactOptions: ContactOption[] = [
    {
      id: 'email',
      label: 'Email',
      icon: 'gmail',
      url: 'mailto:kush.m.rank@gmail.com',
      details: 'kush.m.rank@gmail.com',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: 'linkedin',
      url: 'https://www.linkedin.com/in/kush-rank-795377331/',
      details: 'Connect on LinkedIn',
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: 'github',
      url: 'https://github.com/KushDev19',
      details: '@KushDev19',
    },
    {
      id: 'devpost',
      label: 'DevPost',
      icon: 'devpost',
      url: 'https://devpost.com/KushDev19?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav',
      details: 'Hackathon Projects',
    },
  ];

  // Function to render icon based on type
  const renderIcon = (iconType: string) => {
    const iconMap: { [key: string]: string } = {
      gmail: '/assets/gmail.svg',
      linkedin: '/assets/linkedin-svgrepo-com.svg',
      github: '/assets/github-mark.svg',
      devpost: '/assets/devpost-svgrepo-com.svg',
    };

    return (
      <img
        src={iconMap[iconType]}
        alt={`${iconType} logo`}
        className="w-16 h-16 object-contain"
        loading="lazy"
      />
    );
  };

  const jarvisResponses: JarvisResponse = {
    hello: "Hello! I'm JARVIS, Kush's AI assistant. How can I help you today? Try asking about 'projects', 'skills', or 'contact'.",
    hi: "Hello! I'm JARVIS, Kush's AI assistant. How can I help you today? Try asking about 'projects', 'skills', or 'contact'.",
    hey: "Hello! I'm JARVIS, Kush's AI assistant. How can I help you today? Try asking about 'projects', 'skills', or 'contact'.",
    projects: "Kush has built:\n• UniWallet - AI-powered campus wallet (Top 5 @ HackFest) [https://github.com/JiyanBhalara/Uni-Wallet-Dev]\n• Student Performance Predictor (ML) [https://github.com/KushDev19/ML-Project]\n• Flight Price Prediction (EDA) [https://github.com/KushDev19/Flight-EDA-and-Price-Prediction]\n• JARVIS AI Assistant (that's me!) [https://github.com/KushDev19/jarvis]\n• Sales EDA & Purchase Prediction [https://github.com/KushDev19/Sales-EDA-and-Purchase-Prediction]",
    skills: "Kush's tech stack:\n🤖 ML: Python, Scikit-learn, TensorFlow, XGBoost\n📊 Data: Pandas, NumPy, EDA\n🌐 Web: Flask, React, Next.js\n🧠 Currently Learning: GenAI, LLMs",
    contact: "You can reach Kush at:\n📧 Email: [kush.m.rank@gmail.com]\n💼 LinkedIn: [https://www.linkedin.com/in/kush-rank-795377331/]\n💻 GitHub: [https://github.com/KushDev19]\n🏆 DevPost: [https://devpost.com/KushDev19]",
    help: "Available commands:\n• hello - Get a greeting\n• projects - See Kush's projects\n• skills - View tech stack\n• contact - Get contact info\n• exit - Close JARVIS",
    exit: "Goodbye! Feel free to summon me again by typing 'jarvis' anywhere on the page.",
  };

  // Function to render message with clickable links
  const renderMessageWithLinks = (text: string) => {
    const urlRegex = /\[([^\]]+)\]/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      // Every odd index is a captured group (content inside brackets)
      if (index % 2 === 1) {
        // Check if it's a URL or email
        if (part.startsWith('http')) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan underline hover:text-orange transition-colors duration-300"
            >
              {part}
            </a>
          );
        } else if (part.includes('@')) {
          return (
            <a
              key={index}
              href={`mailto:${part}`}
              className="text-cyan underline hover:text-orange transition-colors duration-300"
            >
              {part}
            </a>
          );
        }
        return part;
      }
      return part;
    });
  };

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 255, 218, 0.3)';
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, j) => {
          if (i === j) return;
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(100, 255, 218, ${0.2 * (1 - distance / 150)})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP animations
  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    if (!title || !subtitle) return;

    // Zoom-out reveal animation
    gsap.fromTo(
      title,
      {
        scale: 3,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          once: true,
        },
      }
    );

    gsap.fromTo(
      subtitle,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: subtitle,
          start: 'top 80%',
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Easter egg: Listen for "jarvis" typing
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showJarvis) return; // Don't trigger if already open

      setKeyBuffer((prev) => {
        const newBuffer = (prev + e.key).toLowerCase().slice(-6);
        if (newBuffer === 'jarvis') {
          setShowJarvis(true);
          setJarvisMessages([
            { type: 'jarvis', text: "JARVIS activated. Hello! Type 'help' for available commands." },
          ]);
          return '';
        }
        return newBuffer;
      });
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [showJarvis]);

  const handleJarvisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jarvisInput.trim() || isTyping) return;

    const userMessage = jarvisInput.trim();
    setJarvisMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setJarvisInput('');

    setIsTyping(true);

    setTimeout(() => {
      const response =
        jarvisResponses[userMessage.toLowerCase()] ||
        "I don't understand that command. Type 'help' to see available commands.";

      // Typing effect
      let currentText = '';
      let index = 0;

      const typingInterval = setInterval(() => {
        if (index < response.length) {
          currentText += response[index];
          setJarvisMessages((prev) => {
            const newMessages = [...prev];
            const lastMessageIndex = newMessages.length - 1;

            if (newMessages[lastMessageIndex]?.type === 'jarvis' && index > 0) {
              newMessages[lastMessageIndex] = { type: 'jarvis', text: currentText };
            } else {
              newMessages.push({ type: 'jarvis', text: currentText });
            }

            return newMessages;
          });
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);

          if (userMessage.toLowerCase() === 'exit') {
            setTimeout(() => setShowJarvis(false), 2000);
          }
        }
      }, 20); // 20ms per character for smooth typing
    }, 500);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [jarvisMessages]);

  const handleRipple = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
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
    setTimeout(() => ripple.remove(), 600);
  };

  const handleDownloadResume = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleRipple(e);
    setDownloadingResume(true);

    // Simulate download
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'Kush_Rank_Resume.pdf';
      link.click();
      setDownloadingResume(false);
    }, 1000);
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-almostBlack relative overflow-hidden flex items-center justify-center px-6 py-20"
    >
      {/* Particle background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* Background effects */}
      {/* Decorative background effects (hidden on mobile for performance) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl mobile-hide" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange/10 rounded-full blur-3xl mobile-hide" />

      {/* Content */}
      <div className="max-w-6xl mx-auto relative z-10 text-center">
        {/* Main CTA */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-8"
        >
          <span className="text-gradient">READY TO BUILD</span>
          <br />
          <span className="text-gradient">SOMETHING TOGETHER?</span>
        </h2>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-slate/80 mb-16 font-mono"
        >
          Let's turn data into impact
        </p>

        {/* Download Resume Button */}
        <div className="mb-16">
          <button
            onClick={handleDownloadResume}
            disabled={downloadingResume}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange/20 to-cyan/20 border-2 border-orange/50 rounded-lg font-mono font-bold text-orange hover:border-cyan hover:shadow-[0_0_40px_rgba(100,255,218,0.4)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {downloadingResume ? (
              <>
                <div className="w-5 h-5 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                <span>DOWNLOADING...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-lg">DOWNLOAD RESUME</span>
              </>
            )}
          </button>
        </div>

        {/* Contact Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-20">
          {contactOptions.map((option) => (
            <a
              key={option.id}
              href={option.url}
              target={option.id !== 'email' ? '_blank' : undefined}
              rel={option.id !== 'email' ? 'noopener noreferrer' : undefined}
              onClick={handleRipple}
              className="group relative p-6 rounded-lg border-2 border-cyan/20 bg-almostBlack/60 backdrop-blur-sm active:border-cyan/50 md:hover:border-cyan/50 active:shadow-[0_0_30px_rgba(100,255,218,0.2)] md:hover:shadow-[0_0_30px_rgba(100,255,218,0.2)] transition-all duration-300 active:scale-105 md:hover:scale-105 overflow-hidden min-h-[180px] touch-manipulation"
            >
              {/* Icon */}
              <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                {renderIcon(option.icon)}
              </div>

              {/* Label */}
              <div className="text-lg font-mono font-bold text-cyan mb-2">
                {option.label}
              </div>

              {/* Tooltip */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-deepBlue border border-cyan/30 rounded text-xs font-mono text-cyan whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-bottom-14 transition-all duration-300 pointer-events-none">
                {option.details}
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="space-y-6 text-slate/60 font-mono text-sm">
          <p className="text-base font-bold text-cyan">
            Designed & Built by Kush Rank
          </p>
          <p>
            © 2025 | Made with Next.js, GSAP & Coffee ☕
          </p>

          {/* JARVIS Round Button */}
          <div className="flex justify-center">
            <div className="group relative">
              <button
                onClick={() => {
                  setShowJarvis(true);
                  setJarvisMessages([
                    { type: 'jarvis', text: "JARVIS activated. Hello! Type 'help' for available commands." },
                  ]);
                }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan/20 to-green-500/20 border-2 border-cyan/50 flex items-center justify-center text-3xl hover:border-green-500 hover:shadow-[0_0_40px_rgba(100,255,218,0.4)] transition-all duration-300 hover:scale-110 relative overflow-hidden"
              >
                <span className="relative z-10">🤖</span>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {/* Hover Tooltip */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-deepBlue border-2 border-cyan/30 rounded-lg text-xs font-mono text-cyan whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="text-center">
                  <div className="font-bold text-sm mb-1">Hi I'm JARVIS,</div>
                  <div className="text-slate/80">Kush's personal AI assistant</div>
                </div>
                {/* Arrow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-cyan/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JARVIS Small Window */}
      {showJarvis && (
        <div className="fixed bottom-6 right-6 z-[9999] w-96 max-h-[500px] bg-deepBlue/95 border-2 border-green-500/30 rounded-lg shadow-[0_0_40px_rgba(100,255,218,0.3)] backdrop-blur-sm animate-zoom-in">
          {/* Window Header */}
          <div className="flex items-center justify-between p-4 border-b border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="text-green-500 text-sm font-mono flex items-center gap-2">
                <span>🤖</span>
                <span>jarvis-terminal</span>
              </div>
            </div>
            <button
              onClick={() => setShowJarvis(false)}
              className="text-slate/60 hover:text-cyan transition-colors duration-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3 font-mono text-xs scrollbar-thin scrollbar-thumb-cyan/30 scrollbar-track-almostBlack">
            {jarvisMessages.map((msg, index) => (
              <div key={index} className={msg.type === 'user' ? 'text-cyan' : 'text-green-500'}>
                <span className="text-orange font-bold">
                  {msg.type === 'user' ? '> ' : 'JARVIS: '}
                </span>
                <span className="whitespace-pre-line">
                  {renderMessageWithLinks(msg.text)}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleJarvisSubmit} className="p-4 border-t border-green-500/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={jarvisInput}
                onChange={(e) => setJarvisInput(e.target.value)}
                placeholder="Type a command..."
                className="flex-1 px-3 py-2 bg-almostBlack border border-cyan/30 rounded text-cyan font-mono text-sm focus:outline-none focus:border-cyan"
                autoFocus
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping}
                className="px-4 py-2 bg-cyan/20 border border-cyan/30 rounded font-mono text-cyan text-sm hover:bg-cyan/30 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTyping ? '...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
