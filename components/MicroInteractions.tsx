'use client';

import { useEffect, useState } from 'react';
import JarvisModal from './JarvisModal';
import MatrixRain from './MatrixRain';
import AchievementsSystem from './AchievementsSystem';
import CursorTrail from './CursorTrail';

export default function MicroInteractions() {
  const [showJarvis, setShowJarvis] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(false);
  const [jarvisBuffer, setJarvisBuffer] = useState('');
  const [konamiBuffer, setKonamiBuffer] = useState<string[]>([]);

  const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];

  // Listen for "jarvis" keyword
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const newBuffer = (jarvisBuffer + e.key.toLowerCase()).slice(-6);
      setJarvisBuffer(newBuffer);

      if (newBuffer === 'jarvis') {
        setShowJarvis(true);
        setJarvisBuffer('');
        // Dispatch custom event for achievements
        window.dispatchEvent(new Event('jarvis-opened'));
        playSound('activate');
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [jarvisBuffer]);

  // Listen for Konami code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const newBuffer = [...konamiBuffer, e.key].slice(-10);
      setKonamiBuffer(newBuffer);

      if (newBuffer.join(',') === konamiCode.join(',')) {
        setShowMatrix(true);
        setKonamiBuffer([]);
        // Dispatch custom event for achievements
        window.dispatchEvent(new Event('konami-activated'));
        playSound('success');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiBuffer]);

  // Sound effects (simple beep using Web Audio API)
  const playSound = (type: 'click' | 'activate' | 'success' | 'whoosh') => {
    if (!soundsEnabled) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'click':
        oscillator.frequency.value = 400;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
      case 'activate':
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'success':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.2;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 1000;
          gain2.gain.value = 0.2;
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.2);
        }, 100);
        break;
      case 'whoosh':
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.05;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
    }
  };

  // Add click sound to buttons (optional)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        playSound('click');
      }
    };

    if (soundsEnabled) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [soundsEnabled]);

  // Section transition sound (optional)
  useEffect(() => {
    if (!soundsEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playSound('whoosh');
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = ['about', 'skills', 'projects', 'github', 'contact'];
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [soundsEnabled]);

  return (
    <>
      {/* Jarvis Modal */}
      <JarvisModal isOpen={showJarvis} onClose={() => setShowJarvis(false)} />

      {/* Matrix Rain */}
      <MatrixRain
        isActive={showMatrix}
        onComplete={() => setShowMatrix(false)}
      />

      {/* Achievements System */}
      <AchievementsSystem />

      {/* Cursor Trail */}
      <CursorTrail enabled={true} />

      {/* Sound Toggle Button */}
      <button
        onClick={() => setSoundsEnabled(!soundsEnabled)}
        className="fixed bottom-4 left-4 z-[90] p-3 bg-deepBlue/80 border-2 border-cyan/30 rounded-full hover:border-cyan hover:shadow-[0_0_20px_rgba(100,255,218,0.3)] transition-all group"
        aria-label={soundsEnabled ? 'Mute sounds' : 'Enable sounds'}
        title={soundsEnabled ? 'Mute sounds' : 'Enable sounds'}
      >
        {soundsEnabled ? (
          <svg
            className="w-5 h-5 text-cyan"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-slate/60"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Easter Egg Hints (appears after some time) */}
      <div className="fixed top-20 right-4 z-[90] hidden md:block">
        <div className="text-xs font-mono text-slate/30 text-right space-y-1">
          <p>💡 Type "jarvis" anywhere</p>
          <p>🎮 Try the Konami code</p>
        </div>
      </div>
    </>
  );
}
