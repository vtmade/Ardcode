import { useEffect, useRef } from "react";
import { useP5 } from "@/hooks/useP5";

export default function Artwork01_FlowingText() {
  const containerRef = useRef<HTMLDivElement>(null);

  const sketch = (p: any) => {
    let particles: any[] = [];
    let font: any;
    let textPoints: any[] = [];
    let mouseInfluence = 50;

    p.preload = () => {
      // We'll create text without loading a font for simplicity
    };

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      
      // Create text particles for "The code that can be named is not the eternal code"
      const text = "The code that can be named\nis not the eternal code";
      const lines = text.split('\n');
      
      lines.forEach((line, lineIndex) => {
        for (let i = 0; i < line.length; i++) {
          if (line[i] !== ' ') {
            particles.push({
              char: line[i],
              originalX: 100 + i * 20,
              originalY: p.height / 2 - 20 + lineIndex * 40,
              x: 100 + i * 20,
              y: p.height / 2 - 20 + lineIndex * 40,
              vx: 0,
              vy: 0,
              size: p.random(12, 24),
              alpha: p.random(0.6, 1),
              drift: p.random(-0.5, 0.5)
            });
          }
        }
      });
    };

    p.draw = () => {
      p.background(10, 10, 10, 50); // Trailing effect
      
      particles.forEach(particle => {
        // Mouse interaction
        let mouseDistance = p.dist(p.mouseX, p.mouseY, particle.x, particle.y);
        if (mouseDistance < mouseInfluence) {
          let angle = p.atan2(particle.y - p.mouseY, particle.x - p.mouseX);
          let force = (mouseInfluence - mouseDistance) / mouseInfluence;
          particle.vx += p.cos(angle) * force * 0.5;
          particle.vy += p.sin(angle) * force * 0.5;
        }
        
        // Return to original position
        particle.vx += (particle.originalX - particle.x) * 0.01;
        particle.vy += (particle.originalY - particle.y) * 0.01;
        
        // Add gentle drift
        particle.vx += particle.drift * 0.1;
        particle.vy += p.sin(p.frameCount * 0.01 + particle.originalX * 0.01) * 0.2;
        
        // Apply velocity with damping
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        
        // Render character
        p.fill(139, 115, 85, particle.alpha * 255);
        p.textSize(particle.size);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(particle.char, particle.x, particle.y);
        
        // Add glow effect
        p.fill(139, 115, 85, particle.alpha * 50);
        p.textSize(particle.size + 4);
        p.text(particle.char, particle.x, particle.y);
      });
      
      // Add breathing effect overlay
      let breathe = p.sin(p.frameCount * 0.02) * 0.1 + 0.9;
      p.fill(139, 115, 85, 10 * breathe);
      p.rect(0, 0, p.width, p.height);
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.mousePressed = () => {
      // Create ripple effect
      for (let i = 0; i < 10; i++) {
        particles.push({
          char: ['∞', '∅', '≈', '∴', '∵'][Math.floor(Math.random() * 5)],
          originalX: p.mouseX,
          originalY: p.mouseY,
          x: p.mouseX + p.random(-20, 20),
          y: p.mouseY + p.random(-20, 20),
          vx: p.random(-2, 2),
          vy: p.random(-2, 2),
          size: p.random(8, 16),
          alpha: 1,
          drift: 0
        });
      }
    };
  };

  useP5(sketch, containerRef);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-crosshair"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' }}
    />
  );
}
