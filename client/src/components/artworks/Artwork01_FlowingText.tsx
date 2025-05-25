import { useEffect, useRef } from "react";
import { useP5 } from "@/hooks/useP5";

export default function Artwork01_FlowingText() {
  const containerRef = useRef<HTMLDivElement>(null);

  const sketch = (p: any) => {
    let dewdrops: any[] = [];
    let spiderWeb: any[] = [];
    let mouseInfluence = 120;

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      
      // Create spider web structure
      createSpiderWeb();
      
      // Create dewdrops on the web
      for (let i = 0; i < 80; i++) {
        createDewdrop();
      }
    };

    function createSpiderWeb() {
      spiderWeb = [];
      const centerX = p.width / 2;
      const centerY = p.height / 2;
      const maxRadius = Math.min(p.width, p.height) * 0.4;
      
      // Radial threads
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * p.TWO_PI;
        spiderWeb.push({
          type: 'radial',
          x1: centerX,
          y1: centerY,
          x2: centerX + p.cos(angle) * maxRadius,
          y2: centerY + p.sin(angle) * maxRadius
        });
      }
      
      // Circular threads
      for (let r = 50; r <= maxRadius; r += 60) {
        for (let i = 0; i < 64; i++) {
          const angle1 = (i / 64) * p.TWO_PI;
          const angle2 = ((i + 1) / 64) * p.TWO_PI;
          spiderWeb.push({
            type: 'circular',
            x1: centerX + p.cos(angle1) * r,
            y1: centerY + p.sin(angle1) * r,
            x2: centerX + p.cos(angle2) * r,
            y2: centerY + p.sin(angle2) * r
          });
        }
      }
    }

    function createDewdrop() {
      // Place dewdrops on web intersections and threads
      const centerX = p.width / 2;
      const centerY = p.height / 2;
      const maxRadius = Math.min(p.width, p.height) * 0.4;
      
      const radius = p.random(50, maxRadius);
      const angle = p.random(0, p.TWO_PI);
      const x = centerX + p.cos(angle) * radius + p.random(-20, 20);
      const y = centerY + p.sin(angle) * radius + p.random(-20, 20);
      
      dewdrops.push({
        originalX: x,
        originalY: y,
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        size: p.random(3, 12),
        alpha: p.random(0.3, 0.9),
        shimmer: p.random(0, p.TWO_PI),
        wobble: p.random(0.01, 0.03),
        refraction: p.random(0.5, 1.5)
      });
    }

    p.draw = () => {
      // Dawn gradient background
      for (let i = 0; i <= p.height; i++) {
        const inter = p.map(i, 0, p.height, 0, 1);
        const c = p.lerpColor(
          p.color(15, 25, 35), // Dark blue dawn
          p.color(45, 65, 85), // Lighter dawn
          inter
        );
        p.stroke(c);
        p.line(0, i, p.width, i);
      }
      
      // Draw spider web with subtle shimmer
      p.strokeWeight(0.8);
      spiderWeb.forEach(thread => {
        const shimmer = p.sin(p.frameCount * 0.02) * 0.1 + 0.8;
        p.stroke(80, 100, 120, 60 * shimmer);
        p.line(thread.x1, thread.y1, thread.x2, thread.y2);
      });
      
      // Draw dewdrops
      dewdrops.forEach((drop, index) => {
        // Mouse interaction - gentle repulsion and attraction
        let mouseDistance = p.dist(p.mouseX, p.mouseY, drop.x, drop.y);
        if (mouseDistance < mouseInfluence) {
          let angle = p.atan2(drop.y - p.mouseY, drop.x - p.mouseX);
          let force = (mouseInfluence - mouseDistance) / mouseInfluence;
          
          // Gentle repulsion when close, attraction when farther
          if (mouseDistance < mouseInfluence * 0.3) {
            drop.vx += p.cos(angle) * force * 0.8;
            drop.vy += p.sin(angle) * force * 0.8;
          } else {
            drop.vx -= p.cos(angle) * force * 0.2;
            drop.vy -= p.sin(angle) * force * 0.2;
          }
        }
        
        // Gentle return to original position
        drop.vx += (drop.originalX - drop.x) * 0.005;
        drop.vy += (drop.originalY - drop.y) * 0.005;
        
        // Subtle wobble like real dewdrops
        drop.vx += p.sin(p.frameCount * drop.wobble + drop.shimmer) * 0.1;
        drop.vy += p.cos(p.frameCount * drop.wobble * 0.7 + drop.shimmer) * 0.05;
        
        // Apply gravity very subtly
        drop.vy += 0.01;
        
        // Apply velocity with strong damping for realistic water behavior
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.vx *= 0.92;
        drop.vy *= 0.92;
        
        // Update shimmer
        drop.shimmer += 0.02;
        
        // Draw dewdrop with multiple layers for realism
        p.push();
        p.translate(drop.x, drop.y);
        
        // Main dewdrop body
        const currentAlpha = drop.alpha * (0.7 + 0.3 * p.sin(drop.shimmer));
        p.fill(200, 220, 240, currentAlpha * 150);
        p.noStroke();
        p.ellipse(0, 0, drop.size * 2, drop.size * 2);
        
        // Bright highlight (refraction)
        p.fill(255, 255, 255, currentAlpha * 200);
        p.ellipse(-drop.size * 0.3, -drop.size * 0.3, drop.size * 0.6, drop.size * 0.6);
        
        // Subtle reflection
        p.fill(150, 200, 255, currentAlpha * 80);
        p.ellipse(drop.size * 0.2, drop.size * 0.2, drop.size * 0.4, drop.size * 0.4);
        
        // Edge highlight
        p.noFill();
        p.stroke(255, 255, 255, currentAlpha * 100);
        p.strokeWeight(0.5);
        p.ellipse(0, 0, drop.size * 2, drop.size * 2);
        
        p.pop();
      });
      
      // Add morning mist effect
      const mistIntensity = p.sin(p.frameCount * 0.01) * 0.05 + 0.03;
      p.fill(255, 255, 255, mistIntensity * 255);
      p.noStroke();
      p.rect(0, 0, p.width, p.height);
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      createSpiderWeb();
    };

    p.mousePressed = () => {
      // Create new dewdrops at mouse position
      for (let i = 0; i < 3; i++) {
        dewdrops.push({
          originalX: p.mouseX + p.random(-30, 30),
          originalY: p.mouseY + p.random(-30, 30),
          x: p.mouseX + p.random(-30, 30),
          y: p.mouseY + p.random(-30, 30),
          vx: p.random(-1, 1),
          vy: p.random(-1, 1),
          size: p.random(4, 8),
          alpha: 0.8,
          shimmer: p.random(0, p.TWO_PI),
          wobble: p.random(0.01, 0.03),
          refraction: p.random(0.5, 1.5)
        });
      }
      
      // Remove excess dewdrops to maintain performance
      if (dewdrops.length > 120) {
        dewdrops.splice(0, 10);
      }
    };

    p.mouseMoved = () => {
      // Add gentle sparkle effect when moving mouse
      if (p.random() < 0.1) {
        dewdrops.push({
          originalX: p.mouseX + p.random(-50, 50),
          originalY: p.mouseY + p.random(-50, 50),
          x: p.mouseX + p.random(-50, 50),
          y: p.mouseY + p.random(-50, 50),
          vx: p.random(-0.5, 0.5),
          vy: p.random(-0.5, 0.5),
          size: p.random(1, 3),
          alpha: 0.9,
          shimmer: p.random(0, p.TWO_PI),
          wobble: p.random(0.02, 0.04),
          refraction: p.random(0.5, 1.5)
        });
      }
    };
  };

  useP5(sketch, containerRef);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-none"
      style={{ 
        background: 'linear-gradient(135deg, #0f1923 0%, #2d4356 50%, #1a2836 100%)'
      }}
    />
  );
}
