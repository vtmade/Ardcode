import { useEffect, useRef } from 'react';

export default function Artwork08_QuantumField() {
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

    // Whisper Threads - text emerges from invisible threads
    let time = 0;
    const whispers: Array<{
      message: string;
      progress: number;
      speed: number;
      threads: Array<{
        char: string;
        x: number;
        y: number;
        alpha: number;
        emergence: number;
        vibration: number;
      }>;
    }> = [];

    const messages = [
      "consciousness flows like code",
      "thoughts weave reality",
      "silence speaks volumes",
      "between the lines",
      "invisible architectures"
    ];

    // Initialize whisper threads
    messages.forEach((message, index) => {
      const whisper = {
        message,
        progress: 0,
        speed: 0.008,
        threads: [] as any[]
      };

      // Create invisible threads between characters
      for (let i = 0; i < message.length; i++) {
        const startX = canvas.width * 0.2;
        const endX = canvas.width * 0.8;
        const baseY = canvas.height * 0.3 + index * 60;

        whisper.threads.push({
          char: message[i],
          x: startX + (endX - startX) * (i / message.length),
          y: baseY + Math.sin(i * 0.5) * 20,
          alpha: 0,
          emergence: i * 0.1,
          vibration: 0.5 + Math.random()
        });
      }

      whispers.push(whisper);
    });

    const animate = () => {
      time += 0.016;

      // Deep space background
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and render whisper threads
      whispers.forEach((whisper, whisperIndex) => {
        whisper.progress += whisper.speed;

        whisper.threads.forEach((thread, threadIndex) => {
          const localProgress = whisper.progress - thread.emergence;

          if (localProgress > 0) {
            thread.alpha = Math.min(localProgress * 2, 1) * 
                          (0.7 + Math.sin(time * 0.01 * thread.vibration) * 0.3);

            // Gentle floating motion
            thread.y += Math.sin(time * 0.003 + threadIndex) * 0.1;
          }

          // Render the character
          if (thread.alpha > 0) {
            ctx.fillStyle = `rgba(160, 180, 200, ${thread.alpha})`;
            ctx.font = '16px Georgia';
            ctx.textAlign = 'center';
            ctx.fillText(thread.char, thread.x, thread.y);

            // Add subtle glow
            ctx.fillStyle = `rgba(200, 220, 240, ${thread.alpha * 0.3})`;
            ctx.fillText(thread.char, thread.x + 0.5, thread.y + 0.5);

            // Draw connecting threads between characters
            if (threadIndex > 0 && whisper.threads[threadIndex - 1].alpha > 0) {
              const prevThread = whisper.threads[threadIndex - 1];
              ctx.strokeStyle = `rgba(120, 140, 160, ${Math.min(thread.alpha, prevThread.alpha) * 0.2})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(prevThread.x, prevThread.y);
              ctx.lineTo(thread.x, thread.y);
              ctx.stroke();
            }
          }
        });

        // Reset whisper when complete
        if (whisper.progress > whisper.threads.length * 0.1 + 2) {
          whisper.progress = -Math.random() * 2; // Random delay before restarting
        }
      });

      // Add quantum field effects - subtle particle whispers
      if (Math.random() < 0.02) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        ctx.fillStyle = `rgba(100, 120, 140, ${Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 2 + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

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
      backgroundColor: '#0a0a0f',
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