'use client';

import { useEffect, useState, useRef } from 'react';

interface Message {
  type: 'user' | 'jarvis';
  text: string;
}

interface JarvisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JarvisModal({ isOpen, onClose }: JarvisModalProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'jarvis',
      text: "Hello! I'm JARVIS, Kush's Personal Assistant. Type 'help' to see available commands.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const jarvisResponses: { [key: string]: string } = {
    hello: "Hello! I'm JARVIS, Kush's Personal Assistant. How can I help you today?",
    hi: "Hi there! Ready to explore Kush's portfolio?",
    hey: "Hey! What would you like to know?",
    projects: `Kush has built some impressive projects:
• UniWallet - AI-powered campus wallet (Top 5 @ HackFest)
• Student Performance Predictor with 8 ML models
• Flight Price Prediction with comprehensive EDA
• JARVIS Personal Assistant (that's me!)
• Sales EDA & Purchase Prediction
Type 'github' to visit the repositories!`,
    skills: `Kush's tech stack:
🤖 ML: Python, Scikit-learn, TensorFlow, XGBoost
📊 Data: Pandas, NumPy, Matplotlib, Seaborn
🌐 Web: Flask, React, Next.js, TypeScript
🧠 Currently Learning: GenAI, LLMs, Deep Learning`,
    contact: `You can reach Kush at:
📧 Email: kush.m.rank@gmail.com
💼 LinkedIn: linkedin.com/in/kush-rank-795377331
💻 GitHub: github.com/KushDev19
🏆 DevPost: devpost.com/KushDev19`,
    github: "Opening Kush's GitHub profile...",
    joke: `Why do programmers prefer dark mode?
Because light attracts bugs! 🐛😄`,
    help: `Available commands:
• hello/hi/hey - Get a greeting
• projects - See Kush's projects
• skills - View tech stack
• contact - Get contact info
• github - Open GitHub profile
• joke - Hear a programming joke
• clear - Clear chat history
• exit - Close JARVIS`,
    exit: 'Goodbye! Type "jarvis" anywhere on the page to summon me again.',
    clear: 'CLEAR_CHAT',
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const typewriterEffect = (text: string, callback: () => void) => {
    setIsTyping(true);
    let index = 0;
    const speed = 20;

    const type = () => {
      if (index < text.length) {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.type === 'jarvis') {
            lastMessage.text = text.slice(0, index + 1);
          }
          return newMessages;
        });
        index++;
        setTimeout(type, speed);
      } else {
        setIsTyping(false);
        callback();
      }
    };

    type();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userInput = input.trim().toLowerCase();
    const userMessage: Message = { type: 'user', text: input.trim() };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Handle special commands
    if (userInput === 'exit') {
      setTimeout(() => {
        const response = jarvisResponses[userInput] || "I don't understand that command. Type 'help' for available commands.";
        setMessages((prev) => [...prev, { type: 'jarvis', text: '' }]);
        typewriterEffect(response, () => {
          setTimeout(() => onClose(), 1500);
        });
      }, 300);
      return;
    }

    if (userInput === 'clear') {
      setMessages([
        {
          type: 'jarvis',
          text: "Chat cleared! Type 'help' to see available commands.",
        },
      ]);
      return;
    }

    if (userInput === 'github') {
      setMessages((prev) => [
        ...prev,
        { type: 'jarvis', text: jarvisResponses.github },
      ]);
      setTimeout(() => {
        window.open('https://github.com/KushDev19', '_blank');
      }, 500);
      return;
    }

    // Regular responses
    setTimeout(() => {
      const response =
        jarvisResponses[userInput] ||
        "I don't understand that command. Type 'help' for available commands.";
      setMessages((prev) => [...prev, { type: 'jarvis', text: '' }]);
      typewriterEffect(response, () => {});
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-almostBlack/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[600px] bg-deepBlue border-2 border-cyan/50 rounded-lg shadow-[0_0_60px_rgba(100,255,218,0.3)] flex flex-col overflow-hidden animate-zoom-in">
        {/* Header */}
        <div className="bg-almostBlack/80 border-b border-cyan/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <h3 className="text-xl font-mono font-bold text-cyan">
              J.A.R.V.I.S. Terminal
            </h3>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-orange" />
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
              aria-label="Close JARVIS"
            />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-almostBlack/40 font-mono text-sm">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-cyan/20 border border-cyan/30 text-cyan'
                    : 'bg-deepBlue/60 border border-orange/30 text-slate/90'
                }`}
              >
                <div className="text-xs mb-1 opacity-60">
                  {message.type === 'user' ? 'You' : 'JARVIS'}
                </div>
                <div className="whitespace-pre-wrap">{message.text}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-deepBlue/60 border border-orange/30 text-slate/90 p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-cyan rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-cyan rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-cyan/30 p-4 bg-almostBlack/80"
        >
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan font-mono">
                &gt;
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a command..."
                className="w-full bg-deepBlue/60 border border-cyan/30 rounded px-8 py-2 text-slate/90 font-mono placeholder:text-slate/40 focus:outline-none focus:border-cyan focus:shadow-[0_0_20px_rgba(100,255,218,0.2)] transition-all"
                disabled={isTyping}
              />
            </div>
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="px-6 py-2 bg-cyan/20 border border-cyan/50 rounded text-cyan font-mono hover:bg-cyan/30 hover:shadow-[0_0_20px_rgba(100,255,218,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-slate/50 mt-2 font-mono">
            Press ESC to close • Type "help" for commands
          </p>
        </form>
      </div>
    </div>
  );
}
