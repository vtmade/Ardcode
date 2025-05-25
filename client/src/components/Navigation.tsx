import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Home, Menu, X } from "lucide-react";
import { useArtwork } from "@/lib/stores/useArtwork";
import { ARTWORKS } from "@/types/artwork";

export default function Navigation() {
  const { currentArtwork, setCurrentArtwork } = useArtwork();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Auto-hide navigation after inactivity
  useEffect(() => {
    const handleActivity = () => {
      setLastInteraction(Date.now());
      setIsVisible(true);
    };

    const checkInactivity = () => {
      if (Date.now() - lastInteraction > 3000) {
        setIsVisible(false);
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touch', handleActivity);

    const interval = setInterval(checkInactivity, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touch', handleActivity);
      clearInterval(interval);
    };
  }, [lastInteraction]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        previousArtwork();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        nextArtwork();
      } else if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentArtwork]);

  const nextArtwork = () => {
    const nextIndex = (currentArtwork + 1) % ARTWORKS.length;
    setCurrentArtwork(nextIndex);
  };

  const previousArtwork = () => {
    const prevIndex = currentArtwork === 0 ? ARTWORKS.length - 1 : currentArtwork - 1;
    setCurrentArtwork(prevIndex);
  };

  const currentArtworkData = ARTWORKS[currentArtwork];

  return (
    <>
      {/* Main Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="glass p-4 m-4 rounded-lg">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <h1 className="zen-title text-2xl tracking-widest">ARD</h1>
              <div className="hidden md:block w-px h-6 bg-stone-600" />
              <span className="hidden md:block zen-subtitle text-sm">
                Interactive Art Gallery
              </span>
            </div>

            {/* Current Artwork Info */}
            <div className="flex-1 text-center mx-8">
              <h2 className="zen-title text-lg mb-1">{currentArtworkData.title}</h2>
              <p className="zen-subtitle text-xs">{currentArtworkData.philosophy}</p>
              <div className="flex justify-center mt-2">
                <div className="text-xs zen-subtitle">
                  {String(currentArtwork + 1).padStart(2, '0')} / {String(ARTWORKS.length).padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={previousArtwork}
                className="p-2 rounded-lg glass hover:bg-stone-700/20 transition-colors"
                title="Previous artwork (←)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextArtwork}
                className="p-2 rounded-lg glass hover:bg-stone-700/20 transition-colors"
                title="Next artwork (→)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg glass hover:bg-stone-700/20 transition-colors ml-2"
                title="Menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-stone-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((currentArtwork + 1) / ARTWORKS.length) * 100}%` }}
            />
          </div>
        </div>
      </nav>

      {/* Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="glass h-full p-6 m-4 rounded-lg overflow-y-auto">
          <div className="mb-6">
            <h3 className="zen-title text-xl mb-2">Gallery</h3>
            <p className="zen-subtitle text-sm">
              Explore philosophical concepts through interactive art
            </p>
          </div>

          <div className="space-y-3">
            {ARTWORKS.map((artwork, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentArtwork(index);
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  index === currentArtwork 
                    ? 'bg-primary/20 border border-primary/40' 
                    : 'glass hover:bg-stone-700/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="zen-subtitle text-xs">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    artwork.type === '3D' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                  }`}>
                    {artwork.type}
                  </span>
                </div>
                <h4 className="zen-title text-sm mb-1">{artwork.title}</h4>
                <p className="zen-subtitle text-xs opacity-70">{artwork.philosophy}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-stone-700">
            <div className="zen-subtitle text-xs space-y-2">
              <p><strong>Controls:</strong></p>
              <p>← → or A/D: Navigate</p>
              <p>Mouse/Touch: Interact</p>
              <p>ESC: Close menu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Bottom Instructions (only show when navigation is visible) */}
      <div className={`fixed bottom-4 left-4 right-4 z-30 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="glass p-3 rounded-lg">
          <div className="flex items-center justify-center space-x-6 zen-subtitle text-xs">
            <span>Use mouse/touch to interact with the artwork</span>
            <span>•</span>
            <span>← → to navigate</span>
            <span>•</span>
            <span>Menu for artwork list</span>
          </div>
        </div>
      </div>
    </>
  );
}
