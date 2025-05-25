import React, { useEffect, useRef } from 'react';

export default function Artwork09_SacredCode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let time = 0;
   
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Much smaller, centered space
    const particles: Array<{
      x: number;
      y: number;
      speedX: number;
      speedY: number;
      size: number;
      connections: Array<{ particle: any; distance: number; alpha: number }>;
      noiseOffset: number;
      idealSpace: number;
      allowClustering: boolean;
    }> = [];
    
    const numParticles = 25;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Initialize particles spread across the screen
    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      const radius = Math.random() * Math.min(canvas.width, canvas.height) * 0.35 + 100; // Spread across screen
      const clusterChance = Math.random();
      const clusterOffset = clusterChance < 0.2 ? 80 : (clusterChance > 0.8 ? -80 : 0);
      
      particles.push({
        x: centerX + Math.cos(angle) * (radius + clusterOffset),
        y: centerY + Math.sin(angle) * (radius + clusterOffset),
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 2 + 1,
        connections: [],
        noiseOffset: Math.random() * 1000,
        idealSpace: 80 + Math.random() * 40,
        allowClustering: clusterChance < 0.3
      });
    }
    
    const maxConnectionDistance = 180;
    const fadeZoneWidth = 40;
    
    const animate = () => {
      time += 0.0025;
      
      // Dark background to match gallery
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Clear connections
      particles.forEach(particle => particle.connections = []);
      
      // Find connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const distance = Math.sqrt(
            Math.pow(particles[i].x - particles[j].x, 2) +
            Math.pow(particles[i].y - particles[j].y, 2)
          );
          
          if (distance < maxConnectionDistance) {
            let alpha;
            
            if (distance < (maxConnectionDistance - fadeZoneWidth)) {
              alpha = Math.min(0.3, 0.4 * (1 - distance / (maxConnectionDistance - fadeZoneWidth)));
            } else {
              const fadeProgress = (distance - (maxConnectionDistance - fadeZoneWidth)) / fadeZoneWidth;
              alpha = 0.3 * Math.pow(1 - fadeProgress, 3);
            }
            
            if (alpha > 0.001) {
              particles[i].connections.push({ particle: particles[j], distance, alpha });
              particles[j].connections.push({ particle: particles[i], distance, alpha });
            }
          }
        }
      }
      
      // Update particles
      particles.forEach((particle) => {
        const noiseScale = 0.001;
        const noiseX = particle.x * noiseScale + particle.noiseOffset;
        const noiseY = particle.y * noiseScale + particle.noiseOffset + 100;
        const noiseVal = 
          Math.sin(noiseX + time) * Math.cos(noiseY - time) + 
          Math.sin(noiseX * 2 + time * 0.6) * Math.cos(noiseY * 2 - time * 0.6) * 0.3;
        
        particle.speedX += Math.cos(noiseVal * Math.PI * 2) * 0.0005; // Much gentler noise
        particle.speedY += Math.sin(noiseVal * Math.PI * 2) * 0.0005;
        
        // Gentle attraction to center - giving and receiving cycle
        const dx = centerX - particle.x;
        const dy = centerY - particle.y;
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
        
        const centerRange = particle.allowClustering ? 200 : 300;
        const minDistance = particle.allowClustering ? 100 : 150;
        
        if (distanceToCenter > centerRange) {
          particle.speedX += dx / distanceToCenter * 0.001;
          particle.speedY += dy / distanceToCenter * 0.001;
        } else if (distanceToCenter < minDistance) {
          particle.speedX -= dx / distanceToCenter * 0.0012;
          particle.speedY -= dy / distanceToCenter * 0.0012;
        }
        
        // Particle interactions - natural abundance
        particles.forEach(other => {
          if (other === particle) return;
          
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < particle.idealSpace) {
            const force = particle.allowClustering && other.allowClustering ? 
              0.004 : 0.008;
            
            if (distance < particle.idealSpace * 0.7) {
              particle.speedX += dx / distance * force;
              particle.speedY += dy / distance * force;
            }
          }
        });
        
        particle.speedX *= 0.98;
        particle.speedY *= 0.98;
        
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Soft boundaries to keep particles on screen
        const boundaryForce = 0.005;
        const margin = 50;
        
        if (particle.x < margin) {
          particle.speedX += boundaryForce;
        } else if (particle.x > canvas.width - margin) {
          particle.speedX -= boundaryForce;
        }
        
        if (particle.y < margin) {
          particle.speedY += boundaryForce;
        } else if (particle.y > canvas.height - margin) {
          particle.speedY -= boundaryForce;
        }
      });
      
      // Draw connections with warm ochre colors
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      
      particles.forEach(particle => {
        particle.connections.forEach(conn => {
          ctx.strokeStyle = `rgba(139, 115, 85, ${conn.alpha})`;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(conn.particle.x, conn.particle.y);
          ctx.stroke();
        });
      });
      
      // Draw particles with warm ochre colors
      particles.forEach(particle => {
        const distanceToCenter = Math.sqrt(
          Math.pow(particle.x - centerX, 2) +
          Math.pow(particle.y - centerY, 2)
        );
        const alpha = Math.max(0.4, Math.min(0.8, 1 - distanceToCenter / 600));
        
        ctx.fillStyle = `rgba(139, 115, 85, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle glow for central particles
        if (distanceToCenter < 100) {
          ctx.fillStyle = `rgba(180, 150, 100, ${alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      particles.length = 0;
      time = 0;
    };
  }, []);
  
  return (
    <div 
      className="w-full h-full cursor-crosshair"
      style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
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