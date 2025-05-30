import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ErrorBoundary } from "react-error-boundary";
import Navigation from "./components/Navigation";
import ArtworkContainer from "./components/ArtworkContainer";
import { useArtwork } from "./lib/stores/useArtwork";

// Error fallback component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-900">
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-4">Something went wrong</h2>
        <pre className="text-sm text-stone-400">{error.message}</pre>
      </div>
    </div>
  );
}

// Poem welcome screen with water effect
function PoemScreen({ onContinue }: { onContinue: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    const ripples: Array<{x: number, y: number, time: number, maxRadius: number}> = [];

    const animate = () => {
      time += 0.008;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle water ripples
      ctx.strokeStyle = 'rgba(139, 115, 85, 0.08)';
      ctx.lineWidth = 1;
      
      // Gentle background waves
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        const amplitude = 12;
        const frequency = 0.003;
        const phase = i * 0.8 + time;
        
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = canvas.height / 2 + Math.sin(x * frequency + phase) * amplitude + i * 25 - 75;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      // Draw interactive ripples
      ripples.forEach((ripple, index) => {
        const age = time - ripple.time;
        if (age > 4) {
          ripples.splice(index, 1);
          return;
        }
        
        const radius = (age / 4) * ripple.maxRadius;
        const alpha = (1 - age / 4) * 0.2;
        
        ctx.strokeStyle = `rgba(139, 115, 85, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner ripple
        if (radius > 15) {
          ctx.strokeStyle = `rgba(180, 150, 100, ${alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, radius - 12, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      
      requestAnimationFrame(animate);
    };

    const handleClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        time: time,
        maxRadius: 80 + Math.random() * 40
      });
    };

    canvas.addEventListener('click', handleClick);
    animate();

    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50 flex items-center justify-center z-50 cursor-pointer"
      onClick={onContinue}
    >
      {/* Water effect canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      
      <div className="text-center max-w-2xl px-8 relative z-10">
        <h1 className="text-3xl zen-title text-stone-800 mb-8 drop-shadow-lg">When Code Meets Nature's Song</h1>
        
        <div className="text-stone-700 text-lg leading-relaxed mb-8 zen-subtitle drop-shadow-md">
          <p className="hover:text-stone-900 transition-colors duration-700">The morning dew on spider's thread,</p>
          <p className="hover:text-stone-900 transition-colors duration-700">Like gentle code that softly spreads,</p>
          <p className="hover:text-stone-900 transition-colors duration-700">Each particle knows where to go,</p>
          <p className="hover:text-stone-900 transition-colors duration-700">Following patterns nature chose</p>
        </div>
        
        <p className="text-stone-600 text-sm zen-subtitle mb-8 drop-shadow-sm">ard. by vinay thakur</p>
        
        {/* Gentle indicator to continue */}
        <div className="text-stone-500 text-xs animate-pulse">
          <p>Click anywhere to enter the gallery...</p>
        </div>
      </div>
    </div>
  );
}

// Simple loading fallback
function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-stone-600 text-sm">Loading...</div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { currentArtwork } = useArtwork();

  // Removed automatic timer - user must click to continue

  if (isLoading) {
    return <PoemScreen onContinue={() => setIsLoading(false)} />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-stone-50 via-stone-100 to-stone-50">
        
        {/* Main Content */}
        <div className="relative z-10 w-full h-full">
          <Suspense fallback={<Loading />}>
            <ArtworkContainer />
          </Suspense>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Ambient overlay */}
        <div className="fixed inset-0 bg-gradient-to-t from-stone-200/20 via-transparent to-transparent pointer-events-none z-5" />
        
        {/* Subtle grain texture */}
        <div 
          className="fixed inset-0 opacity-20 pointer-events-none z-5 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
