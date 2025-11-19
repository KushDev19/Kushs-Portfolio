'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function FancyLoader({ onComplete }: LoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [currentCommand, setCurrentCommand] = useState(0);
  const [commandText, setCommandText] = useState('');
  const [metrics, setMetrics] = useState({
    accuracy: 0,
    loss: 100,
    epochs: 0,
  });

  const commands = [
    { text: '$ initializing neural network...', duration: 200 },
    { text: '$ loading training data...', duration: 180 },
    { text: '$ preprocessing features...', duration: 180 },
    { text: '$ training model architecture...', duration: 200 },
    { text: '$ optimizing hyperparameters...', duration: 180 },
    { text: '$ validating predictions...', duration: 180 },
    { text: '$ deployment ready!', duration: 150 },
  ];

  // Calculate total duration for sync
  const totalTypingTime = commands.reduce((sum, cmd) => sum + (cmd.text.length * 15) + cmd.duration, 0);
  const metricsUpdateInterval = totalTypingTime / 100; // Update 100 times to reach 100%

  // Neural network visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 200;

    const nodes: NeuralNode[] = [];
    const layers = [4, 6, 6, 4]; // Neural network structure
    const layerSpacing = canvas.width / (layers.length + 1);

    // Create nodes
    layers.forEach((count, layerIndex) => {
      const x = layerSpacing * (layerIndex + 1);
      const nodeSpacing = canvas.height / (count + 1);

      for (let i = 0; i < count; i++) {
        nodes.push({
          x,
          y: nodeSpacing * (i + 1),
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
        });
      }
    });

    let frame = 0;
    const animate = () => {
      ctx.fillStyle = 'rgba(2, 12, 27, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frame++;

      // Draw connections with flowing effect
      let nodeIndex = 0;
      layers.forEach((count, layerIndex) => {
        if (layerIndex < layers.length - 1) {
          const nextLayerStart = nodeIndex + count;
          const nextLayerCount = layers[layerIndex + 1];

          for (let i = 0; i < count; i++) {
            for (let j = 0; j < nextLayerCount; j++) {
              const fromNode = nodes[nodeIndex + i];
              const toNode = nodes[nextLayerStart + j];

              // Flowing gradient effect
              const gradient = ctx.createLinearGradient(
                fromNode.x,
                fromNode.y,
                toNode.x,
                toNode.y
              );

              const flowPos = (Math.sin(frame * 0.05 + i + j) + 1) / 2;
              gradient.addColorStop(0, 'rgba(100, 255, 218, 0.1)');
              gradient.addColorStop(flowPos, 'rgba(100, 255, 218, 0.5)');
              gradient.addColorStop(1, 'rgba(255, 107, 53, 0.1)');

              ctx.beginPath();
              ctx.moveTo(fromNode.x, fromNode.y);
              ctx.lineTo(toNode.x, toNode.y);
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
        nodeIndex += count;
      });

      // Draw nodes with pulsing effect
      nodes.forEach((node, i) => {
        const pulseSize = Math.sin(frame * 0.1 + i) * 2 + 6;

        // Outer glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseSize);
        gradient.addColorStop(0, i % 2 === 0 ? 'rgba(100, 255, 218, 0.8)' : 'rgba(255, 107, 53, 0.8)');
        gradient.addColorStop(1, 'rgba(100, 255, 218, 0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#64ffda' : '#ff6b35';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // Command typing effect
  useEffect(() => {
    if (currentCommand >= commands.length) {
      // All commands done, trigger completion with glitch effect
      setTimeout(() => {
        gsap.to(loaderRef.current, {
          opacity: 0,
          scale: 1.1,
          filter: 'blur(10px)',
          duration: 0.4,
          ease: 'power2.in',
          onComplete,
        });
      }, 200);
      return;
    }

    const command = commands[currentCommand];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= command.text.length) {
        setCommandText(command.text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentCommand((prev) => prev + 1);
          setCommandText('');
        }, command.duration);
      }
    }, 15);

    return () => clearInterval(typeInterval);
  }, [currentCommand, onComplete]);

  // Update metrics - synced with command duration
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        accuracy: Math.min(prev.accuracy + (99.8 / 100), 99.8),
        loss: Math.max(prev.loss - (100 / 100), 0.01),
        epochs: Math.min(prev.epochs + 1, 100),
      }));
    }, metricsUpdateInterval);

    return () => clearInterval(interval);
  }, [metricsUpdateInterval]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 bg-almostBlack flex items-center justify-center"
    >
      <div className="max-w-4xl w-full px-6">
        {/* Terminal Header */}
        <div className="bg-deepBlue/50 border border-cyan/20 rounded-t-lg p-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-orange"></div>
            <div className="w-3 h-3 rounded-full bg-cyan/50"></div>
            <div className="w-3 h-3 rounded-full bg-slate/30"></div>
          </div>
          <span className="text-xs text-slate/60 font-mono ml-4">
            kush@ml-engineer: ~/portfolio
          </span>
        </div>

        {/* Terminal Body */}
        <div className="bg-almostBlack/95 border-x border-b border-cyan/20 rounded-b-lg p-6 backdrop-blur-sm">
          {/* Neural Network Visualization */}
          <div className="mb-6 flex justify-center">
            <canvas
              ref={canvasRef}
              className="border border-cyan/10 rounded-lg bg-deepBlue/30"
            />
          </div>

          {/* Command Output */}
          <div className="space-y-2 mb-6">
            {commands.slice(0, currentCommand).map((cmd, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-mono">
                <span className="text-cyan">✓</span>
                <span className="text-slate/70">{cmd.text}</span>
              </div>
            ))}
            {currentCommand < commands.length && (
              <div className="flex items-center gap-2 text-sm font-mono">
                <span className="text-orange animate-pulse">▸</span>
                <span className="text-cyan">{commandText}</span>
                <span className="animate-pulse">█</span>
              </div>
            )}
          </div>

          {/* Metrics Dashboard */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-deepBlue/30 border border-cyan/20 rounded-lg p-3">
              <div className="text-xs text-slate/60 font-mono mb-1">ACCURACY</div>
              <div className="text-2xl font-bold text-cyan font-mono">
                {metrics.accuracy.toFixed(2)}%
              </div>
              <div className="w-full h-1 bg-deepBlue rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan to-orange transition-all duration-300"
                  style={{ width: `${metrics.accuracy}%` }}
                />
              </div>
            </div>

            <div className="bg-deepBlue/30 border border-orange/20 rounded-lg p-3">
              <div className="text-xs text-slate/60 font-mono mb-1">LOSS</div>
              <div className="text-2xl font-bold text-orange font-mono">
                {metrics.loss.toFixed(3)}
              </div>
              <div className="w-full h-1 bg-deepBlue rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange to-cyan transition-all duration-300"
                  style={{ width: `${100 - metrics.loss}%` }}
                />
              </div>
            </div>

            <div className="bg-deepBlue/30 border border-cyan/20 rounded-lg p-3">
              <div className="text-xs text-slate/60 font-mono mb-1">EPOCHS</div>
              <div className="text-2xl font-bold text-cyan font-mono">
                {metrics.epochs}/100
              </div>
              <div className="w-full h-1 bg-deepBlue rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan via-orange to-cyan transition-all duration-300"
                  style={{ width: `${metrics.epochs}%` }}
                />
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate/60 pt-4 border-t border-slate/10">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan rounded-full animate-pulse"></span>
                TRAINING
              </span>
              <span>GPU: RTX 4090</span>
              <span>RAM: 64GB</span>
            </div>
            <div className="flex items-center gap-2">
              <span>FRAMEWORK: PyTorch</span>
              <span className="text-cyan">◆</span>
            </div>
          </div>
        </div>

        {/* Glitch Text Effect */}
        <div className="text-center mt-8">
          <div className="text-xs font-mono text-slate/40 tracking-widest animate-pulse">
            INITIALIZING PORTFOLIO EXPERIENCE
          </div>
        </div>
      </div>
    </div>
  );
}
