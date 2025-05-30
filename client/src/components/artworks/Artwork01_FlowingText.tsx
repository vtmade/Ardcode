import React, { useEffect, useRef } from 'react';

export default function Artwork01_FlowingText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let time = 0;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let mouseInfluence = 0;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouseX = canvas.width / 2;
      mouseY = canvas.height / 2;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse and touch interaction handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseInfluence = 1.0;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseX = touch.clientX - rect.left;
      mouseY = touch.clientY - rect.top;
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseX = touch.clientX - rect.left;
      mouseY = touch.clientY - rect.top;
      mouseInfluence = 1.0;
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchstart', handleTouchStart);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Initialize particles - feminine creative force
    const PARTICLE_COUNT = 8000;
    const FORM_SCALE = 2.4;
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      initialR: number;
      initialTheta: number;
      initialHeight: number;
      life: number;
    }> = [];
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.5) * FORM_SCALE * 0.5 * 150;
      const height = (Math.random() * 2 - 1) * FORM_SCALE * 0.3;
      
      // Calculate initial flow influence
      const angle = theta;
      const dist = r / 150;
      const flow = Math.sin(angle * 2 + height * 2) * 0.03;
      const counterFlow = Math.cos(angle * 2 - height * 2) * 0.03;
      const blend = (Math.sin(height * Math.PI) + 1) * 0.5;
      const combinedFlow = flow * blend + counterFlow * (1 - blend);
      
      const dx = r * Math.cos(theta);
      const dy = r * Math.sin(theta);
      const containment = Math.pow(Math.min(1, dist / (FORM_SCALE * 0.8)), 4);
      const pull = containment * 0.1;
      
      particles.push({
        x: centerX + dx + (dx * combinedFlow) - (dx * pull),
        y: centerY + dy + (dy * combinedFlow) - (dy * pull),
        z: height,
        initialR: r,
        initialTheta: theta,
        initialHeight: height,
        life: Math.random()
      });
    }
    
    const animate = () => {
      time += 0.0008; // Gentle time progression
      
      // Gradually reduce mouse influence
      mouseInfluence *= 0.92;
      
      // Light background with subtle trails
      ctx.fillStyle = 'rgba(249, 249, 249, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Get relative position to center
        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) / 150;
        const angle = Math.atan2(dy, dx);
        const height = particle.z / (FORM_SCALE * 0.4);
        
        // Gentle flowing motion
        const flow = Math.sin(angle * 2 - time * 0.5 + height * 2) * 0.012;
        const counterFlow = Math.cos(angle * 2 + time * 0.5 - height * 2) * 0.012;
        
        const blend = (Math.sin(height * Math.PI) + 1) * 0.5;
        const combinedFlow = flow * blend + counterFlow * (1 - blend);
        
        // Soft containment
        const containment = Math.pow(Math.min(1, dist / (FORM_SCALE * 0.8)), 4);
        const pull = containment * 0.08;
        
        // Mouse interaction - gentle attraction
        const mouseDx = mouseX - particle.x;
        const mouseDy = mouseY - particle.y;
        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        
        let mouseForceX = 0;
        let mouseForceY = 0;
        if (mouseDistance < 200 && mouseInfluence > 0.05) {
          const force = (mouseInfluence * 0.002) / (mouseDistance + 1);
          mouseForceX = mouseDx * force;
          mouseForceY = mouseDy * force;
        }
        
        // Apply motion
        particle.x = particle.x + (dx * combinedFlow) - (dx * pull) + mouseForceX;
        particle.y = particle.y + (dy * combinedFlow) - (dy * pull) + mouseForceY;
        particle.z = particle.z + Math.sin(time * 0.15 + dist * 2) * 0.008;
        
        // Keep particles in bounds
        if (particle.x < 0 || particle.x > canvas.width || 
            particle.y < 0 || particle.y > canvas.height) {
          // Respawn near center
          const respawnTheta = Math.random() * Math.PI * 2;
          const respawnR = Math.random() * 50;
          particle.x = centerX + Math.cos(respawnTheta) * respawnR;
          particle.y = centerY + Math.sin(respawnTheta) * respawnR;
        }
        
        // Draw particle with warm ochre colors
        const depthFactor = 1 + particle.z * 0.5;
        
        // Enhanced glow when near mouse
        const mouseGlow = mouseDistance < 120 ? (1 - mouseDistance / 120) * mouseInfluence : 0;
        const baseOpacity = 0.25 * depthFactor;
        const enhancedOpacity = Math.min(0.7, baseOpacity + mouseGlow * 0.4);
        const size = Math.max(0.5, 0.8 * depthFactor * (1 + mouseGlow * 0.3));
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(89, 65, 45, ${enhancedOpacity})`;
        ctx.fill();
        
        // Add glow for particles near mouse
        if (mouseGlow > 0.2) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 150, 100, ${mouseGlow * 0.3})`;
          ctx.fill();
        }
      });
      
      // Draw subtle mouse influence ripple
      if (mouseInfluence > 0.1) {
        const rippleAlpha = mouseInfluence * 0.2;
        const rippleRadius = (1 - mouseInfluence) * 80 + 15;
        
        ctx.strokeStyle = `rgba(180, 150, 100, ${rippleAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      
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