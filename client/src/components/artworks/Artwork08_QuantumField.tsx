import { useEffect, useRef } from 'react';

export default function Artwork08_QuantumField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    const PARTICLE_COUNT = 15000; // Reduced for better performance
    const particles: Array<{
      x: number;
      y: number;
      side: 'dark' | 'light';
      initialAngle: number;
      initialRadius: number;
      convergencePhase: number;
      convergenceSpeed: number;
      size: number;
      targetX: number;
      targetY: number;
      transitionPhase: number;
      transitionSpeed: number;
    }> = [];
    
    // Each particle begins its journey of transformation
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const side = i < PARTICLE_COUNT / 2 ? 'dark' : 'light';
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      
      // Position based on which side of yin yang
      let initialAngle = angle;
      if (side === 'dark') {
        initialAngle = angle < Math.PI ? angle : angle - Math.PI;
      } else {
        initialAngle = angle >= Math.PI ? angle : angle + Math.PI;
      }
      
      const x = centerX + Math.cos(initialAngle) * r;
      const y = centerY + Math.sin(initialAngle) * r;
      
      particles.push({
        x: x,
        y: y,
        side: side,
        initialAngle: initialAngle,
        initialRadius: r,
        convergencePhase: Math.random() * Math.PI * 2,
        convergenceSpeed: 0.005 + Math.random() * 0.005,
        size: 0.3 + Math.random() * 0.4,
        targetX: x,
        targetY: y,
        transitionPhase: 0,
        transitionSpeed: 0.004 + Math.random() * 0.002
      });
    }
    
    let time = 0;
    let isRunning = true;
    let lastTime = 0;
    const FPS = 20;
    const frameDelay = 1000 / FPS;
    
    function animate(currentTime: number) {
      if (!isRunning) return;
      
      if (!lastTime) lastTime = currentTime;
      const elapsed = currentTime - lastTime;
      
      if (elapsed > frameDelay) {
        time += 0.008;
        lastTime = currentTime;
        
        // Dark background with subtle trails
        ctx.fillStyle = 'rgba(249, 249, 249, 0.1)';
        ctx.fillRect(0, 0, width, height);
      
        particles.forEach(particle => {
          // Update convergence phase
          particle.convergencePhase += particle.convergenceSpeed;
          particle.transitionPhase += particle.transitionSpeed;
          
          // Calculate convergence cycle
          const convergenceCycle = Math.sin(particle.convergencePhase);
          const isConverging = convergenceCycle > 0;
          
          if (isConverging) {
            // Convergence phase - particles move toward center
            const convergenceStrength = convergenceCycle;
            particle.targetX = centerX;
            particle.targetY = centerY;
            
            // Slow down near center
            const distanceToCenter = Math.sqrt(
              (particle.x - centerX) ** 2 + 
              (particle.y - centerY) ** 2
            );
            const moveSpeed = 0.02 * convergenceStrength * (distanceToCenter / radius);
            
            particle.x += (particle.targetX - particle.x) * moveSpeed;
            particle.y += (particle.targetY - particle.y) * moveSpeed;
          } else {
            // Expansion phase - particles move to opposite side
            const transitionProgress = Math.abs(convergenceCycle);
            
            // Calculate opposite side position
            let newAngle = particle.initialAngle + Math.PI;
            let newRadius = particle.initialRadius;
            
            // Add yin yang curve effect
            const sCurveEffect = Math.sin(newAngle * 2) * radius * 0.5;
            const curvedAngle = newAngle + (sCurveEffect / newRadius) * transitionProgress;
            
            particle.targetX = centerX + Math.cos(curvedAngle) * newRadius;
            particle.targetY = centerY + Math.sin(curvedAngle) * newRadius;
            
            // Move towards target with easing
            const moveSpeed = 0.03 * transitionProgress;
            particle.x += (particle.targetX - particle.x) * moveSpeed;
            particle.y += (particle.targetY - particle.y) * moveSpeed;
          }
          
          // Determine color based on current position
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const particleAngle = Math.atan2(dy, dx);
          const normalizedAngle = (particleAngle + Math.PI * 2) % (Math.PI * 2);
          
          let color, alpha;
          
          if (isConverging) {
            // During convergence, use warm ochre colors
            color = particle.side === 'dark' ? '89, 65, 45' : '139, 115, 85';
            alpha = 0.4 * convergenceCycle;
          } else {
            // During expansion, particles transition to opposite color
            const transition = Math.abs(convergenceCycle);
            if (particle.side === 'dark') {
              color = `${89 + transition * 50}, ${65 + transition * 50}, ${45 + transition * 40}`;
            } else {
              color = `${139 - transition * 50}, ${115 - transition * 50}, ${85 - transition * 40}`;
            }
            alpha = 0.4 * transition;
          }
          
          // Add glow effect near center
          const distanceToCenter = Math.sqrt(
            (particle.x - centerX) ** 2 + 
            (particle.y - centerY) ** 2
          );
          if (distanceToCenter < radius * 0.2) {
            alpha += (1 - distanceToCenter / (radius * 0.2)) * 0.3;
          }
          
          // Draw particle with warm glow
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${alpha})`;
          ctx.fill();
        });
        
        // Draw central convergence point with warm glow
        const centralGlow = Math.sin(time * 0.1) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3 + centralGlow * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 115, 85, ${0.2 + centralGlow * 0.3})`;
        ctx.fill();
        
        // Add subtle outer glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8 + centralGlow * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 115, 85, ${0.1 + centralGlow * 0.1})`;
        ctx.fill();
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      particles.length = 0;
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