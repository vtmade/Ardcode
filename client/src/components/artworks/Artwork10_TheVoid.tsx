import React, { useEffect, useRef } from 'react';

export default function Artwork10_TheVoid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
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
    
    // Points of potential - sources of wave interference
    const createSources = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      return [
        { x: width/2, y: height/2 },      // Center of unknowing
        { x: width/4, y: height/4 },      // Each point
        { x: 3*width/4, y: height/4 },    // contributes
        { x: width/4, y: 3*height/4 },    // to the
        { x: 3*width/4, y: 3*height/4 },  // emerging
        { x: width/2, y: height/5 },      // whole
        { x: width/2, y: 4*height/5 },    // pattern
        { x: mouseX, y: mouseY }          // Interactive source
      ];
    };
    
    const wavelength = 35; // Longer wavelength for gentler patterns
    
    const animate = () => {
      time += 0.008; // Slower, more meditative movement
      
      // Gradually reduce mouse influence
      mouseInfluence *= 0.95;
      
      const width = canvas.width;
      const height = canvas.height;
      const sources = createSources();
      
      // Light background to match gallery
      ctx.fillStyle = '#f9f9f9';
      ctx.fillRect(0, 0, width, height);
      
      // Create image data for pixel manipulation
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      
      // Calculate wave interference for each pixel
      for (let y = 0; y < height; y += 2) { // Skip every other pixel for performance
        for (let x = 0; x < width; x += 2) {
          let amplitude = 0;
          
          // Sum waves from all sources
          sources.forEach((source, i) => {
            const dx = x - source.x;
            const dy = y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const phase = i * Math.PI / 3; // Different phase for each source
            
            // Enhanced wave for mouse source
            const isMouseSource = i === sources.length - 1;
            const mouseBoost = isMouseSource ? (1 + mouseInfluence * 2) : 1;
            
            amplitude += Math.sin((distance / wavelength - time) * 2 * Math.PI + phase) * mouseBoost;
          });
          
          // Normalize and threshold - gentler interference
          const normalized = amplitude / sources.length;
          const threshold = 0.08 + mouseInfluence * 0.05; // Softer threshold for subtlety
          
          // Determine if this is a line point
          const isLine = Math.abs(normalized) < threshold;
          
          // Set pixel color - fill 2x2 blocks for performance
          for (let dy = 0; dy < 2 && y + dy < height; dy++) {
            for (let dx = 0; dx < 2 && x + dx < width; dx++) {
              const index = ((y + dy) * width + (x + dx)) * 4;
              
              if (isLine) {
                // Gentle warm ochre lines with soft intensity
                const mouseDistance = Math.sqrt((x + dx - mouseX) ** 2 + (y + dy - mouseY) ** 2);
                const proximity = Math.exp(-mouseDistance / 150); // Gentler proximity effect
                const intensity = 0.4 + mouseInfluence * proximity * 0.2; // Much softer base intensity
                
                data[index] = Math.floor(89 * intensity);      // R - darker
                data[index + 1] = Math.floor(65 * intensity);  // G - darker
                data[index + 2] = Math.floor(45 * intensity);  // B - darker
                data[index + 3] = Math.floor(180 * intensity); // A - softer opacity
              } else {
                // Light background
                data[index] = 249;     // R
                data[index + 1] = 249; // G
                data[index + 2] = 249; // B
                data[index + 3] = 255; // A
              }
            }
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Draw gentle mouse influence ripple
      if (mouseInfluence > 0.1) {
        const rippleAlpha = mouseInfluence * 0.15; // Much softer ripples
        const rippleRadius = (1 - mouseInfluence) * 80 + 15; // Smaller, gentler ripples
        
        ctx.strokeStyle = `rgba(180, 150, 100, ${rippleAlpha})`;
        ctx.lineWidth = 1; // Thinner lines
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner ripple - very subtle
        const innerAlpha = mouseInfluence * 0.08;
        const innerRadius = rippleRadius * 0.6;
        ctx.strokeStyle = `rgba(139, 115, 85, ${innerAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, innerRadius, 0, Math.PI * 2);
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