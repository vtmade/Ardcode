import { useEffect, useRef } from 'react';

export default function Artwork09_SacredCode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Digital Zen Garden - sacred geometry emerges from code
    let time = 0;
    const goldenRatio = 1.618033988749;
    
    // Sacred symbols and code fragments
    const codeFragments = [
      "const wisdom = () => silence;",
      "let enlightenment = void 0;",
      "return inner.peace();",
      "// The recursive nature of consciousness",
      "while(seeking) { find(); }"
    ];

    const animate = () => {
      time += 0.01;

      // Soft sand background
      ctx.fillStyle = '#0f0f0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw sacred geometry patterns
      drawFibonacciSpiral(ctx, centerX, centerY, time);
      drawCodeMandala(ctx, centerX, centerY, time);
      drawGoldenRatioVisualization(ctx, centerX, centerY, time);

      animationRef.current = requestAnimationFrame(animate);
    };

    function drawFibonacciSpiral(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) {
      ctx.strokeStyle = 'rgba(180, 170, 160, 0.3)';
      ctx.lineWidth = 1;
      
      // Generate fibonacci sequence
      const fib = [1, 1];
      for (let i = 2; i < 15; i++) {
        fib[i] = fib[i-1] + fib[i-2];
      }

      let angle = time * 0.1;
      let radius = 2;
      
      ctx.beginPath();
      for (let i = 0; i < fib.length; i++) {
        const scale = fib[i] * 0.5;
        const x = centerX + Math.cos(angle) * radius * scale * 0.1;
        const y = centerY + Math.sin(angle) * radius * scale * 0.1;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        angle += goldenRatio;
        radius *= 1.05;
      }
      ctx.stroke();
    }

    function drawCodeMandala(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) {
      const layers = 8;
      
      for (let layer = 0; layer < layers; layer++) {
        const radius = 50 + layer * 30;
        const segments = 6 + layer * 2;
        
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2 + time * 0.2 + layer * 0.5;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          // Sacred geometric shapes
          ctx.fillStyle = `rgba(200, 180, 140, ${0.1 + layer * 0.05})`;
          ctx.beginPath();
          
          if (layer % 3 === 0) {
            // Triangles
            const size = 8;
            ctx.moveTo(x, y - size);
            ctx.lineTo(x - size, y + size);
            ctx.lineTo(x + size, y + size);
            ctx.closePath();
          } else if (layer % 3 === 1) {
            // Circles
            ctx.arc(x, y, 4, 0, Math.PI * 2);
          } else {
            // Squares
            const size = 6;
            ctx.rect(x - size/2, y - size/2, size, size);
          }
          
          ctx.fill();
        }
      }
    }

    function drawGoldenRatioVisualization(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) {
      // Golden ratio rectangles
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1;
      
      let width = 89;
      let height = width / goldenRatio;
      
      for (let i = 0; i < 8; i++) {
        const rotation = time * 0.1 + i * 0.2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        
        ctx.strokeRect(-width/2, -height/2, width, height);
        
        // Draw the spiral curve
        ctx.beginPath();
        ctx.arc(width/2 - height, height/2 - height, height, 0, Math.PI/2);
        ctx.stroke();
        
        ctx.restore();
        
        // Prepare for next iteration
        const newWidth = height;
        height = width - height;
        width = newWidth;
        
        if (width < 1) break;
      }

      // Floating code fragments
      codeFragments.forEach((fragment, index) => {
        const angle = time * 0.05 + index * (Math.PI * 2 / codeFragments.length);
        const radius = 150 + Math.sin(time * 0.3 + index) * 20;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.fillStyle = `rgba(160, 160, 160, ${0.3 + Math.sin(time + index) * 0.2})`;
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI/2);
        ctx.fillText(fragment, 0, 0);
        ctx.restore();
      });
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#0f0f0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}