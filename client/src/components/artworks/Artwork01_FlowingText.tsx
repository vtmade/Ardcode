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
      
      // Create a mesh-like web with more connecting lines
      const gridSize = 40;
      const rows = Math.floor(p.height / gridSize) + 1;
      const cols = Math.floor(p.width / gridSize) + 1;
      
      // Horizontal mesh lines
      for (let row = 0; row < rows; row++) {
        const y = row * gridSize;
        for (let col = 0; col < cols - 1; col++) {
          const x1 = col * gridSize;
          const x2 = (col + 1) * gridSize;
          
          // Only create lines within web radius with some randomness
          const distFromCenter = p.dist(x1 + gridSize/2, y, centerX, centerY);
          if (distFromCenter < maxRadius && p.random() < 0.7) {
            spiderWeb.push({
              type: 'mesh',
              x1: x1 + p.random(-5, 5),
              y1: y + p.random(-5, 5),
              x2: x2 + p.random(-5, 5),
              y2: y + p.random(-5, 5)
            });
          }
        }
      }
      
      // Vertical mesh lines
      for (let col = 0; col < cols; col++) {
        const x = col * gridSize;
        for (let row = 0; row < rows - 1; row++) {
          const y1 = row * gridSize;
          const y2 = (row + 1) * gridSize;
          
          // Only create lines within web radius with some randomness
          const distFromCenter = p.dist(x, y1 + gridSize/2, centerX, centerY);
          if (distFromCenter < maxRadius && p.random() < 0.7) {
            spiderWeb.push({
              type: 'mesh',
              x1: x + p.random(-5, 5),
              y1: y1 + p.random(-5, 5),
              x2: x + p.random(-5, 5),
              y2: y2 + p.random(-5, 5)
            });
          }
        }
      }
      
      // Add some diagonal connections for more natural look
      for (let i = 0; i < 30; i++) {
        const angle = p.random(0, p.TWO_PI);
        const dist1 = p.random(50, maxRadius * 0.8);
        const dist2 = p.random(50, maxRadius * 0.8);
        const angle2 = angle + p.random(-0.5, 0.5);
        
        spiderWeb.push({
          type: 'diagonal',
          x1: centerX + p.cos(angle) * dist1,
          y1: centerY + p.sin(angle) * dist1,
          x2: centerX + p.cos(angle2) * dist2,
          y2: centerY + p.sin(angle2) * dist2
        });
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
        size: p.random(1.2, 4.8),
        alpha: p.random(0.3, 0.9),
        shimmer: p.random(0, p.TWO_PI),
        wobble: p.random(0.01, 0.03),
        refraction: p.random(0.5, 1.5)
      });
    }

    p.draw = () => {
      // Dark background like other artworks
      p.background(10, 10, 10);
      
      // Draw spider web with thicker lines like particle galaxy
      p.strokeWeight(1.2);
      spiderWeb.forEach(thread => {
        const shimmer = p.sin(p.frameCount * 0.015) * 0.2 + 0.8;
        p.stroke(120, 120, 120, 80 * shimmer);
        p.line(thread.x1, thread.y1, thread.x2, thread.y2);
      });
      
      // Draw dewdrops
      dewdrops.forEach((drop, index) => {
        // Very gentle mouse interaction
        let mouseDistance = p.dist(p.mouseX, p.mouseY, drop.x, drop.y);
        if (mouseDistance < mouseInfluence) {
          let angle = p.atan2(drop.y - p.mouseY, drop.x - p.mouseX);
          let force = (mouseInfluence - mouseDistance) / mouseInfluence;
          
          // Extremely soft repulsion
          drop.vx += p.cos(angle) * force * 0.1;
          drop.vy += p.sin(angle) * force * 0.1;
        }
        
        // Very gentle return to original position
        drop.vx += (drop.originalX - drop.x) * 0.002;
        drop.vy += (drop.originalY - drop.y) * 0.002;
        
        // Extremely subtle wobble like real dewdrops
        drop.vx += p.sin(p.frameCount * drop.wobble + drop.shimmer) * 0.02;
        drop.vy += p.cos(p.frameCount * drop.wobble * 0.7 + drop.shimmer) * 0.01;
        
        // Apply velocity with very strong damping for smooth movement
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.vx *= 0.98;
        drop.vy *= 0.98;
        
        // Update shimmer
        drop.shimmer += 0.02;
        
        // Draw dewdrop with gentle twinkling effect in ochre/brown tones
        p.push();
        p.translate(drop.x, drop.y);
        
        // Gentle twinkling intensity
        const twinkle = p.sin(drop.shimmer * 1.5) * 0.4 + 0.6;
        const sparkle = p.sin(drop.shimmer * 2.3) * 0.2 + 0.8;
        const currentAlpha = drop.alpha * twinkle * 0.9;
        
        // Main dewdrop body in subtle brown/ochre
        p.fill(139, 115, 85, currentAlpha * 120);
        p.noStroke();
        p.ellipse(0, 0, drop.size * 1.2, drop.size * 1.2);
        
        // Gentle twinkling center in warm ochre
        const centerBrightness = twinkle * sparkle;
        p.fill(180, 150, 100, centerBrightness * 150);
        p.ellipse(-drop.size * 0.15, -drop.size * 0.15, drop.size * 0.3, drop.size * 0.3);
        
        // Soft highlight for gentle twinkle
        if (twinkle > 0.7) {
          p.fill(220, 190, 130, (twinkle - 0.7) * 3 * 180);
          p.ellipse(0, 0, drop.size * 0.2, drop.size * 0.2);
        }
        
        // Very subtle outer glow in warm tones
        if (sparkle > 0.8) {
          p.fill(160, 130, 90, (sparkle - 0.8) * 5 * 30);
          p.ellipse(0, 0, drop.size * 2.5, drop.size * 2.5);
        }
        
        p.pop();
      });
      
      // Remove morning mist for darker aesthetic
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
          size: p.random(1.2, 3.6),
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
          size: p.random(0.5, 1.5),
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
      className="w-full h-full cursor-crosshair"
      style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
      }}
    />
  );
}
