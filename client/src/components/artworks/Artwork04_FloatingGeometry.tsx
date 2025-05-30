import React, { useEffect, useRef } from 'react';

export default function Artwork04_FloatingGeometry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    // Core variables
    let time = 0;
    const particles: HelixParticle[] = [];
    let helixPoints: any[] = [];
    const numParticles = 60;
    const TWO_PI = Math.PI * 2;

    // Helper functions
    const random = (min: number, max?: number) => {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return Math.random() * (max - min) + min;
    };

    const map = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
      return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    };

    const dist = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dz = z2 - z1;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };

    // HelixParticle - each point balanced between opposing forces
    class HelixParticle {
      phase: number;
      radius: number;
      yOffset: number;
      ySpeed: number;
      rotationSpeed: number;
      size: number;
      opacity: number;
      strength: number;

      constructor(initialPhase?: number) {
        this.phase = initialPhase || random(TWO_PI);
        this.radius = random(90, 110);
        this.yOffset = random(-300, 300);
        this.ySpeed = random(0.3, 0.6) * (random() > 0.5 ? 1 : -1);
        this.rotationSpeed = random(0.005, 0.0075);
        this.size = random(3, 6);
        this.opacity = random(120, 180);
        this.strength = random(0.8, 1);
      }

      update() {
        // Update position - success and failure are one movement
        this.phase += this.rotationSpeed * this.strength;
        this.yOffset += this.ySpeed;

        // Reset position if it goes off screen
        if (this.yOffset > 350) this.yOffset = -350;
        if (this.yOffset < -350) this.yOffset = 350;

        // Calculate 3D position
        const x = width / 2 + Math.cos(this.phase) * this.radius;
        const y = height / 2 + this.yOffset;
        const z = Math.sin(this.phase) * this.radius;

        // Store position for drawing and connections
        return { x, y, z, strength: this.strength, size: this.size, opacity: this.opacity };
      }
    }

    // Create helix particles
    for (let i = 0; i < numParticles; i++) {
      const initialPhase = (i / numParticles) * TWO_PI * 3; // Create 3 full rotations
      particles.push(new HelixParticle(initialPhase));
    }

    // Frame rate control variables
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;
    let lastFrameTime = 0;

    const animate = (currentTime: number) => {
      // Initialize lastFrameTime on first frame
      if (!lastFrameTime) {
        lastFrameTime = currentTime;
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - lastFrameTime;
      
      // Only render a new frame when enough time has passed
      if (deltaTime >= frameInterval) {
        const remainder = deltaTime % frameInterval;
        lastFrameTime = currentTime - remainder;
        
        // Clear background with dark theme
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, width, height);

        time += 0.02;

        // Update helix points
        helixPoints = particles.map(particle => particle.update());

        // Sort by z-depth for proper 3D rendering
        helixPoints.sort((a, b) => a.z - b.z);

        // Draw connections between helix points
        ctx.lineWidth = 1.2;

        // Connect helix points to create strand structure
        for (let i = 0; i < helixPoints.length; i++) {
          const hp1 = helixPoints[i];

          // Connect to nearby points
          for (let j = 0; j < helixPoints.length; j++) {
            if (i !== j) {
              const hp2 = helixPoints[j];
              const d = dist(hp1.x, hp1.y, hp1.z, hp2.x, hp2.y, hp2.z);

              // Create connections with distance threshold
              if (d < 120) {
                const opacity = map(d, 0, 120, 40, 10) * 
                              map(Math.min(hp1.z, hp2.z), -110, 110, 0.3, 1);

                // Use warm ochre colors for connections
                ctx.strokeStyle = `rgba(139, 115, 85, ${opacity / 255})`;
                ctx.beginPath();
                ctx.moveTo(hp1.x, hp1.y);
                ctx.lineTo(hp2.x, hp2.y);
                ctx.stroke();
              }
            }
          }
        }

        // Draw helix points with 3D depth effect
        for (let i = 0; i < helixPoints.length; i++) {
          const hp = helixPoints[i];
          const sizeMultiplier = map(hp.z, -110, 110, 0.6, 1.3);
          const adjustedOpacity = map(hp.z, -110, 110, hp.opacity * 0.4, hp.opacity);

          // Use warm ochre colors for points
          ctx.fillStyle = `rgba(139, 115, 85, ${adjustedOpacity / 255})`;
          ctx.beginPath();
          ctx.arc(hp.x, hp.y, (hp.size * sizeMultiplier) / 2, 0, TWO_PI);
          ctx.fill();
        }

        // Create spinal connections - central structure
        ctx.strokeStyle = 'rgba(139, 115, 85, 0.3)';
        ctx.lineWidth = 2;

        // Sort by y position for the spine
        const sortedByY = [...helixPoints].sort((a, b) => a.y - b.y);

        // Draw spine connecting points
        for (let i = 0; i < sortedByY.length - 1; i++) {
          const p1 = sortedByY[i];
          const p2 = sortedByY[i + 1];

          // Only connect if they're close in y position
          if (Math.abs(p1.y - p2.y) < 30) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (canvas && ctx) {
        ctx.clearRect(0, 0, width, height);
      }
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