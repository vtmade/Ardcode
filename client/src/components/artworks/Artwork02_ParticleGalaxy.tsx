import React, { useEffect, useRef } from 'react';

export default function Artwork02_ParticleGalaxy() {
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
    const leafParticles: LeafParticle[] = [];
    let helixPoints: any[] = [];
    const numLeaves = 60;
    const TWO_PI = Math.PI * 2;

    // Interactive variables
    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseInfluence = 0;

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

    // LeafParticle - each leaf balanced in the helix flow
    class LeafParticle {
      phase: number;
      radius: number;
      yOffset: number;
      ySpeed: number;
      rotationSpeed: number;
      size: number;
      opacity: number;
      strength: number;
      leafType: number;
      color: { r: number; g: number; b: number };

      constructor(initialPhase: number) {
        this.phase = initialPhase || random(TWO_PI);
        this.radius = random(90, 110);
        this.yOffset = random(-height/3, height/3);
        this.ySpeed = random(0.3, 0.6) * (random() > 0.5 ? 1 : -1);
        this.rotationSpeed = random(0.005, 0.0075);
        this.size = random(8, 15);
        this.opacity = random(0.7, 0.9);
        this.strength = random(0.8, 1);
        this.leafType = Math.floor(random(3));
        
        // Natural leaf colors
        const leafColors = [
          { r: 139, g: 115, b: 85 },   // Warm brown
          { r: 196, g: 181, b: 154 },  // Light tan
          { r: 90, g: 77, b: 65 },     // Dark brown
          { r: 160, g: 140, b: 100 },  // Golden brown
        ];
        this.color = leafColors[Math.floor(random(leafColors.length))];
      }

      update() {
        // Interactive influence from mouse
        const mouseDistance = Math.sqrt((mouseX - width/2) ** 2 + (mouseY - height/2) ** 2);
        const maxDistance = Math.sqrt(width ** 2 + height ** 2) / 2;
        mouseInfluence = 1 - Math.min(mouseDistance / maxDistance, 1);

        // Update position - success and failure are one movement
        this.phase += this.rotationSpeed * this.strength * (1 + mouseInfluence * 0.5);
        this.yOffset += this.ySpeed * (1 + mouseInfluence * 0.3);

        // Reset position if it goes off screen
        if (this.yOffset > height/2 + 100) this.yOffset = -height/2 - 100;
        if (this.yOffset < -height/2 - 100) this.yOffset = height/2 + 100;

        // Calculate 3D position with mouse influence
        const radiusModifier = this.radius + mouseInfluence * 30;
        const x = width / 2 + Math.cos(this.phase) * radiusModifier;
        const y = height / 2 + this.yOffset;
        const z = Math.sin(this.phase) * radiusModifier;

        return { 
          x, y, z, 
          strength: this.strength, 
          size: this.size, 
          opacity: this.opacity,
          leafType: this.leafType,
          color: this.color,
          phase: this.phase
        };
      }
    }

    // Create helix leaf particles
    for (let i = 0; i < numLeaves; i++) {
      const initialPhase = (i / numLeaves) * TWO_PI * 3; // Create 3 full rotations
      leafParticles.push(new LeafParticle(initialPhase));
    }

    // Draw leaf shape
    const drawLeaf = (x: number, y: number, size: number, rotation: number, leafType: number, color: any, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      const adjustedOpacity = opacity * (0.6 + mouseInfluence * 0.4);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${adjustedOpacity})`;
      ctx.strokeStyle = `rgba(${color.r - 20}, ${color.g - 20}, ${color.b - 20}, ${adjustedOpacity * 0.8})`;
      ctx.lineWidth = 1;

      ctx.beginPath();
      
      if (leafType === 0) {
        // Oval leaf
        ctx.ellipse(0, 0, size * 0.4, size * 0.8, 0, 0, TWO_PI);
      } else if (leafType === 1) {
        // Pointed leaf
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(size * 0.4, -size * 0.3, size * 0.25, 0);
        ctx.quadraticCurveTo(size * 0.4, size * 0.7, 0, size);
        ctx.quadraticCurveTo(-size * 0.4, size * 0.7, -size * 0.25, 0);
        ctx.quadraticCurveTo(-size * 0.4, -size * 0.3, 0, -size);
      } else {
        // Heart-shaped leaf
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(-size * 0.4, -size * 0.2, -size * 0.6, size * 0.2, 0, size);
        ctx.bezierCurveTo(size * 0.6, size * 0.2, size * 0.4, -size * 0.2, 0, size * 0.3);
      }
      
      ctx.fill();
      ctx.stroke();

      // Draw leaf veins
      ctx.strokeStyle = `rgba(${color.r - 30}, ${color.g - 30}, ${color.b - 30}, ${adjustedOpacity * 0.4})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.8);
      ctx.lineTo(0, size * 0.8);
      ctx.moveTo(-size * 0.15, -size * 0.3);
      ctx.lineTo(0, 0);
      ctx.lineTo(size * 0.15, -size * 0.3);
      ctx.stroke();

      ctx.restore();
    };

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseX = touch.clientX - rect.left;
      mouseY = touch.clientY - rect.top;
    };

    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

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
        
        // Clear background with dark color
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        time += 0.02;

        // Update helix points (now leaf positions)
        helixPoints = leafParticles.map(particle => particle.update());

        // Sort by depth for proper rendering
        helixPoints.sort((a, b) => a.z - b.z);

        // Draw connections between nearby leaves (like wind currents)
        ctx.lineWidth = 1.2;
        
        for (let i = 0; i < helixPoints.length; i++) {
          const hp1 = helixPoints[i];

          // Connect to nearby leaves
          for (let j = 0; j < helixPoints.length; j++) {
            if (i !== j) {
              const hp2 = helixPoints[j];
              const d = dist(hp1.x, hp1.y, hp1.z, hp2.x, hp2.y, hp2.z);

              if (d < 120) {
                // Calculate opacity based on distance and depth
                const baseOpacity = map(d, 0, 120, 40, 10) * 
                                 map(Math.min(hp1.z, hp2.z), -110, 110, 0.3, 1);
                const interactiveOpacity = baseOpacity * (1 + mouseInfluence * 0.5);

                ctx.strokeStyle = `rgba(139, 115, 85, ${interactiveOpacity / 255})`;
                ctx.beginPath();
                ctx.moveTo(hp1.x, hp1.y);
                ctx.lineTo(hp2.x, hp2.y);
                ctx.stroke();
              }
            }
          }
        }

        // Draw leaves with depth-based sizing
        for (let i = 0; i < helixPoints.length; i++) {
          const hp = helixPoints[i];
          const sizeMultiplier = map(hp.z, -110, 110, 0.6, 1.3);
          const adjustedOpacity = map(hp.z, -110, 110, hp.opacity * 0.4, hp.opacity);

          drawLeaf(
            hp.x, 
            hp.y, 
            hp.size * sizeMultiplier, 
            hp.phase * 0.5 + time * 0.1,
            hp.leafType,
            hp.color,
            adjustedOpacity
          );
        }

        // Create spinal connections - stronger central structure like branches
        const connectionOpacity = 0.118 * (1 + mouseInfluence * 0.3);
        ctx.strokeStyle = `rgba(139, 115, 85, ${connectionOpacity})`;
        ctx.lineWidth = 2;

        // Sort by y position for the spine
        const sortedByY = [...helixPoints].sort((a, b) => a.y - b.y);

        // Draw spine connecting leaves with similar y positions
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

        // Draw subtle wind effect around mouse
        if (mouseInfluence > 0.1) {
          ctx.strokeStyle = `rgba(196, 181, 154, ${mouseInfluence * 0.1})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, 50 + mouseInfluence * 30, 0, TWO_PI);
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ 
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#0a0a0a',
      cursor: 'crosshair'
    }}>
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