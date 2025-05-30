import React, { useEffect, useRef } from 'react';

export default function Artwork07_NatureCode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    // Points of origin from which patterns emerge
    const sources: Array<{
      x: number;
      y: number;
      wavelength: number;
      phase: number;
      driftX: number;
      driftY: number;
      driftSpeed: number;
    }> = [];
    const gridSize = 4;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        sources.push({
          x: width * (i + 0.5) / gridSize,
          y: height * (j + 0.5) / gridSize,
          wavelength: 15 + Math.random() * 10,
          phase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 2,
          driftY: (Math.random() - 0.5) * 2,
          driftSpeed: 0.0002 + Math.random() * 0.0003
        });
      }
    }

    let time = 0;
    let animationFrameId: number | null = null;

    const animate = () => {
      // Dark background to match gallery
      ctx.fillStyle = '#f9f9f9';
      ctx.fillRect(0, 0, width, height);

      // Warm ochre lines
      ctx.strokeStyle = 'rgba(89, 65, 45, 0.8)';
      ctx.lineWidth = 0.8;

      // Sample points for marching squares algorithm
      const resolution = 3;
      const rows = Math.floor(height / resolution);
      const cols = Math.floor(width / resolution);
      const field = new Array(rows).fill(0).map(() => new Array(cols).fill(0));

      // Update source positions with subtle drift
      sources.forEach(source => {
        source.x += Math.sin(time * source.driftSpeed + source.phase) * source.driftX;
        source.y += Math.cos(time * source.driftSpeed * 0.7 + source.phase) * source.driftY;
        
        // Keep sources within bounds with gentle wrapping
        if (source.x < 0) source.x = width;
        if (source.x > width) source.x = 0;
        if (source.y < 0) source.y = height;
        if (source.y > height) source.y = 0;
      });

      // Calculate wave field
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * resolution;
          const y = i * resolution;
          let amplitude = 0;

          sources.forEach(source => {
            const dx = x - source.x;
            const dy = y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            amplitude += Math.sin((distance / source.wavelength - time) * 2 * Math.PI + source.phase);
          });

          field[i][j] = amplitude / sources.length;
        }
      }

      // Draw contour lines using marching squares
      const contourLevels = [-0.6, -0.3, 0, 0.3, 0.6];
      
      contourLevels.forEach((level, levelIndex) => {
        // Vary opacity by contour level for depth
        const opacity = 0.3 + (levelIndex / contourLevels.length) * 0.4;
        ctx.strokeStyle = `rgba(139, 115, 85, ${opacity})`;
        ctx.beginPath();
        
        for (let i = 0; i < rows - 1; i++) {
          for (let j = 0; j < cols - 1; j++) {
            const x = j * resolution;
            const y = i * resolution;
            
            // Marching squares cases
            const case4 = 
              (field[i][j] > level ? 8 : 0) +
              (field[i][j + 1] > level ? 4 : 0) +
              (field[i + 1][j + 1] > level ? 2 : 0) +
              (field[i + 1][j] > level ? 1 : 0);
            
            // Draw line segments based on case
            switch (case4) {
              case 1: case 14:
                ctx.moveTo(x, y + resolution / 2);
                ctx.lineTo(x + resolution / 2, y + resolution);
                break;
              case 2: case 13:
                ctx.moveTo(x + resolution / 2, y + resolution);
                ctx.lineTo(x + resolution, y + resolution / 2);
                break;
              case 3: case 12:
                ctx.moveTo(x, y + resolution / 2);
                ctx.lineTo(x + resolution, y + resolution / 2);
                break;
              case 4: case 11:
                ctx.moveTo(x + resolution, y + resolution / 2);
                ctx.lineTo(x + resolution / 2, y);
                break;
              case 5: case 10:
                ctx.moveTo(x, y + resolution / 2);
                ctx.lineTo(x + resolution / 2, y);
                ctx.moveTo(x + resolution, y + resolution / 2);
                ctx.lineTo(x + resolution / 2, y + resolution);
                break;
              case 6: case 9:
                ctx.moveTo(x + resolution / 2, y);
                ctx.lineTo(x + resolution / 2, y + resolution);
                break;
              case 7: case 8:
                ctx.moveTo(x, y + resolution / 2);
                ctx.lineTo(x + resolution / 2, y);
                break;
            }
          }
        }
        
        ctx.stroke();
      });

      // Add subtle source indicators
      sources.forEach(source => {
        const pulseSize = 3 + Math.sin(time * 2 + source.phase) * 1;
        ctx.fillStyle = 'rgba(139, 115, 85, 0.2)';
        ctx.beginPath();
        ctx.arc(source.x, source.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      });

      time += 0.004; // Slightly faster for more visible movement
      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
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