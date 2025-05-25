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
      const centerX = p.width / 2 + p.random(-50, 50);
      const centerY = p.height / 2 + p.random(-50, 50);
      const maxRadius = Math.min(p.width, p.height) * 0.35;
      
      // Radial threads - slightly irregular
      const numRadials = 6 + Math.floor(p.random(3));
      for (let i = 0; i < numRadials; i++) {
        const angle = (i / numRadials) * p.TWO_PI + p.random(-0.2, 0.2);
        const radiusVariation = maxRadius * (0.8 + p.random(0.4));
        spiderWeb.push({
          type: 'radial',
          x1: centerX,
          y1: centerY,
          x2: centerX + p.cos(angle) * radiusVariation,
          y2: centerY + p.sin(angle) * radiusVariation
        });
      }
      
      // Organic spiral instead of concentric circles
      const spiralTurns = 4;
      const spiralSteps = 200;
      for (let i = 0; i < spiralSteps - 1; i++) {
        const t1 = i / spiralSteps;
        const t2 = (i + 1) / spiralSteps;
        
        const r1 = (t1 * maxRadius * 0.8) + p.random(-15, 15);
        const r2 = (t2 * maxRadius * 0.8) + p.random(-15, 15);
        
        const angle1 = t1 * spiralTurns * p.TWO_PI + p.random(-0.1, 0.1);
        const angle2 = t2 * spiralTurns * p.TWO_PI + p.random(-0.1, 0.1);
        
        // Only add some segments to make it look more natural
        if (p.random() < 0.7) {
          spiderWeb.push({
            type: 'spiral',
            x1: centerX + p.cos(angle1) * r1,
            y1: centerY + p.sin(angle1) * r1,
            x2: centerX + p.cos(angle2) * r2,
            y2: centerY + p.sin(angle2) * r2
          });
        }
      }
      
      // Add some connecting strands for realism
      for (let i = 0; i < 15; i++) {
        const angle1 = p.random(0, p.TWO_PI);
        const angle2 = angle1 + p.random(-1, 1);
        const r1 = p.random(30, maxRadius * 0.9);
        const r2 = p.random(30, maxRadius * 0.9);
        
        spiderWeb.push({
          type: 'connecting',
          x1: centerX + p.cos(angle1) * r1,
          y1: centerY + p.sin(angle1) * r1,
          x2: centerX + p.cos(angle2) * r2,
          y2: centerY + p.sin(angle2) * r2
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
        size: p.random(1, 4),
        alpha: p.random(0.3, 0.9),
        shimmer: p.random(0, p.TWO_PI),
        wobble: p.random(0.01, 0.03),
        refraction: p.random(0.5, 1.5)
      });
    }

    p.draw = () => {
      // Dark background like other artworks
      p.background(10, 10, 10);
      
      // Draw spider web in light grey
      p.strokeWeight(0.5);
      spiderWeb.forEach(thread => {
        const shimmer = p.sin(p.frameCount * 0.015) * 0.2 + 0.8;
        p.stroke(120, 120, 120, 80 * shimmer);
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
        
        // Draw dewdrop with twinkling effect
        p.push();
        p.translate(drop.x, drop.y);
        
        // Twinkling intensity - some drops twinkle more than others
        const twinkle = p.sin(drop.shimmer * 2) * 0.5 + 0.5;
        const sparkle = p.sin(drop.shimmer * 3.7) * 0.3 + 0.7;
        const currentAlpha = drop.alpha * twinkle * 0.8;
        
        // Very subtle main dewdrop body
        p.fill(100, 120, 140, currentAlpha * 60);
        p.noStroke();
        p.ellipse(0, 0, drop.size * 1.5, drop.size * 1.5);
        
        // Bright twinkling center
        const centerBrightness = twinkle * sparkle;
        p.fill(200, 220, 255, centerBrightness * 180);
        p.ellipse(-drop.size * 0.2, -drop.size * 0.2, drop.size * 0.4, drop.size * 0.4);
        
        // Occasional bright flash for extra twinkle
        if (twinkle > 0.8) {
          p.fill(255, 255, 255, (twinkle - 0.8) * 5 * 255);
          p.ellipse(0, 0, drop.size * 0.3, drop.size * 0.3);
        }
        
        // Subtle outer glow when twinkling
        if (sparkle > 0.6) {
          p.fill(150, 180, 220, (sparkle - 0.6) * 2.5 * 40);
          p.ellipse(0, 0, drop.size * 3, drop.size * 3);
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
          size: p.random(1, 3),
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
