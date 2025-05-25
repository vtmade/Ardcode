import { useEffect, useRef } from "react";
import { useP5 } from "@/hooks/useP5";

export default function Artwork07_NatureCode() {
  const containerRef = useRef<HTMLDivElement>(null);

  const sketch = (p: any) => {
    let trees: any[] = [];
    let particles: any[] = [];
    let codeRain: any[] = [];

    class LSystem {
      axiom: string;
      rules: any;
      generation: string;
      angle: number;
      length: number;

      constructor(axiom: string, rules: any, angle: number, length: number) {
        this.axiom = axiom;
        this.rules = rules;
        this.generation = axiom;
        this.angle = angle;
        this.length = length;
      }

      generate() {
        let nextGen = "";
        for (let char of this.generation) {
          nextGen += this.rules[char] || char;
        }
        this.generation = nextGen;
      }

      draw(x: number, y: number, scale: number) {
        p.push();
        p.translate(x, y);
        p.scale(scale);
        
        let stack: any[] = [];
        let currentAngle = -p.PI / 2;
        
        p.stroke(139 - p.random(20), 115 - p.random(10), 85 + p.random(20), 180);
        p.strokeWeight(2);
        
        for (let char of this.generation) {
          switch (char) {
            case 'F':
            case 'A':
            case 'B':
              let endX = p.cos(currentAngle) * this.length;
              let endY = p.sin(currentAngle) * this.length;
              
              // Add organic randomness
              endX += p.random(-2, 2);
              endY += p.random(-2, 2);
              
              p.line(0, 0, endX, endY);
              p.translate(endX, endY);
              
              // Create falling particles occasionally
              if (p.random() < 0.02) {
                particles.push({
                  x: x + endX,
                  y: y + endY,
                  vx: p.random(-1, 1),
                  vy: p.random(0.5, 2),
                  life: p.random(60, 120),
                  maxLife: p.random(60, 120),
                  size: p.random(2, 6)
                });
              }
              break;
              
            case '+':
              currentAngle += this.angle + p.random(-0.1, 0.1);
              break;
              
            case '-':
              currentAngle -= this.angle + p.random(-0.1, 0.1);
              break;
              
            case '[':
              stack.push([0, 0, currentAngle]);
              break;
              
            case ']':
              if (stack.length > 0) {
                let state = stack.pop();
                p.translate(-p.modelX, -p.modelY); // Reset position
                p.translate(state[0], state[1]);
                currentAngle = state[2];
              }
              break;
          }
        }
        
        p.pop();
      }
    }

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      
      // Initialize L-System trees
      let rules = {
        'A': 'B[+A][-A]BA',
        'B': 'BB'
      };
      
      for (let i = 0; i < 5; i++) {
        let tree = new LSystem('A', rules, p.PI / 6, 8);
        
        // Generate a few generations
        for (let gen = 0; gen < 4; gen++) {
          tree.generate();
        }
        
        trees.push({
          system: tree,
          x: p.random(100, p.width - 100),
          y: p.height - 50,
          scale: p.random(0.5, 1.2),
          growth: 0,
          maxGrowth: tree.generation.length
        });
      }

      // Initialize code rain
      for (let i = 0; i < 30; i++) {
        codeRain.push({
          x: p.random(p.width),
          y: p.random(-500, 0),
          speed: p.random(1, 4),
          text: getRandomCodeSnippet(),
          alpha: p.random(100, 255)
        });
      }
    };

    function getRandomCodeSnippet(): string {
      const snippets = [
        "if (seed) { grow(); }",
        "while (breathing) { live(); }",
        "root.extend(branch);",
        "fibonacci(n-1) + fibonacci(n-2)",
        "return pattern.repeat();",
        "function bloom() { return beauty; }",
        "const life = growth * time;",
        "for (leaf of tree) { photosynthesize(); }",
        "DNA.replicate().mutate();",
        "ecosystem.balance();"
      ];
      return snippets[Math.floor(Math.random() * snippets.length)];
    }

    p.draw = () => {
      p.background(5, 8, 5, 30); // Dark green with trails
      
      // Draw growing trees
      trees.forEach(tree => {
        // Simulate organic growth
        if (tree.growth < tree.maxGrowth) {
          tree.growth += 0.5;
        }
        
        // Create temporary generation for drawing
        let drawGeneration = tree.system.generation.substring(0, Math.floor(tree.growth));
        let originalGeneration = tree.system.generation;
        
        // Temporarily change the generation and draw
        tree.system.generation = drawGeneration;
        tree.system.draw(tree.x, tree.y, tree.scale);
        tree.system.generation = originalGeneration;
      });

      // Update and draw particles (leaves, spores)
      for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i];
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.05; // gravity
        particle.life--;
        
        let alpha = p.map(particle.life, 0, particle.maxLife, 0, 255);
        p.fill(139, 115 + p.random(-20, 20), 85, alpha);
        p.noStroke();
        p.circle(particle.x, particle.y, particle.size);
        
        // Add glow
        p.fill(139, 115, 85, alpha * 0.3);
        p.circle(particle.x, particle.y, particle.size * 2);
        
        if (particle.life <= 0 || particle.y > p.height) {
          particles.splice(i, 1);
        }
      }

      // Draw and update code rain
      codeRain.forEach(drop => {
        drop.y += drop.speed;
        
        // Reset when off screen
        if (drop.y > p.height + 50) {
          drop.y = p.random(-200, -50);
          drop.x = p.random(p.width);
          drop.text = getRandomCodeSnippet();
        }
        
        // Draw code text
        p.fill(40, 100, 40, drop.alpha);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(10);
        p.text(drop.text, drop.x, drop.y);
      });

      // Mouse interaction - add growth energy
      if (p.mouseIsPressed) {
        trees.forEach(tree => {
          let distance = p.dist(p.mouseX, p.mouseY, tree.x, tree.y);
          if (distance < 200) {
            tree.growth += 0.2;
            
            // Add energy particles
            for (let i = 0; i < 3; i++) {
              particles.push({
                x: p.mouseX + p.random(-10, 10),
                y: p.mouseY + p.random(-10, 10),
                vx: p.random(-2, 2),
                vy: p.random(-3, 0),
                life: 30,
                maxLife: 30,
                size: p.random(3, 8)
              });
            }
          }
        });
      }

      // Add atmospheric fog
      p.fill(139, 115, 85, 5);
      p.noStroke();
      for (let i = 0; i < 10; i++) {
        let x = p.random(p.width);
        let y = p.random(p.height);
        let size = p.random(50, 200);
        p.circle(x, y, size);
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.keyPressed = () => {
      if (p.key === ' ') {
        // Regenerate trees
        trees.forEach(tree => {
          tree.system.generate();
          tree.maxGrowth = tree.system.generation.length;
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
        background: 'linear-gradient(to bottom, #0f1a0f 0%, #050805 50%, #000000 100%)',
        overflow: 'hidden'
      }}
    />
  );
}
