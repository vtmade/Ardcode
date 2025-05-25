import { useEffect, useRef } from "react";
import { useP5 } from "@/hooks/useP5";

export default function Artwork01_FlowingText() {
  const containerRef = useRef<HTMLDivElement>(null);

  const sketch = (p: any) => {
    let dewDrops: any[] = [];
    let mouseInfluence = 80;

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      
      // Create dewdrop text - "Morning whispers on silk threads"
      const text = "Morning whispers\non silk threads\ntremble with light";
      const lines = text.split('\n');
      
      lines.forEach((line, lineIndex) => {
        for (let i = 0; i < line.length; i++) {
          if (line[i] !== ' ') {
            dewDrops.push({
              char: line[i],
              homeX: p.width / 2 - line.length * 10 + i * 20,
              homeY: p.height / 2 - 30 + lineIndex * 40,
              x: p.width / 2 - line.length * 10 + i * 20 + p.random(-2, 2),
              y: p.height / 2 - 30 + lineIndex * 40 + p.random(-1, 1),
              tension: 0.985,
              dampening: 0.12,
              frequency: p.random(0.003, 0.008),
              amplitude: p.random(0.3, 0.8),
              size: p.random(14, 18),
              shimmer: p.random(0.7, 1.0)
            });
          }
        }
      });
    };

    p.draw = () => {
      // Soft morning mist background
      p.background(248, 246, 240, 30);
      
      dewDrops.forEach(drop => {
        // Gentle breathing motion like morning breeze
        const time = p.frameCount * 0.01;
        const sway = p.sin(time * drop.frequency + drop.homeX * 0.01) * drop.amplitude;
        const targetX = drop.homeX + sway;
        const targetY = drop.homeY + p.cos(time * drop.frequency * 0.7) * 0.2;
        
        // Mouse interaction - gentle disturbance
        let mouseDistance = p.dist(p.mouseX, p.mouseY, drop.x, drop.y);
        if (mouseDistance < mouseInfluence) {
          let angle = p.atan2(drop.y - p.mouseY, drop.x - p.mouseX);
          let force = (mouseInfluence - mouseDistance) / mouseInfluence;
          drop.x += p.cos(angle) * force * 2;
          drop.y += p.sin(angle) * force * 2;
        }
        
        // Surface tension draws each character home
        drop.x += (targetX - drop.x) * drop.dampening;
        drop.y += (targetY - drop.y) * drop.dampening;
        
        // Render dewdrop character with shimmer
        const shimmer = 0.1 + p.abs(p.sin(time * 0.005 + drop.homeX * 0.02)) * 0.1;
        const alpha = drop.shimmer * (0.8 + shimmer);
        
        // Main character
        p.fill(85, 85, 85, alpha * 200);
        p.textSize(drop.size);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(drop.char, drop.x, drop.y);
        
        // Dewdrop highlight
        p.fill(220, 220, 220, alpha * 100);
        p.textSize(drop.size * 0.8);
        p.text(drop.char, drop.x + 1, drop.y - 1);
        
        // Subtle glow like morning light
        p.fill(255, 255, 240, alpha * 30);
        p.textSize(drop.size + 2);
        p.text(drop.char, drop.x, drop.y);
      });
      
      // Add floating sparkles like dew catching light
      if (p.frameCount % 120 === 0) {
        for (let i = 0; i < 3; i++) {
          let sparkle = {
            x: p.random(p.width),
            y: p.random(p.height),
            life: 60
          };
          
          // Draw tiny sparkle
          p.fill(255, 255, 255, 150);
          p.noStroke();
          p.circle(sparkle.x, sparkle.y, 2);
        }
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.mousePressed = () => {
      // Create gentle dewdrop ripple
      for (let i = 0; i < 5; i++) {
        dewDrops.push({
          char: ['∘', '·', '◦', '•', '○'][Math.floor(Math.random() * 5)],
          homeX: p.mouseX + p.random(-30, 30),
          homeY: p.mouseY + p.random(-30, 30),
          x: p.mouseX + p.random(-10, 10),
          y: p.mouseY + p.random(-10, 10),
          tension: 0.98,
          dampening: 0.08,
          frequency: p.random(0.005, 0.01),
          amplitude: p.random(0.5, 1.2),
          size: p.random(8, 12),
          shimmer: 1.0
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
