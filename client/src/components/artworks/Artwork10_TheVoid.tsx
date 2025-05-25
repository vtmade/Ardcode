import { useEffect, useRef } from 'react';

export default function Artwork10_TheVoid() {
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

    // The void - a canvas that embraces nothingness
    let time = 0;
    const whispers: Array<{
      x: number;
      y: number;
      alpha: number;
      life: number;
    }> = [];

    const animate = () => {
      time += 0.001;

      // The color of deep space - almost black but with the faintest breath
      const depthAlpha = Math.sin(time) * 0.01 + 0.99;
      ctx.fillStyle = `rgba(8, 8, 8, ${depthAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Occasionally, the faintest suggestion of something
      if (Math.random() < 0.0001) {
        whispers.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          alpha: 0.001,
          life: 0
        });
      }

      // Render the whispers of existence
      whispers.forEach((whisper, index) => {
        whisper.life += 0.01;
        whisper.alpha = 0.05 * Math.exp(-whisper.life * 2);

        if (whisper.alpha > 0.001) {
          ctx.fillStyle = `rgba(180, 180, 180, ${whisper.alpha})`;
          ctx.beginPath();
          ctx.arc(whisper.x, whisper.y, 1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          whispers.splice(index, 1);
        }
      });

      // The paradox: showing emptiness requires showing something
      // But what we show is the container for nothingness
      
      animationRef.current = requestAnimationFrame(animate);
    };

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
      backgroundColor: '#080808',
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
      
      {/* The profound silence of code */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'rgba(120, 120, 120, 0.1)',
        fontSize: '14px',
        fontFamily: 'monospace',
        pointerEvents: 'none',
        textAlign: 'center'
      }}>
        {/* This space intentionally left blank */}
        <div style={{ opacity: 0.05 }}>
          // What remains when all code is removed?
        </div>
      </div>
    </div>
  );
}