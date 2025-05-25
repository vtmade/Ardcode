import { useEffect, useRef } from "react";
import { useP5 } from "@/hooks/useP5";

export default function Artwork05_BreathingMandala() {
  const containerRef = useRef<HTMLDivElement>(null);

  const sketch = (p: any) => {
    let centerX: number, centerY: number;
    let breathPhase = 0;
    let mandalaLayers: any[] = [];
    let mouseRadius = 0;

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      centerX = p.width / 2;
      centerY = p.height / 2;
      
      // Initialize mandala layers
      for (let layer = 0; layer < 8; layer++) {
        mandalaLayers.push({
          radius: 50 + layer * 30,
          petals: 6 + layer * 2,
          rotationSpeed: 0.01 + layer * 0.002,
          breathAmp: 10 + layer * 5,
          color: {
            r: 139 - layer * 5,
            g: 115 - layer * 3,
            b: 85 + layer * 10
          }
        });
      }
    };

    p.draw = () => {
      p.background(10, 10, 10, 30); // Trailing effect
      
      centerX = p.width / 2;
      centerY = p.height / 2;
      
      // Update breathing phase
      breathPhase += 0.02;
      let breathMultiplier = p.sin(breathPhase) * 0.3 + 1;
      
      // Mouse interaction
      let targetMouseRadius = p.dist(p.mouseX, p.mouseY, centerX, centerY);
      mouseRadius += (targetMouseRadius - mouseRadius) * 0.1;
      
      p.translate(centerX, centerY);
      
      // Draw central void
      p.fill(0, 0, 0, 150);
      p.noStroke();
      p.circle(0, 0, 40 * breathMultiplier);
      
      // Draw mandala layers
      mandalaLayers.forEach((layer, layerIndex) => {
        p.push();
        
        // Layer rotation
        p.rotate(p.frameCount * layer.rotationSpeed);
        
        // Mouse influence on rotation
        let mouseInfluence = p.map(mouseRadius, 0, p.width * 0.5, 0, 1);
        p.rotate(mouseInfluence * p.sin(p.frameCount * 0.05) * 0.5);
        
        // Draw petals
        for (let petal = 0; petal < layer.petals; petal++) {
          p.push();
          
          let angle = (p.TWO_PI / layer.petals) * petal;
          p.rotate(angle);
          
          // Breathing effect on radius
          let currentRadius = layer.radius * breathMultiplier;
          currentRadius += p.sin(breathPhase * 2 + layerIndex) * layer.breathAmp;
          
          // Petal shape
          let petalSize = 15 + layerIndex * 3;
          petalSize *= breathMultiplier;
          
          // Color with breathing intensity
          let alpha = (p.sin(breathPhase + layerIndex * 0.5) + 1) * 60 + 50;
          p.fill(layer.color.r, layer.color.g, layer.color.b, alpha);
          p.noStroke();
          
          // Draw petal as ellipse
          p.ellipse(currentRadius, 0, petalSize, petalSize * 0.6);
          
          // Add inner glow
          p.fill(layer.color.r + 20, layer.color.g + 20, layer.color.b + 20, alpha * 0.3);
          p.ellipse(currentRadius, 0, petalSize * 0.6, petalSize * 0.4);
          
          // Sacred geometry lines
          if (layerIndex % 2 === 0) {
            p.stroke(layer.color.r, layer.color.g, layer.color.b, alpha * 0.5);
            p.strokeWeight(1);
            p.line(0, 0, currentRadius, 0);
          }
          
          p.pop();
        }
        
        p.pop();
      });
      
      // Draw connecting spirals
      p.noFill();
      p.stroke(139, 115, 85, 80);
      p.strokeWeight(2);
      
      for (let spiral = 0; spiral < 3; spiral++) {
        p.push();
        p.rotate(spiral * p.TWO_PI / 3 + p.frameCount * 0.01);
        
        p.beginShape();
        p.noFill();
        for (let r = 20; r < 300; r += 5) {
          let spiralAngle = r * 0.1 + p.frameCount * 0.02;
          let x = p.cos(spiralAngle) * r * breathMultiplier;
          let y = p.sin(spiralAngle) * r * breathMultiplier;
          p.vertex(x, y);
        }
        p.endShape();
        
        p.pop();
      }
      
      // Add floating symbols
      let symbols = ['⚬', '◯', '◉', '⬢', '⬟'];
      for (let i = 0; i < symbols.length; i++) {
        let symbolAngle = p.frameCount * 0.008 + i * p.TWO_PI / symbols.length;
        let symbolRadius = 200 + p.sin(p.frameCount * 0.01 + i) * 50;
        symbolRadius *= breathMultiplier;
        
        let x = p.cos(symbolAngle) * symbolRadius;
        let y = p.sin(symbolAngle) * symbolRadius;
        
        p.fill(139, 115, 85, 120);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(20 + p.sin(breathPhase + i) * 5);
        p.text(symbols[i], x, y);
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.mousePressed = () => {
      // Reset breathing phase to create synchronization effect
      breathPhase = 0;
      
      // Add ripple of new petals
      mandalaLayers.forEach(layer => {
        layer.breathAmp *= 1.5;
      });
    };

    p.keyPressed = () => {
      if (p.key === ' ') {
        // Space bar creates deeper breathing
        breathPhase = p.PI / 2; // Start at peak inhale
      }
    };
  };

  useP5(sketch, containerRef);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-crosshair"
      style={{ 
        background: 'radial-gradient(circle at center, #2a1f1a 0%, #0a0a0a 60%)',
        overflow: 'hidden'
      }}
    />
  );
}
