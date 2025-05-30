import { useEffect, useRef } from "react";
import { useP5 } from "@/hooks/useP5";

export default function Artwork03_CodeRipples() {
  const containerRef = useRef<HTMLDivElement>(null);

  const sketch = (p: any) => {
    let ripples: any[] = [];
    let codeLines: string[] = [];
    let backgroundGrid: any[] = [];

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      
      // Initialize code lines
      codeLines = [
        "function breathe() {",
        "  return inhale().then(exhale);",
        "}",
        "",
        "while (alive) {",
        "  breathe();",
        "  observe();",
        "  reflect();",
        "}",
        "",
        "const wisdom = silence.map(thought => ",
        "  thought.filter(noise => !noise)",
        ");"
      ];

      // Create background grid
      for (let x = 0; x < p.width; x += 40) {
        for (let y = 0; y < p.height; y += 40) {
          backgroundGrid.push({
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            offset: 0,
            phase: p.random(p.TWO_PI)
          });
        }
      }
    };

    p.draw = () => {
      p.background(249, 249, 249);
      
      // Draw background grid
      p.stroke(89, 65, 45, 50);
      p.strokeWeight(1);
      backgroundGrid.forEach(point => {
        // Apply ripple effects to grid
        let totalOffset = 0;
        ripples.forEach(ripple => {
          let distance = p.dist(point.baseX, point.baseY, ripple.x, ripple.y);
          if (distance < ripple.radius) {
            let waveHeight = p.sin((distance - ripple.radius) * 0.1) * ripple.amplitude;
            totalOffset += waveHeight;
          }
        });
        
        point.x = point.baseX + p.sin(point.phase + p.frameCount * 0.01) * 2 + totalOffset * 0.3;
        point.y = point.baseY + p.cos(point.phase + p.frameCount * 0.01) * 2 + totalOffset * 0.3;
        
        p.point(point.x, point.y);
      });

      // Draw code with ripple effects
      p.textAlign(p.LEFT, p.TOP);
      p.textSize(14);
      p.fill(139, 115, 85, 180);
      
      codeLines.forEach((line, lineIndex) => {
        let baseY = 100 + lineIndex * 25;
        
        for (let charIndex = 0; charIndex < line.length; charIndex++) {
          let baseX = 50 + charIndex * 8;
          let char = line[charIndex];
          
          // Calculate ripple displacement
          let totalDisplacement = { x: 0, y: 0 };
          let totalAlpha = 180;
          
          ripples.forEach(ripple => {
            let distance = p.dist(baseX, baseY, ripple.x, ripple.y);
            if (distance < ripple.radius) {
              let angle = p.atan2(baseY - ripple.y, baseX - ripple.x);
              let displacement = p.sin((distance - ripple.radius) * 0.05) * ripple.amplitude;
              totalDisplacement.x += p.cos(angle) * displacement * 0.5;
              totalDisplacement.y += p.sin(angle) * displacement * 0.5;
              
              // Enhance alpha near ripple center
              let alphaBoost = (ripple.radius - distance) / ripple.radius * 100;
              totalAlpha += alphaBoost;
            }
          });
          
          p.fill(139, 115, 85, p.constrain(totalAlpha, 50, 255));
          p.text(char, baseX + totalDisplacement.x, baseY + totalDisplacement.y);
        }
      });

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        let ripple = ripples[i];
        ripple.radius += ripple.speed;
        ripple.amplitude *= 0.98;
        
        // Draw ripple circles
        p.noFill();
        p.stroke(89, 65, 45, ripple.amplitude * 2);
        p.strokeWeight(2);
        p.circle(ripple.x, ripple.y, ripple.radius * 2);
        
        // Remove dead ripples
        if (ripple.amplitude < 1 || ripple.radius > p.width) {
          ripples.splice(i, 1);
        }
      }
      
      // Add ambient particles
      p.fill(139, 115, 85, 50);
      p.noStroke();
      for (let i = 0; i < 20; i++) {
        let x = p.random(p.width);
        let y = p.random(p.height);
        let size = p.sin(p.frameCount * 0.02 + i) * 2 + 3;
        p.circle(x, y, size);
      }
    };

    p.mousePressed = () => {
      // Create new ripple at mouse position
      ripples.push({
        x: p.mouseX,
        y: p.mouseY,
        radius: 0,
        amplitude: 50,
        speed: 3
      });
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      
      // Regenerate background grid
      backgroundGrid = [];
      for (let x = 0; x < p.width; x += 40) {
        for (let y = 0; y < p.height; y += 40) {
          backgroundGrid.push({
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            offset: 0,
            phase: p.random(p.TWO_PI)
          });
        }
      }
    };
  };

  useP5(sketch, containerRef);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-crosshair"
      style={{ background: 'radial-gradient(circle at center, #f5f5f5 0%, #f9f9f9 70%)' }}
    />
  );
}
