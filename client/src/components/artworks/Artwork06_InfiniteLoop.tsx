import React, { useEffect, useRef } from 'react';

export default function Artwork06_InfiniteLoop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    let crystals: Crystal[] = [];
    const numCrystals = 4;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let mouseInfluence = 0;

    class Crystal {
      x: number;
      y: number;
      size: number;
      segments: any[];
      angle: number;
      rotationSpeed: number;
      sides: number;
      baseGrowthPhase: number;
      lastGrowthPhase: number;
      currentGrowthPhase: number;

      constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.segments = [];
        this.angle = 0;
        this.rotationSpeed = 0.001;
        this.sides = 6;
        this.baseGrowthPhase = Math.random() * Math.PI * 2;
        this.lastGrowthPhase = 0;
        this.currentGrowthPhase = 0;
        
        this.generateStructure();
      }

      generateStructure() {
        this.segments = [];
        
        // Create balanced structure of opposites
        for (let ring = 0; ring < 5; ring++) {
          const ringRadius = this.size * (0.15 + ring * 0.17);
          const numSegments = this.sides * (ring + 1);
          
          for (let i = 0; i < numSegments; i++) {
            const angle = (i / numSegments) * Math.PI * 2;
            const innerRadius = ring === 0 ? 0 : this.size * (0.15 + (ring - 1) * 0.17);
            
            this.segments.push({
              angle: angle,
              innerRadius: innerRadius,
              outerRadius: ringRadius,
              basePhase: Math.random() * Math.PI * 2,
              currentInnerRadius: innerRadius,
              currentOuterRadius: ringRadius,
              currentAngle: angle,
              branching: ring > 2 && Math.random() < 0.2
            });
          }
        }
      }

      update(time: number) {
        this.angle += this.rotationSpeed * 5;
        
        this.lastGrowthPhase = this.currentGrowthPhase;
        const targetGrowthPhase = Math.sin(time * 0.05 + this.baseGrowthPhase) * 0.15 + 0.85;
        this.currentGrowthPhase += (targetGrowthPhase - this.currentGrowthPhase) * 0.005;
        
        this.segments.forEach((segment) => {
          const targetInnerRadius = segment.innerRadius * this.currentGrowthPhase;
          const targetOuterRadius = segment.outerRadius * this.currentGrowthPhase;
          const targetAngle = segment.angle + Math.sin(time * 0.15 + segment.basePhase) * 0.005;
          
          segment.currentInnerRadius += (targetInnerRadius - segment.currentInnerRadius) * 0.005;
          segment.currentOuterRadius += (targetOuterRadius - segment.currentOuterRadius) * 0.005;
          segment.currentAngle += (targetAngle - segment.currentAngle) * 0.005;
        });
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Draw delicate geometric base
        ctx.strokeStyle = 'rgba(139, 115, 85, 0.2)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < this.sides; i++) {
          const angle = (i / this.sides) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(
            Math.cos(angle) * this.size,
            Math.sin(angle) * this.size
          );
          ctx.stroke();
        }
        
        // Draw segments with consistent styling
        this.segments.forEach(segment => {
          const innerX = Math.cos(segment.currentAngle) * segment.currentInnerRadius;
          const innerY = Math.sin(segment.currentAngle) * segment.currentInnerRadius;
          const outerX = Math.cos(segment.currentAngle) * segment.currentOuterRadius;
          const outerY = Math.sin(segment.currentAngle) * segment.currentOuterRadius;
          
          // Main segment
          ctx.strokeStyle = 'rgba(139, 115, 85, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(innerX, innerY);
          ctx.lineTo(outerX, outerY);
          ctx.stroke();
          
          // Nodes along segment
          const numNodes = 1;
          for (let n = 0; n < numNodes; n++) {
            const t = 0.6;
            const nodeX = innerX + (outerX - innerX) * t;
            const nodeY = innerY + (outerY - innerY) * t;
            const nodeSize = 6;
            
            // Smooth node shape
            const nodePoints = 8;
            ctx.beginPath();
            for (let p = 0; p <= nodePoints; p++) {
              const a = (p / nodePoints) * Math.PI * 2;
              const r = nodeSize * (1 + Math.sin(a * 2 + segment.basePhase) * 0.05);
              const px = nodeX + Math.cos(a) * r;
              const py = nodeY + Math.sin(a) * r;
              
              if (p === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            
            ctx.strokeStyle = 'rgba(139, 115, 85, 0.5)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
            
            // Node core
            ctx.beginPath();
            ctx.arc(nodeX, nodeY, nodeSize * 0.25, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(139, 115, 85, 0.3)';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
          
          // Stable branching
          if (segment.branching) {
            const branchAngle = segment.currentAngle + 0.2;
            const branchLength = segment.currentOuterRadius * 0.3;
            const branchX = outerX + Math.cos(branchAngle) * branchLength;
            const branchY = outerY + Math.sin(branchAngle) * branchLength;
            
            ctx.strokeStyle = 'rgba(139, 115, 85, 0.3)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(outerX, outerY);
            ctx.lineTo(branchX, branchY);
            ctx.stroke();
            
            // Branch terminal
            ctx.beginPath();
            ctx.arc(branchX, branchY, 2.5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(139, 115, 85, 0.4)';
            ctx.stroke();
          }
        });
        
        // Keep to the block - the stable core within
        const coreSize = this.size * 0.06;
        ctx.strokeStyle = 'rgba(139, 115, 85, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner core
        ctx.beginPath();
        ctx.arc(0, 0, coreSize * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(139, 115, 85, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
      }
    }

    // Initialize crystals
    function initCrystals() {
      crystals = [];
      for (let i = 0; i < numCrystals; i++) {
        const x = canvas.width * (0.2 + Math.random() * 0.6);
        const y = canvas.height * (0.2 + Math.random() * 0.6);
        const size = 70 + Math.random() * 30;
        crystals.push(new Crystal(x, y, size));
      }
    }

    initCrystals();

    // Animation timing control variables
    let animationFrameId: number | null = null;
    let lastFrameTime = 0;
    const targetFPS = 16.7;
    const frameInterval = 1000 / targetFPS;
    
    // Animation function with time delta control
    function animate(currentTime: number) {
      if (!lastFrameTime) {
        lastFrameTime = currentTime;
      }
      
      const deltaTime = currentTime - lastFrameTime;
      
      if (deltaTime >= frameInterval) {
        // Dark background to match gallery
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        time += 0.005;

        // Update and draw crystals
        crystals.forEach(crystal => {
          crystal.update(time);
          crystal.draw(ctx);
        });

        // Draw crystal connections
        for (let i = 0; i < crystals.length; i++) {
          for (let j = i + 1; j < crystals.length; j++) {
            const crystalA = crystals[i];
            const crystalB = crystals[j];
            
            const distance = Math.sqrt(
              (crystalA.x - crystalB.x) * (crystalA.x - crystalB.x) +
              (crystalA.y - crystalB.y) * (crystalA.y - crystalB.y)
            );
            
            if (distance < 280) {
              const opacity = Math.pow(1 - distance / 280, 2) * 0.1;
              
              ctx.strokeStyle = `rgba(139, 115, 85, ${opacity})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              
              ctx.moveTo(crystalA.x, crystalA.y);
              ctx.lineTo(crystalB.x, crystalB.y);
              ctx.stroke();
            }
          }
        }
        
        lastFrameTime = currentTime - (deltaTime % frameInterval);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initCrystals(); // Reinitialize crystals for new canvas size
    };
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      crystals.length = 0;
    };
  }, []);

  return (
    <div 
      className="w-full h-full cursor-crosshair"
      style={{ 
        background: 'linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 50%, #f9f9f9 100%)'
      }}
    >
      <canvas 
        ref={canvasRef}
        style={{ 
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}