import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ErrorBoundary } from "react-error-boundary";
import Navigation from "./components/Navigation";
import ArtworkContainer from "./components/ArtworkContainer";
import { useArtwork } from "./lib/stores/useArtwork";

// Error fallback component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 text-stone-100">
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-4">Something went wrong</h2>
        <pre className="text-sm text-stone-400">{error.message}</pre>
      </div>
    </div>
  );
}

// Loading component
function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center z-50">
      <div className="text-center">
        <h1 className="text-4xl font-serif text-stone-300 mb-4 animate-pulse">ARD</h1>
        <p className="text-stone-500 text-sm">Loading interactive art...</p>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { currentArtwork } = useArtwork();

  useEffect(() => {
    // Simulate loading time for smoother experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        
        {/* Main Content */}
        <div className="relative z-10 w-full h-full">
          <Suspense fallback={<Loading />}>
            <ArtworkContainer />
          </Suspense>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Ambient overlay */}
        <div className="fixed inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-5" />
        
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
