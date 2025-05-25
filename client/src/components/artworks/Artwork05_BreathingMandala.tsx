import { useRef, useEffect } from 'react';

export default function Artwork05_BreathingMandala() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    
    // Parameters
    const numShapes = 3;
    const contoursPerShape = 25;
    const points = 100;
    let time = 0;
    
    // Scale factor - 50% larger
    const scaleFactor = 1.5;
    
    // Project colors
    const backgroundColor = '#0a0a0a'; // Dark background to match gallery
    const lineColor = 'rgba(139, 115, 85, 0.4)'; // Warm ochre with transparency
    
    let animationId: number | null = null;
    
    function draw() {
      // Clear canvas with cream background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      
      // Increment time (slowed down)
      time += 0.001;
      
      // Central point
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Draw each form as it empties and returns to source
      for (let shapeIndex = 0; shapeIndex < numShapes; shapeIndex++) {
        // Each shape has its own phase and movement
        const shapePhase = time + shapeIndex * Math.PI * 2 / numShapes;
        
        // Shape center offsets (moves shapes relative to each other, slowed down)
        const offsetX = Math.sin(shapePhase * 0.2) * 40 * scaleFactor;
        const offsetY = Math.cos(shapePhase * 0.3) * 40 * scaleFactor;
        
        // Draw contour lines for this shape
        for (let contour = 0; contour < contoursPerShape; contour++) {
          // Scale each contour (smaller to larger) - now 50% larger
          const scale = (30 + contour * 3) * scaleFactor;
          
          // Slight offset for each contour to create dimensional effect
          const contourOffsetX = Math.sin(contour * 0.2 + shapePhase) * 10 * scaleFactor;
          const contourOffsetY = Math.cos(contour * 0.2 + shapePhase) * 10 * scaleFactor;
          
          // Begin drawing the contour
          ctx.beginPath();
          
          // Set line style - dark gray with transparency
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 0.8;
          
          // Generate points - finding peace through continuous motion
          for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            
            // Base radius with noise - now 50% larger
            let radius = scale;
            
            // Add complexity with multiple sine waves at different frequencies
            radius += 15 * Math.sin(angle * 3 + shapePhase * 2) * scaleFactor;
            radius += 10 * Math.cos(angle * 5 - shapePhase) * scaleFactor;
            radius += 5 * Math.sin(angle * 8 + contour * 0.1) * scaleFactor;
            
            // Calculate point position
            const x = centerX + offsetX + contourOffsetX + Math.cos(angle) * radius;
            const y = centerY + offsetY + contourOffsetY + Math.sin(angle) * radius;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          
          // Close the path and stroke
          ctx.closePath();
          ctx.stroke();
        }
      }
      
      animationId = requestAnimationFrame(draw);
    }
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    animationId = requestAnimationFrame(draw);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
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